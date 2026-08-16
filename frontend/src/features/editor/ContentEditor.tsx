import { Lock, LockOpen, PenSquare, Save } from "lucide-react";

import type { DocumentComment, RoleName, SolinalDocument } from "@/data/seed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentsThread } from "./CommentsThread";
import { LockedSection } from "./LockedSection";
import { SignaturesPanel } from "./SignaturesPanel";

interface ContentEditorProps {
  doc: SolinalDocument;
  activeUser: string;
  activeRole: RoleName;
  isSectionLocked: boolean;
  comments: DocumentComment[];
  canComment: boolean;
  onContentChange: (content: string) => void;
  onToggleLock: () => void;
  onSaveVersion: () => void;
  onAddComment: (text: string) => void;
  onSign: () => void;
}

/** Port of legacy js/editor.js "Editor de Contenido" card — WYSIWYG textarea,
 * lock toggle, locked section, comments thread and signatures panel. */
export function ContentEditor({
  doc,
  activeUser,
  activeRole,
  isSectionLocked,
  comments,
  canComment,
  onContentChange,
  onToggleLock,
  onSaveVersion,
  onAddComment,
  onSign,
}: ContentEditorProps) {
  const isOwner = activeUser === doc.creador || activeRole === "Administrador";

  return (
    <div className="rounded-2xl border border-border bg-card p-4.5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base font-bold">
          <PenSquare className="size-4 text-primary" /> Editor de contenido
        </h3>
        <div className="flex items-center gap-2">
          {isSectionLocked && (
            <Badge variant="outline" className="border-status-danger/30 bg-status-danger/10 text-status-danger">
              Sección crítica bloqueada
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={onToggleLock}>
            {isSectionLocked ? <Lock className="size-3.5" /> : <LockOpen className="size-3.5" />}
            Bloquear sección
          </Button>
          <Button size="sm" onClick={onSaveVersion}>
            <Save className="size-3.5" /> Guardar versión
          </Button>
        </div>
      </div>

      <LockedSection doc={doc} activeUser={activeUser} activeRole={activeRole} />

      <Textarea
        value={doc.content}
        onChange={(e) => onContentChange(e.target.value)}
        rows={16}
        className="min-h-[360px] rounded-2xl p-4.5 leading-relaxed"
      />

      <CommentsThread comments={comments} canComment={canComment} onAddComment={onAddComment} />

      <SignaturesPanel signatures={doc.signatures} onSign={onSign} />

      {!isOwner && (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Eres colaborador de este documento. Algunos controles críticos permanecen
          restringidos al creador ({doc.creador}) o a un Administrador.
        </p>
      )}
    </div>
  );
}
