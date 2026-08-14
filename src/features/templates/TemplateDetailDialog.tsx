import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DocumentTemplate } from "@/data/seed";

interface TemplateDetailDialogProps {
  template: DocumentTemplate | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Detail preview for a template card. Legacy clicking a .template-card
 * opened the "Nuevo documento" modal directly (js/templates.js →
 * templateChanged/openModal('newDocModal')) so the user could create a
 * draft from it immediately. That modal + document-creation flow belongs
 * to the documents/editor feature (out of this agent's scope), so here we
 * only show the template's full structure — creating a document from it
 * is deferred to the Documentos page.
 */
export function TemplateDetailDialog({ template, onOpenChange }: TemplateDetailDialogProps) {
  return (
    <Dialog open={!!template} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {template && (
          <>
            <DialogHeader>
              <DialogTitle>{template.name}</DialogTitle>
              <DialogDescription>{template.desc}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="font-normal">
                {template.norma}
              </Badge>
              <Badge variant="outline" className="font-normal">
                {template.type}
              </Badge>
            </div>

            <div>
              <div className="mb-1.5 text-xs font-semibold text-muted-foreground">
                Secciones obligatorias
              </div>
              <div className="flex flex-wrap gap-1.5">
                {template.mandatory.map((section) => (
                  <Badge key={section} className="font-normal">
                    {section}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1.5 text-xs font-semibold text-muted-foreground">
                Estructura del contenido
              </div>
              <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs leading-relaxed">
                {template.content}
              </pre>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
