import { useRef, useState } from "react";
import { Film, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACCEPTED } from "./types";

type Props = { onSelect: (fileName?: string) => void; compact: boolean };

/**
 * Prototype note: the real Tauri app opens a native file dialog and probes the file
 * with FFprobe. In the browser we only read the file name and use demo metadata.
 */
export function VideoDropBanner({ onSelect, compact }: Props) {
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onSelect(e.dataTransfer.files[0]?.name);
      }}
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed text-center transition-colors ${
        over ? "border-primary bg-accent" : "border-input bg-card"
      } ${compact ? "aspect-video px-5" : "aspect-[2.2/1] px-10"}`}
    >
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary">
        <Film className="h-5 w-5 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-[17px] font-semibold tracking-tight">
        {compact ? "Choose a movie" : "Drop a movie here"}
      </h2>
      <p className="mt-1 text-[13px] text-muted-foreground">{ACCEPTED.join(" · ")}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Button onClick={() => input.current?.click()} size={compact ? "lg" : "default"}>
          <Upload className="h-4 w-4" /> Choose File…
        </Button>
        <Button variant="outline" onClick={() => onSelect()} size={compact ? "lg" : "default"}>
          Use demo movie
        </Button>
      </div>
      <input
        ref={input}
        type="file"
        className="hidden"
        accept=".mp4,.mkv,.mov,.avi,.webm,video/*"
        onChange={(e) => onSelect(e.target.files?.[0]?.name)}
      />
    </div>
  );
}
