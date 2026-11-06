import { useState } from "react";
import { Check, Copy, Sparkles, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AI_MASTER_PROMPT } from "@/lib/timestamps";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onLoadSample: () => void;
  compact: boolean;
};

export function TimestampEditor({ value, onChange, onLoadSample, compact }: Props) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const lines = Math.max(value.split("\n").length, 12);

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-1 border-b border-border px-3 py-2">
        <h3 className="mr-auto pl-1 text-[13px] font-semibold">Timestamps</h3>
        <Button variant="ghost" size="sm" onClick={onLoadSample}>
          <FileText className="h-3.5 w-3.5" /> Load Sample
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowPrompt((s) => !s)} className={showPrompt ? "bg-accent text-accent-foreground" : ""}>
          <Sparkles className="h-3.5 w-3.5" /> AI Master Prompt
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onChange("")} disabled={!value}>
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </Button>
      </div>
      {showPrompt && (
        <div className="border-b border-border bg-muted px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-muted-foreground">Paste this into ChatGPT or Claude, then paste the result below.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard?.writeText(AI_MASTER_PROMPT);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-[12px] leading-relaxed">{AI_MASTER_PROMPT}</pre>
        </div>
      )}
      <div className="flex">
        {!compact && (
          <div aria-hidden className="select-none border-r border-border py-3 pl-3 pr-2 text-right font-mono text-[12.5px] leading-6 text-muted-foreground/60">
            {Array.from({ length: lines }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          rows={compact ? 9 : lines}
          placeholder={"[00:02:10 - 00:02:25] Scene description\n01:20 -> 01:35\n1:20 to 1:35"}
          className="min-h-56 w-full resize-none bg-transparent px-3 py-3 font-mono text-[12.5px] leading-6 outline-none placeholder:text-muted-foreground/50"
        />
      </div>
    </section>
  );
}
