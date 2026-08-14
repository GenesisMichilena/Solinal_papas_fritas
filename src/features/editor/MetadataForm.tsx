import type { DocumentType, SolinalDocument } from "@/data/seed";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { documentTypeOptions, normaOptions, statusLabel } from "@/features/documents/docStyles";

interface MetadataFormProps {
  doc: SolinalDocument;
  onFieldChange: (changes: Partial<SolinalDocument>) => void;
  /** Uncommitted code draft, only applied to the doc on "Guardar versión" (matches legacy). */
  codeDraft: string;
  onCodeDraftChange: (code: string) => void;
}

/** Port of legacy js/editor.js metadata panel + editorMetaChanged. */
export function MetadataForm({ doc, onFieldChange, codeDraft, onCodeDraftChange }: MetadataFormProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4.5 py-4">
        <strong className="text-sm font-extrabold">Metadatos del documento</strong>
        <Badge>{doc.code}</Badge>
      </div>
      <div className="grid gap-3.5 p-4.5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>Tipo de documento</Label>
            <Select
              value={doc.type}
              onValueChange={(v) => onFieldChange({ type: v as DocumentType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {documentTypeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label>Norma ISO</Label>
            <Select
              value={doc.norma}
              onValueChange={(v) => onFieldChange({ norma: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {normaOptions.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label>Código</Label>
            <Input value={codeDraft} onChange={(e) => onCodeDraftChange(e.target.value)} />
          </div>

          <div className="grid gap-1.5">
            <Label>Estado</Label>
            <Input value={statusLabel(doc.estado, doc.vencido)} readOnly className="font-bold text-primary" />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label>Título del documento</Label>
          <Input value={doc.title} onChange={(e) => onFieldChange({ title: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
