import { Info, Lightbulb } from "lucide-react";

import type { SolinalDocument } from "@/data/seed";
import { buildEditorGuide, type GuideCard } from "./aiEngine";

const toneClass: Record<GuideCard["tone"], string> = {
  info: "border border-tag-technical/20 bg-tag-technical-bg",
  blue: "border border-border bg-muted/60",
  green: "border border-border bg-muted/60",
  amber: "border border-status-warning/30 bg-status-warning/10",
};

const titleClass: Record<GuideCard["tone"], string> = {
  info: "text-tag-technical",
  blue: "text-tag-technical",
  green: "text-status-valid",
  amber: "text-status-warning",
};

/** Port of legacy js/editor.js rebuildEditorLeftGuide — left column of the editor. */
export function GuidePanel({ doc }: { doc: SolinalDocument }) {
  const cards = buildEditorGuide(doc);

  return (
    <div className="flex min-h-[500px] flex-col gap-3.5 rounded-2xl border border-border bg-card p-4">
      <div>
        <h4 className="mb-2 text-xs font-extrabold uppercase tracking-wide text-primary">
          Guía &amp; plantilla
        </h4>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Indicaciones de estructura e integración en tiempo real para tu documento.
        </p>
      </div>

      <div className="grid gap-3">
        {cards.map((card, i) => (
          <div key={i} className={`rounded-xl p-3 transition-colors ${toneClass[card.tone]}`}>
            <strong className={`mb-1 flex items-center gap-1.5 text-xs ${titleClass[card.tone]}`}>
              {card.tone === "info" && <Info className="size-3.5" />}
              {card.tone === "amber" && <Lightbulb className="size-3.5" />}
              {card.title}
            </strong>
            <span className="text-[11px] leading-relaxed text-muted-foreground">{card.body}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
