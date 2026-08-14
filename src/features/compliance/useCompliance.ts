/**
 * Compliance data derivations for the /cumplimiento route.
 *
 * The legacy prototype (reference/legacy_vanilla/js/dashboard.js →
 * calculateComplianceScores) only computed the three ISO score
 * percentages; the "Requisitos ISO Mapeados" grid on pg-comp
 * (SolinalGestiona_MVP.html#compliance-mapping-container) was a dead
 * placeholder — `<!-- Dinámico -->` with no renderer wired to it anywhere
 * in the legacy JS. Everything below the score formula is this feature's
 * own reasonable reconstruction, built ONLY from fields that already
 * exist in src/data/seed.ts (no invented documents/templates).
 */
import { useMemo } from "react";
import { useAppState } from "@/context/AppStateContext";
import type { DocumentType, SolinalDocument } from "@/data/seed";

export type ComplianceStatus = "valid" | "warning" | "danger";

export interface IsoScore {
  norma: string;
  label: string;
  sub: string;
  score: number;
  status: ComplianceStatus;
}

export interface RequirementRow {
  key: string;
  norma: string;
  type: DocumentType;
  label: string;
  status: ComplianceStatus;
  detail: string;
}

export interface ComplianceAlert {
  id: string;
  title: string;
  detail: string;
}

/** Ported verbatim from js/dashboard.js calculateComplianceScores(). */
const NORMS = [
  {
    norma: "ISO 9001:2015",
    label: "ISO 9001:2015 (Calidad)",
    sub: "Requisitos cubiertos con documentación aprobada.",
    base: 40,
    step: 15,
  },
  {
    norma: "ISO 14001:2015",
    label: "ISO 14001:2015 (Ambiente)",
    sub: "Control ambiental y registros asociados.",
    base: 50,
    step: 16,
  },
  {
    norma: "ISO 22000:2018",
    label: "ISO 22000:2018 (Inocuidad)",
    sub: "Planes de inocuidad y verificación HACCP.",
    base: 35,
    step: 13,
  },
] as const;

/**
 * Score → status color thresholds. Not specified anywhere in the legacy
 * app (the sc cards there just used fixed inline colors); this mapping is
 * an assumption made to satisfy the "status colors per score range"
 * requirement — flagged in the final report.
 */
export function scoreStatus(score: number): ComplianceStatus {
  if (score >= 80) return "valid";
  if (score >= 50) return "warning";
  return "danger";
}

export function useComplianceScores(): IsoScore[] {
  const { state } = useAppState();
  return useMemo(() => {
    const approved = state.documents.filter((d) => d.estado === "Aprobado");
    return NORMS.map(({ norma, label, sub, base, step }) => {
      const count = approved.filter((d) => d.norma === norma).length;
      const score = Math.min(100, base + count * step);
      return { norma, label, sub, score, status: scoreStatus(score) };
    });
  }, [state.documents]);
}

function statusForDocs(docs: SolinalDocument[]): {
  status: ComplianceStatus;
  detail: string;
} {
  if (docs.length === 0) {
    return { status: "danger", detail: "Sin documentos asociados vigentes." };
  }
  const validDoc = docs.find((d) => d.estado === "Aprobado" && !d.vencido);
  if (validDoc) {
    return {
      status: "valid",
      detail: `Cubierto por ${validDoc.code} (${validDoc.version}, aprobado).`,
    };
  }
  const expiredDoc = docs.find((d) => d.estado === "Aprobado" && d.vencido);
  if (expiredDoc) {
    return {
      status: "warning",
      detail: `${expiredDoc.code} está vencido — requiere renovación de firmas.`,
    };
  }
  const inFlight = docs[0];
  return {
    status: "warning",
    detail: `${inFlight.code} en estado "${inFlight.estado}" — aún sin aprobación.`,
  };
}

/**
 * Requirement rows = union of every (norma, tipo) pair present across the
 * template catalog and the document library. A requirement is "valid" if
 * at least one approved, non-expired document backs it; "warning" if a
 * document exists but isn't approved (or is approved-but-vencido);
 * "danger" (orphan) if no document of that norma+type exists at all.
 */
export function useRequirementMapping(): RequirementRow[] {
  const { state } = useAppState();
  return useMemo(() => {
    const pairs = new Map<string, { norma: string; type: DocumentType }>();
    state.templates.forEach((t) =>
      pairs.set(`${t.norma}|${t.type}`, { norma: t.norma, type: t.type }),
    );
    state.documents.forEach((d) =>
      pairs.set(`${d.norma}|${d.type}`, { norma: d.norma, type: d.type }),
    );

    return Array.from(pairs.entries())
      .map(([key, { norma, type }]) => {
        const matchingTemplate = state.templates.find(
          (t) => t.norma === norma && t.type === type,
        );
        const matchingDocs = state.documents.filter(
          (d) => d.norma === norma && d.type === type,
        );
        const { status, detail } = statusForDocs(matchingDocs);
        return {
          key,
          norma,
          type,
          label: matchingTemplate ? matchingTemplate.name : `${type} — ${norma}`,
          status,
          detail,
        };
      })
      .sort(
        (a, b) => a.norma.localeCompare(b.norma) || a.type.localeCompare(b.type),
      );
  }, [state.documents, state.templates]);
}

/**
 * Legacy pg-comp had two hardcoded alert-cards ("3 documentos en revisión
 * sin actividad" / "ISO 22000 cap. 7.5 sin documentos"). The seed schema
 * has no "last moved" timestamp per document, so the "15 días sin
 * movimiento" wording can't be reproduced literally — here it's simplified
 * to "documents currently parked in the En aprobación state", and the
 * orphan-requirement alert is generated dynamically from
 * useRequirementMapping() instead of being a fixed string.
 */
export function useComplianceAlerts(): ComplianceAlert[] {
  const { state } = useAppState();
  const requirements = useRequirementMapping();

  return useMemo(() => {
    const alerts: ComplianceAlert[] = [];

    const stuck = state.documents.filter((d) => d.estado === "En aprobación");
    if (stuck.length > 0) {
      alerts.push({
        id: "stuck-review",
        title: "Documentos en revisión sin resolver",
        detail: `${stuck.length} documento(s) permanecen en flujo de aprobación: ${stuck
          .map((d) => d.code)
          .join(", ")}.`,
      });
    }

    requirements
      .filter((r) => r.status === "danger")
      .forEach((r) => {
        alerts.push({
          id: `orphan-${r.key}`,
          title: "Requisito huérfano de documentación",
          detail: `${r.norma} no tiene documentos de tipo "${r.type}" asociados vigentes.`,
        });
      });

    const expired = state.documents.filter((d) => d.vencido && d.estado === "Aprobado");
    if (expired.length > 0) {
      alerts.push({
        id: "expired-docs",
        title: "Documentos vigentes vencidos",
        detail: `${expired.length} documento(s) requieren renovación de firmas: ${expired
          .map((d) => d.code)
          .join(", ")}.`,
      });
    }

    return alerts;
  }, [state.documents, requirements]);
}
