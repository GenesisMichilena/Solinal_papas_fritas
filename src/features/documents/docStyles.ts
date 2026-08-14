/**
 * Presentation helpers for the Documentos table: document-type "tag" badges
 * and estado/vencido "status" badges.
 *
 * DOCUMENT TYPE -> TAG COLOR MAPPING
 * ----------------------------------
 * DESIGN_SYSTEM.md ties document-type badges to the Lovable "tag" palette,
 * which only defines 4 hues (sanitary / permit / lab / technical) while the
 * legacy app has 5 document types (Procedimiento, Política, Instructivo,
 * Manual, Checklist). Mapping chosen (documented per DESIGN_SYSTEM.md
 * section 8 reporting requirement):
 *
 *   Procedimiento -> technical (blue)   - core operational/process document
 *   Política      -> permit    (amber)  - top-level authorization/mandate,
 *                                         same "grants authority" semantics
 *                                         as a permit
 *   Manual        -> lab       (purple) - consolidated reference document,
 *                                         analogous to a lab report bundle
 *   Instructivo   -> sanitary  (red)    - in this dataset, instructivos are
 *                                         hygiene/CIP cleaning docs, i.e.
 *                                         sanitary-flavored content
 *   Checklist     -> NEW "checklist" tag (teal, hue 195) - no existing
 *                    Lovable tag fits a verification/audit-style document,
 *                    so a 5th tag hue was added following the same
 *                    oklch(<lightness> <chroma> <hue>) pattern as the other
 *                    4 tag tokens. Promoted in Phase 2 (integration-qa) from
 *                    a feature-local arbitrary Tailwind value into a proper
 *                    `--tag-checklist` / `--tag-checklist-bg` token pair in
 *                    src/styles.css, for consistency with the other 4.
 */
import type { DocumentStatus, DocumentType } from "@/data/seed";

export const docTypeBadgeClass: Record<DocumentType, string> = {
  Procedimiento: "border-tag-technical/40 bg-tag-technical-bg text-tag-technical",
  Política: "border-tag-permit/40 bg-tag-permit-bg text-tag-permit",
  Manual: "border-tag-lab/40 bg-tag-lab-bg text-tag-lab",
  Instructivo: "border-tag-sanitary/40 bg-tag-sanitary-bg text-tag-sanitary",
  Checklist: "border-tag-checklist/40 bg-tag-checklist-bg text-tag-checklist",
};

/** Estado (+ vencido override) -> status badge classes, using the shared
 * status-valid / status-warning / status-danger tokens from styles.css. */
export function statusBadgeClass(estado: DocumentStatus, vencido: boolean): string {
  if (vencido) return "border-status-danger/30 bg-status-danger/10 text-status-danger";
  switch (estado) {
    case "Aprobado":
      return "border-status-valid/30 bg-status-valid/10 text-status-valid";
    case "En aprobación":
      return "border-status-warning/40 bg-status-warning/15 text-status-warning";
    case "Rechazado":
      return "border-status-danger/30 bg-status-danger/10 text-status-danger";
    case "Borrador":
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

export function statusLabel(estado: DocumentStatus, vencido: boolean): string {
  return vencido ? "Vencido" : estado;
}

export const normaOptions = ["ISO 9001:2015", "ISO 14001:2015", "ISO 22000:2018"] as const;

export const documentTypeOptions: DocumentType[] = [
  "Procedimiento",
  "Política",
  "Instructivo",
  "Manual",
  "Checklist",
];
