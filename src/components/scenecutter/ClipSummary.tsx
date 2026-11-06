import { useState } from "react";
import { AlertTriangle, Check, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration, formatTime, toSeconds, type Clip, type ClipIssue } from "@/lib/timestamps";

const ISSUE_LABEL: Record<ClipIssue, string> = {
  overlap: "Overlaps another clip",
  "out-of-bounds": "Beyond video duration",
  "invalid-range": "End is before start",
};

export function SummaryStats({ count, total, warnings }: { count: number; total: number; warnings: number }) {
  return (
    <div className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-card">
      {[
        ["Clips", String(count)],
        ["Stitched", formatDuration(total)],
        ["Warnings", String(warnings)],
      ].map(([k, v], i) => (
        <div key={k} className="px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</p>
          <p className={`mt-0.5 text-[20px] font-semibold tabular-nums tracking-tight ${i === 2 && warnings ? "text-warning" : ""}`}>{v}</p>
        </div>
      ))}
    </div>
  );
}

type Props = {
  clips: Clip[];
  issues: Record<string, ClipIssue[]>;
  onUpdate?: (c: Clip) => void;
  onRemove?: (id: string) => void;
  onSelect?: (c: Clip) => void;
  readOnly?: boolean;
  compact: boolean;
};

export function ClipSummary({ clips, issues, onUpdate, onRemove, onSelect, readOnly, compact }: Props) {
  if (!clips.length) {
    return (
      <div className="rounded-xl border border-dashed border-input px-4 py-8 text-center text-[13px] text-muted-foreground">
        No clips detected yet. Paste timestamps to see them here.
      </div>
    );
  }
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
      {clips.map((c, i) => (
        <ClipRow
          key={c.id}
          index={i + 1}
          clip={c}
          issues={issues[c.id] ?? []}
          readOnly={readOnly}
          compact={compact}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function ClipRow({
  index, clip, issues, readOnly, compact, onUpdate, onRemove, onSelect,
}: { index: number; clip: Clip; issues: ClipIssue[]; readOnly?: boolean | undefined; compact: boolean } & Pick<Props, "onUpdate" | "onRemove" | "onSelect">) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ start: formatTime(clip.start), end: formatTime(clip.end), description: clip.description ?? "" });
  const ok = issues.length === 0;

  if (editing) {
    const field = "h-9 rounded-md border border-input bg-background px-2 font-mono text-[13px] outline-none focus:ring-2 focus:ring-ring";
    return (
      <li className="bg-accent/40 px-4 py-3">
        <div className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-[110px_110px_1fr_auto]"}`}>
          <input className={field} value={draft.start} onChange={(e) => setDraft({ ...draft, start: e.target.value })} aria-label="Start" />
          <input className={field} value={draft.end} onChange={(e) => setDraft({ ...draft, end: e.target.value })} aria-label="End" />
          <input className={`${field} font-sans ${compact ? "col-span-2" : ""}`} placeholder="Scene description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          <div className={`flex gap-1 ${compact ? "col-span-2 justify-end" : ""}`}>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}><X className="h-4 w-4" /></Button>
            <Button
              size="sm"
              onClick={() => {
                onUpdate?.({ ...clip, start: toSeconds(draft.start), end: toSeconds(draft.end), description: draft.description || undefined });
                setEditing(false);
              }}
            >
              <Check className="h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="group flex items-center gap-3 px-4 py-3 hover:bg-muted/60">
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-semibold tabular-nums ${ok ? "bg-secondary text-secondary-foreground" : "bg-warning-soft text-warning"}`}>
        {index}
      </span>
      <button type="button" onClick={() => onSelect?.(clip)} className="min-w-0 flex-1 text-left">
        <p className="truncate text-[13.5px] font-medium">{clip.description ?? <span className="text-muted-foreground">Untitled scene</span>}</p>
        <p className="font-mono text-[12px] tabular-nums text-muted-foreground">
          {formatTime(clip.start)} → {formatTime(clip.end)}
          <span className="ml-2 text-foreground/70">{formatDuration(clip.end - clip.start)}</span>
        </p>
        {!ok && (
          <p className="mt-1 flex items-center gap-1 text-[12px] text-warning">
            <AlertTriangle className="h-3 w-3" /> {issues.map((x) => ISSUE_LABEL[x]).join(" · ")}
          </p>
        )}
      </button>
      {ok && <Check className="h-4 w-4 shrink-0 text-success" aria-label="Valid" />}
      {!readOnly && (
        <div className={`flex shrink-0 gap-0.5 ${compact ? "" : "opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"}`}>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing(true)} aria-label="Edit clip"><Pencil className="h-3.5 w-3.5" /></Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-destructive" onClick={() => onRemove?.(clip.id)} aria-label="Remove clip"><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      )}
    </li>
  );
}
