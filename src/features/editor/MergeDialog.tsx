import { GitFork } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MergeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const LOCAL_DRAFT = `3. Desarrollo del procedimiento
- Control organoléptico por lote.
- Control de humedad (máx 2.0%).`;

const SERVER_CHANGES = `3. Desarrollo del procedimiento
- Control organoléptico por lote.
- Control de humedad (máx 2.0%).
+ Medición con termómetro infrarrojo calibrado.`;

/** Port of legacy js/editor.js openSimulatedMerge / confirmMergeSimulated (G02 Scenario 2). */
export function MergeDialog({ open, onOpenChange, onConfirm }: MergeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Fusión de cambios concurrentes detectados</DialogTitle>
        </DialogHeader>

        <div className="flex items-start gap-3 rounded-2xl border border-status-warning/40 bg-status-warning/10 p-3.5">
          <GitFork className="mt-0.5 size-4 shrink-0 text-status-warning" />
          <div>
            <strong className="text-sm">Edición simultánea</strong>
            <div className="text-xs text-muted-foreground">
              El usuario <strong>Ana Torres (Revisor)</strong> guardó cambios hace unos momentos.
              Por favor revisa las diferencias.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-status-danger/5 p-3">
            <strong className="text-xs text-status-danger">Tu borrador local:</strong>
            <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] text-foreground">
              {LOCAL_DRAFT}
            </pre>
          </div>
          <div className="rounded-2xl border border-border bg-status-valid/5 p-3">
            <strong className="text-xs text-status-valid">Cambios de Ana Torres (servidor):</strong>
            <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] text-foreground">
              {SERVER_CHANGES}
            </pre>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Fusionar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
