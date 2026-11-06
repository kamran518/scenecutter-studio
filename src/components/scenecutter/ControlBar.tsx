import { useState } from "react";
import { Folder, Scissors, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const MOCK_FOLDERS = ["~/Movies/SceneCutter", "~/Desktop", "~/Downloads", "/Volumes/Archive/Exports"];

type Props = {
  fileName: string;
  onFileName: (v: string) => void;
  folder: string;
  onFolder: (v: string) => void;
  smartCut: boolean;
  onSmartCut: (v: boolean) => void;
  disabled: boolean;
  onStart: () => void;
  compact: boolean;
};

/** Browse uses a mocked chooser: browsers cannot open native Tauri folder dialogs or write to local paths. */
export function ControlBar({ fileName, onFileName, folder, onFolder, smartCut, onSmartCut, disabled, onStart, compact }: Props) {
  const [browsing, setBrowsing] = useState(false);
  return (
    <div className={`flex gap-3 ${compact ? "flex-col" : "items-end"}`}>
      <div className="relative min-w-0 flex-1">
        <label className="mb-1 block text-[11px] uppercase tracking-wide text-muted-foreground">Output</label>
        <div className="flex h-10 items-center rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
          <button type="button" onClick={() => setBrowsing((b) => !b)} className="flex h-full shrink-0 items-center gap-1.5 border-r border-input px-3 text-[12.5px] text-muted-foreground hover:text-foreground">
            <Folder className="h-3.5 w-3.5" /> <span className="max-w-40 truncate">{folder}</span>/
          </button>
          <input value={fileName} onChange={(e) => onFileName(e.target.value)} className="h-full min-w-0 flex-1 bg-transparent px-3 font-mono text-[13px] outline-none" aria-label="Output filename" />
          <Button variant="ghost" size="sm" className="mr-1" onClick={() => setBrowsing((b) => !b)}>Browse…</Button>
        </div>
        {browsing && (
          <div className="absolute bottom-12 left-0 z-30 w-72 rounded-lg border border-border bg-popover p-1 shadow-window">
            <p className="px-2 py-1.5 text-[11px] text-muted-foreground">Mock chooser — native dialog available in desktop app</p>
            {MOCK_FOLDERS.map((f) => (
              <button key={f} type="button" onClick={() => { onFolder(f); setBrowsing(false); }} className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent ${f === folder ? "text-primary" : ""}`}>
                <Folder className="h-3.5 w-3.5" /> {f}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={`flex items-center gap-3 ${compact ? "justify-between" : ""}`}>
        <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-3 text-[13px]">
          <Zap className={`h-3.5 w-3.5 ${smartCut ? "text-primary" : "text-muted-foreground"}`} />
          Smart-Cut
          <Switch checked={smartCut} onCheckedChange={onSmartCut} />
        </label>
        <Button size="lg" className={`h-10 ${compact ? "flex-1" : ""}`} disabled={disabled} onClick={onStart}>
          <Scissors className="h-4 w-4" /> Start Cutting & Merge
        </Button>
      </div>
    </div>
  );
}
