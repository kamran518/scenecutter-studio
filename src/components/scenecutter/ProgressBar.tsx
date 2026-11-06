import { CheckCircle2, FolderOpen, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  progress: number;
  status: "running" | "done";
  fileName: string;
  onPlay: () => void;
  onOpenFolder: () => void;
  onReset: () => void;
};

export function ProgressBar({ progress, status, fileName, onPlay, onOpenFolder, onReset }: Props) {
  const stage = progress < 15 ? "Analysing keyframes…" : progress < 80 ? "Cutting clips…" : progress < 100 ? "Merging into one file…" : "Done";
  if (status === "done") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-success" />
        <div className="mr-auto min-w-0">
          <p className="text-[14px] font-semibold">Simulated export complete</p>
          <p className="truncate text-[12px] text-muted-foreground">{fileName} · prototype only, no file was written</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onPlay}><Play className="h-4 w-4" /> Play Video</Button>
          <Button variant="outline" onClick={onOpenFolder}><FolderOpen className="h-4 w-4" /> Open Folder</Button>
          <Button variant="ghost" onClick={onReset}><RotateCcw className="h-4 w-4" /> Reset</Button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-2 flex justify-between text-[13px]">
        <span className="font-medium">{stage}</span>
        <span className="font-mono tabular-nums text-muted-foreground">{Math.floor(progress)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
