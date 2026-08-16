import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DocumentTemplate } from "@/data/seed";

interface TemplateCardProps {
  template: DocumentTemplate;
  onSelect: (template: DocumentTemplate) => void;
}

/** Ported from js/templates.js renderTemplates() (.template-card). */
export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(template)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(template);
      }}
      className="cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-secondary" />
          <strong className="text-sm font-bold">{template.name}</strong>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{template.desc}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="font-normal">
            {template.norma}
          </Badge>
          <Badge variant="outline" className="font-normal">
            {template.type}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
