import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { EyeOff, GitMerge, History } from "lucide-react";

import { useAppState } from "@/context/AppStateContext";
import type { SolinalDocument } from "@/data/seed";
import { Button } from "@/components/ui/button";
import { AiToolbox } from "@/features/editor/AiToolbox";
import { ContentEditor } from "@/features/editor/ContentEditor";
import { esRegistroPorNivel } from "@/features/documents/docStyles";
import { GuidePanel } from "@/features/editor/GuidePanel";
import { MergeDialog } from "@/features/editor/MergeDialog";
import { MetadataForm } from "@/features/editor/MetadataForm";
import { RegulationBanner } from "@/features/editor/RegulationBanner";
import { ScannerDialog } from "@/features/editor/ScannerDialog";
import { SummaryDialog } from "@/features/editor/SummaryDialog";
import { VersionHistoryDialog } from "@/features/editor/VersionHistoryDialog";
import {
  mergeResolutionText,
  NORMA_CON_CAMBIO_PENDIENTE,
  REGULATION_UPDATE_MARKER,
  regulationUpdateText,
  scannerImportText,
} from "@/features/editor/aiEngine";

/** Port of legacy js/editor.js — "Editor & Asistente IA" page (pg-edit). */
export default function EditorPage() {
  const { state, dispatch } = useAppState();
  const [searchParams] = useSearchParams();
  const requestedCode = searchParams.get("doc");

  const activeCode = requestedCode ?? state.session.activeDocCode;
  const doc = useMemo(
    () => state.documents.find((d) => d.code === activeCode) ?? state.documents[0],
    [state.documents, activeCode],
  );

  // Keep session.activeDocCode in sync with the ?doc= query param, exactly
  // like legacy loadDocumentToEditor(code) being called on navigation.
  useEffect(() => {
    if (doc && doc.code !== state.session.activeDocCode) {
      dispatch({ type: "SET_ACTIVE_DOC", payload: { code: doc.code } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.code]);

  const [regulationBannerVisible, setRegulationBannerVisible] = useState(false);

  // Auto-alert: opening a document filed under a norma with a pending
  // international update shows the regulatory-change banner right away,
  // instead of requiring the manual "Simular cambio de ley" trigger.
  useEffect(() => {
    if (!doc) return;
    const affected =
      doc.norma === NORMA_CON_CAMBIO_PENDIENTE && !doc.content.includes(REGULATION_UPDATE_MARKER);
    setRegulationBannerVisible(affected);
    if (affected) {
      toast.warning(
        `El documento ${doc.code} está regido por ${doc.norma}, una normativa con actualización internacional pendiente.`,
      );
      dispatch({
        type: "ADD_AUDIT_LOG",
        payload: { action: `Recibió alerta de actualización de norma ${doc.norma} al abrir ${doc.code}` },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.code]);

  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  const { activeUser, activeRole } = state.session;
  const isLector = activeRole === "Lector";

  if (isLector) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-24 text-center">
        <EyeOff className="size-8 text-muted-foreground" />
        <h2 className="text-lg font-bold">Acceso restringido</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Tu rol de Lector solo permite consultar documentos aprobados. El Editor &amp;
          Asistente IA está reservado a roles de edición/aprobación.
        </p>
        <Button asChild size="sm">
          <Link to="/documentos">Volver a Documentos</Link>
        </Button>
      </div>
    );
  }

  if (!doc) {
    return <div className="text-sm text-muted-foreground">No hay documentos disponibles.</div>;
  }

  function audit(action: string) {
    dispatch({ type: "ADD_AUDIT_LOG", payload: { action } });
  }

  function updateDoc(changes: Partial<SolinalDocument>) {
    dispatch({ type: "UPDATE_DOCUMENT", payload: { code: doc.code, changes } });
  }

  function appendContent(text: string) {
    updateDoc({ content: doc.content + text });
  }

  // --- toggle bloqueo de sección (G03 Scenario 2) --------------------------
  function handleToggleLock() {
    const isOwner = activeUser === doc.creador || activeRole === "Administrador";
    if (!isOwner) {
      toast.error("Solo el dueño o creador del documento puede modificar las restricciones de bloqueo.");
      return;
    }
    const next = !state.session.isSectionLocked;
    dispatch({ type: "SET_SECTION_LOCKED", payload: { locked: next } });
    toast.success(next ? "Sección crítica bloqueada para no-propietarios." : "Sección desbloqueada.");
  }

  // --- guardar nueva versión (G02 Scenario 1) -------------------------------
  function handleSaveVersion() {
    const currentVer = parseFloat(doc.version.replace("v", ""));
    const nextVer = `v${(currentVer + 0.1).toFixed(1)}`;
    const revisionEntry = `${doc.version} - Modificado el ${new Date().toISOString().slice(0, 10)} por ${activeUser}: ${doc.title}`;

    dispatch({
      type: "UPDATE_DOCUMENT",
      payload: {
        code: doc.code,
        changes: {
          version: nextVer,
          revisiones: [revisionEntry, ...doc.revisiones],
        },
      },
    });
    toast.success(`Nueva versión ${nextVer} guardada con éxito.`);
    audit(`Creó la versión ${nextVer} del documento ${doc.code}`);
  }

  // --- comentarios (G02 Scenario 4) -----------------------------------------
  function handleAddComment(text: string) {
    dispatch({
      type: "ADD_COMMENT",
      payload: {
        code: doc.code,
        author: activeUser,
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
        text,
      },
    });
    toast.success("Comentario añadido al hilo de discusión.");
    audit(`Añadió un comentario en documento ${doc.code}`);
  }

  // --- firmas electrónicas (G03 Scenario 1 + G07 Scenario 4) ----------------
  function handleSign() {
    if (activeRole !== "Aprobador" && activeRole !== "Administrador") {
      toast.error("Acción bloqueada: Solo los roles de Aprobador o Administrador pueden firmar este documento.");
      audit(`Intento fallido de firma en ${doc.code} por ${activeUser} (Rol: ${activeRole})`);
      return;
    }

    // Guardia adicional: si el documento viene de una plantilla con roles
    // esperados definidos, el firmante debe coincidir con el revisor o
    // aprobador que la plantilla exige. Administrador siempre puede firmar
    // (mismo criterio que el resto de la app — ver Usuarios.tsx/handleToggleLock).
    const rolesEsperados = doc.rolesRequeridos;
    if (
      rolesEsperados &&
      activeRole !== "Administrador" &&
      activeRole !== rolesEsperados.aprobador &&
      activeRole !== rolesEsperados.revisor
    ) {
      toast.error(`Este documento requiere firma de ${rolesEsperados.revisor} o ${rolesEsperados.aprobador}.`);
      audit(
        `Intento no autorizado de firma en ${doc.code} por ${activeUser} (Rol: ${activeRole}, se esperaba ${rolesEsperados.aprobador})`,
      );
      return;
    }

    if (doc.signatures.includes(activeUser)) {
      toast.warning("Ya has firmado este documento.");
      return;
    }

    const nextSignatures = [...doc.signatures, activeUser];

    if (doc.critico && state.config.doubleApproval === "critical") {
      if (nextSignatures.length < 2) {
        updateDoc({ signatures: nextSignatures, estado: "En aprobación" });
        toast.warning("Firma 1/2 agregada. Pendiente de co-firma de un segundo aprobador.");
        audit(`Añadió primera firma electrónica al documento crítico ${doc.code}`);
      } else {
        updateDoc({ signatures: nextSignatures, estado: "Aprobado", vencido: false });
        toast.success("Firma 2/2 agregada. El documento pasa a estado Vigente / Aprobado.");
        audit(`Documento crítico ${doc.code} aprobado con firmas completas`);
      }
    } else {
      updateDoc({ signatures: nextSignatures, estado: "Aprobado", vencido: false });
      toast.success("Firma colocada. Documento aprobado de forma oficial.");
      audit(`Firmó y aprobó el documento ${doc.code}`);
    }
  }

  // --- historial de versiones -----------------------------------------------
  function handleRestoreVersion(idx: number) {
    const revisionText = doc.revisiones[idx];
    const oldVer = revisionText.split(" - ")[0];
    updateDoc({
      content: `<p><em>[Versión Restaurada de ${oldVer}]</em></p>${doc.content}`,
      version: oldVer,
    });
    toast.success(`Versión ${oldVer} restaurada con éxito en el borrador.`);
    audit(`Restauró documento ${doc.code} a la versión ${oldVer}`);
  }

  // --- fusión concurrente simulada (G02 Scenario 2) --------------------------
  function handleConfirmMerge() {
    appendContent(mergeResolutionText);
    toast.success("Cambios fusionados e integrados al borrador.");
    audit(`Consolidó cambios concurrentes en documento ${doc.code}`);
  }

  // --- escaner de formato físico (G04 Scenario 4) -----------------------------
  function handleScanComplete() {
    appendContent(scannerImportText);
    toast.success("Escaneo completado. Datos importados.");
    audit("Escaneó formato físico e importó datos al editor");
  }

  // --- simulador de cambio normativo (G01 Scenario 4) --------------------------
  function handleSimulateRegulation() {
    setRegulationBannerVisible(true);
    toast.warning("Se ha recibido una alerta de actualización regulatoria internacional.");
    audit("Recibió alerta de actualización de norma ISO internacional");
  }

  function handleApplyRegulation() {
    appendContent(regulationUpdateText);
    setRegulationBannerVisible(false);
    toast.success("Cambios regulatorios ISO 22000:2026 aplicados al borrador.");
  }

  function handleSummaryGenerated(count: number) {
    toast.success("Resumen consolidado generado.");
    audit(`Generó resumen consolidado IA de ${count} documentos`);
  }

  // Lector role already receives the "Acceso restringido" early return above,
  // so any role reaching this point is implicitly allowed to comment.
  const canComment = true;

  // Un Registro firmado es evidencia congelada — su contenido ya no puede
  // editarse (ver docStyles.esRegistroPorNivel).
  const contenidoBloqueado = esRegistroPorNivel(doc.nivel) && doc.signatures.length > 0;

  return (
    <div className="flex flex-col gap-4.5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Editor &amp; Asistente IA
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea, edita, firma e implementa controles de calidad asistido por Inteligencia
            Artificial y cumplimiento regulatorio.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setVersionModalOpen(true)}>
            <History className="size-3.5" /> Historial de versiones
          </Button>
        </div>
      </div>

      <RegulationBanner visible={regulationBannerVisible} onApply={handleApplyRegulation} />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4.5">
          <MetadataForm doc={doc} />
          <ContentEditor
            doc={doc}
            activeUser={activeUser}
            activeRole={activeRole}
            isSectionLocked={state.session.isSectionLocked}
            comments={state.comments.filter((c) => c.code === doc.code)}
            readOnly={contenidoBloqueado}
            canComment={canComment}
            onContentChange={(content) => updateDoc({ content })}
            onToggleLock={handleToggleLock}
            onSaveVersion={handleSaveVersion}
            onAddComment={handleAddComment}
            onSign={handleSign}
          />
        </div>

        <div className="flex flex-col gap-4.5">
          <GuidePanel doc={doc} />

          <AiToolbox
            onInsertText={(text) => {
              appendContent(text);
              toast.success("Sugerencia de la IA insertada al borrador.");
            }}
            onOpenSummary={() => setSummaryModalOpen(true)}
            onOpenScanner={() => setScannerModalOpen(true)}
            onSimulateRegulation={handleSimulateRegulation}
            onAudit={audit}
          />
        </div>
      </div>

      <VersionHistoryDialog
        open={versionModalOpen}
        onOpenChange={setVersionModalOpen}
        doc={doc}
        onRestore={handleRestoreVersion}
      />
      <MergeDialog open={mergeModalOpen} onOpenChange={setMergeModalOpen} onConfirm={handleConfirmMerge} />
      <ScannerDialog open={scannerModalOpen} onOpenChange={setScannerModalOpen} onComplete={handleScanComplete} />
      <SummaryDialog
        open={summaryModalOpen}
        onOpenChange={setSummaryModalOpen}
        documents={state.documents}
        onSummaryGenerated={handleSummaryGenerated}
      />
    </div>
  );
}
