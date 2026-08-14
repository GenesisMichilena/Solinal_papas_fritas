import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppState } from "@/context/AppStateContext";
import type { DocumentTemplate, DocumentType } from "@/data/seed";
import type { AITemplateProposal } from "./aiSimulator";

const NORMAS = ["ISO 9001:2015", "ISO 14001:2015", "ISO 22000:2018"];
const TYPES: DocumentType[] = ["Procedimiento", "Política", "Instructivo", "Manual", "Checklist"];

interface NewTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-fills the form when accepting an AI-generated proposal. */
  prefill?: AITemplateProposal | null;
}

const emptyForm = {
  name: "",
  norma: NORMAS[0],
  type: TYPES[0],
  mandatory: "",
  desc: "",
};

/** Ported from js/templates.js saveNewTemplate() (G06 Scenario 4: mandatory
 * section required to comply with ISO guidelines). */
export function NewTemplateDialog({ open, onOpenChange, prefill }: NewTemplateDialogProps) {
  const { dispatch } = useAppState();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      setForm(
        prefill
          ? {
              name: prefill.name,
              norma: prefill.norma,
              type: prefill.type,
              mandatory: prefill.mandatory.join(", "),
              desc: prefill.desc,
            }
          : emptyForm,
      );
    }
  }, [open, prefill]);

  function handleSave() {
    const name = form.name.trim();
    const mandatoryInput = form.mandatory.trim();

    if (!name) {
      toast.error("El nombre de la plantilla es obligatorio.");
      return;
    }
    if (!mandatoryInput) {
      toast.error(
        "Debe especificar al menos una sección obligatoria para cumplir con las directrices ISO.",
      );
      return;
    }

    const mandatoryArray = mandatoryInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newTemplate: DocumentTemplate = {
      key: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name,
      norma: form.norma,
      type: form.type,
      desc: form.desc || `Estructura personalizada para ${form.type} bajo la norma ${form.norma}.`,
      preview: `Secciones obligatorias: ${mandatoryArray.join(", ")}`,
      content: mandatoryArray.map((m, i) => `${i + 1}. ${m}`).join("\n"),
      mandatory: mandatoryArray,
    };

    dispatch({ type: "TEMPLATE_ADD", payload: newTemplate });
    dispatch({ type: "ADD_AUDIT_LOG", payload: { action: `Creó una nueva plantilla de documento: ${name}` } });
    toast.success("Plantilla guardada y disponible en el catálogo.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear nueva plantilla</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-temp-name">Nombre de la plantilla</Label>
            <Input
              id="new-temp-name"
              placeholder="Ej. Procedimiento Control de Plagas"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Norma base</Label>
              <Select
                value={form.norma}
                onValueChange={(v) => setForm((f) => ({ ...f, norma: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NORMAS.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Tipo documental</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((f) => ({ ...f, type: v as DocumentType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-temp-mandatory">
              Estructura / secciones obligatorias (separa por comas)
            </Label>
            <Input
              id="new-temp-mandatory"
              placeholder="Alcance, Responsabilidades, Trazabilidad"
              value={form.mandatory}
              onChange={(e) => setForm((f) => ({ ...f, mandatory: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-temp-desc">Descripción</Label>
            <Textarea
              id="new-temp-desc"
              placeholder="Detalles de la estructura..."
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar plantilla</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
