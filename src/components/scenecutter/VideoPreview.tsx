import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import still from "@/assets/movie-still.jpg";
import { formatTime, type Clip } from "@/lib/timestamps";

type Props = { duration: number; clips?: Clip[]; seekTo?: number | null };

/** Simulated player: the browser preview cannot decode arbitrary local MKV/HEVC files. */
export function VideoPreview({ duration, clips = [], seekTo }: Props) {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(130);

  useEffect(() => {
    if (seekTo != null) setT(seekTo);
  }, [seekTo]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((v) => (v + 1 > duration ? 0 : v + 1)), 1000);
    return () => clearInterval(id);
  }, [playing, duration]);

  return (
    <div className="overflow-hidden rounded-xl bg-media text-media-foreground shadow-soft">
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        className="group relative block aspect-video w-full"
        aria-label={playing ? "Pause" : "Play"}
      >
        <img
          src={still}
          alt="Movie preview frame"
          width={1600}
          height={912}
          className={`h-full w-full object-cover transition-transform duration-[8000ms] ${playing ? "scale-105" : "scale-100"}`}
        />
        <span
          className={`absolute inset-0 m-auto grid h-14 w-14 place-items-center rounded-full bg-media/50 backdrop-blur-md transition-opacity ${
            playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
        </span>
      </button>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <button type="button" onClick={() => setPlaying((p) => !p)} aria-label="Toggle playback">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <span className="font-mono text-[11px] tabular-nums opacity-80">{formatTime(t)}</span>
        <div
          className="relative h-1 flex-1 cursor-pointer rounded-full bg-media-foreground/20"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setT(((e.clientX - r.left) / r.width) * duration);
          }}
        >
          {clips.map((c) => (
            <span
              key={c.id}
              className="absolute top-0 h-1 rounded-full bg-primary"
              style={{
                left: `${Math.min(100, (c.start / duration) * 100)}%`,
                width: `${Math.max(0.6, ((c.end - c.start) / duration) * 100)}%`,
              }}
            />
          ))}
          <span
            className="absolute -top-1 h-3 w-0.5 rounded bg-media-foreground"
            style={{ left: `${(t / duration) * 100}%` }}
          />
        </div>
        <span className="font-mono text-[11px] tabular-nums opacity-60">{formatTime(duration)}</span>
      </div>
    </div>
  );
}
