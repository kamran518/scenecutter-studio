import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/timestamps";
import type { VideoMeta } from "./types";

type Props = { video: VideoMeta; onChange: () => void; compact: boolean };

export function VideoInfoBadge({ video, onChange, compact }: Props) {
  const items = [
    ["Duration", formatTime(video.duration)],
    ["Resolution", video.resolution],
    ["FPS", String(video.fps)],
    ["Video", video.videoCodec],
    ["Audio", video.audioCodec],
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold">{video.name}</p>
          <p className="text-[12px] text-muted-foreground">{video.size}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onChange} className="text-primary">
          <RefreshCw className="h-3.5 w-3.5" /> Change Video
        </Button>
      </div>
      <dl className={`mt-3 grid gap-x-4 gap-y-2 ${compact ? "grid-cols-2" : "grid-cols-5"}`}>
        {items.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</dt>
            <dd className="font-mono text-[12.5px] tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
