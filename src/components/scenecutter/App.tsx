import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  parseTimestamps, validateClips, totalDuration, SAMPLE_TIMESTAMPS, type Clip,
} from "@/lib/timestamps";
import { TitleBar } from "./TitleBar";
import { VideoDropBanner } from "./VideoDropBanner";
import { VideoInfoBadge } from "./VideoInfoBadge";
import { VideoPreview } from "./VideoPreview";
import { TimestampEditor } from "./TimestampEditor";
import { ClipSummary, SummaryStats } from "./ClipSummary";
import { ProgressBar } from "./ProgressBar";
import { ControlBar } from "./ControlBar";
import { DEMO_VIDEO, type VideoMeta } from "./types";

/**
 * SceneCutter Pro — browser prototype.
 * The shipping Tauri app uses native dialogs, FFprobe/FFmpeg and local file writes.
 * None of that is possible in a browser preview, so file picking, browsing and
 * rendering here are simulated. No real export happens.
 */
export function SceneCutterApp({ compact }: { compact: boolean }) {
  const [video, setVideo] = useState<VideoMeta | null>(null);
  const [text, setText] = useState(SAMPLE_TIMESTAMPS);
  const [clips, setClips] = useState<Clip[]>([]);
  const [screen, setScreen] = useState<1 | 2>(1);
  const [fileName, setFileName] = useState("Coastline_Drive_highlights.mp4");
  const [folder, setFolder] = useState("~/Movies/SceneCutter");
  const [smartCut, setSmartCut] = useState(true);
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [seek, setSeek] = useState<number | null>(null);

  const duration = video?.duration ?? DEMO_VIDEO.duration;
  const liveClips = useMemo(() => parseTimestamps(text), [text]);
  const active = screen === 1 ? liveClips : clips;
  const issues = useMemo(() => validateClips(active, duration), [active, duration]);
  const warningCount = Object.keys(issues).length;
  const total = totalDuration(active);

  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => {
      setProgress((p) => {
        const n = p + (smartCut ? 3.2 : 1.6) * (0.6 + Math.random());
        if (n >= 100) {
          setStatus("done");
          return 100;
        }
        return n;
      });
    }, 120);
    return () => clearInterval(id);
  }, [status, smartCut]);

  const pickVideo = (name?: string) =>
    setVideo({ ...DEMO_VIDEO, name: name ?? DEMO_VIDEO.name });

  const reset = () => {
    setStatus("idle");
    setProgress(0);
    setScreen(1);
    setVideo(null);
    setText(SAMPLE_TIMESTAMPS);
  };

  const pad = compact ? "px-4" : "px-8";
  const note = (
    <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
      <Info className="mt-0.5 h-3 w-3 shrink-0" />
      Browser prototype: native dialogs, FFmpeg and local file writing run only in the desktop app. Export here is simulated.
    </p>
  );

  return (
    <div className="flex h-full flex-col bg-background">
      <TitleBar step={screen} compact={compact} />

      {screen === 1 ? (
        <>
          <main className={`flex-1 overflow-y-auto py-6 ${pad}`}>
            <div className={compact ? "space-y-4" : "grid grid-cols-[1.15fr_1fr] gap-8"}>
              <div className="space-y-4">
                <SectionLabel n={1} title="Movie" />
                {video ? (
                  <>
                    <VideoPreview duration={duration} clips={liveClips} />
                    <VideoInfoBadge video={video} onChange={() => setVideo(null)} compact={compact} />
                  </>
                ) : (
                  <VideoDropBanner onSelect={pickVideo} compact={compact} />
                )}
                {!compact && note}
              </div>
              <div className="space-y-4">
                <SectionLabel n={2} title="Paste timestamps from ChatGPT or Claude" />
                <TimestampEditor value={text} onChange={setText} onLoadSample={() => setText(SAMPLE_TIMESTAMPS)} compact={compact} />
                <SummaryStats count={liveClips.length} total={total} warnings={warningCount} />
                {compact && note}
              </div>
            </div>
          </main>
          <footer className={`sticky bottom-0 border-t border-border bg-card/90 py-3 backdrop-blur ${pad}`}>
            <div className="flex items-center gap-3">
              {!compact && (
                <p className="mr-auto text-[13px] text-muted-foreground">
                  {!video ? "Import a movie to continue." : `${liveClips.length} clips detected`}
                </p>
              )}
              <Button
                size="lg"
                className={compact ? "h-12 w-full" : ""}
                disabled={!video || liveClips.length === 0}
                onClick={() => {
                  setClips(liveClips);
                  setScreen(2);
                }}
              >
                Continue to review <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </footer>
        </>
      ) : (
        <>
          <main className={`flex-1 overflow-y-auto py-6 ${pad}`}>
            <Button variant="ghost" size="sm" className="-ml-2 mb-3 text-primary" onClick={() => setScreen(1)} disabled={status === "running"}>
              <ArrowLeft className="h-4 w-4" /> Back to timestamps
            </Button>
            <div className={compact ? "space-y-4" : "grid grid-cols-[1.15fr_1fr] gap-8"}>
              <div className="space-y-4">
                <VideoPreview duration={duration} clips={clips} seekTo={seek} />
                <SummaryStats count={clips.length} total={total} warnings={warningCount} />
                {warningCount > 0 && (
                  <div className="rounded-xl border border-warning/30 bg-warning-soft px-4 py-3 text-[13px]">
                    <p className="font-medium">{warningCount} clip{warningCount > 1 ? "s need" : " needs"} attention</p>
                    <p className="text-muted-foreground">Overlapping clips will repeat footage; out-of-range clips will be skipped. Edit or remove them below.</p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-[15px] font-semibold tracking-tight">Detected clips</h2>
                  <span className="text-[12px] text-muted-foreground">Tap a clip to preview</span>
                </div>
                <ClipSummary
                  clips={clips}
                  issues={issues}
                  compact={compact}
                  readOnly={status !== "idle"}
                  onSelect={(c) => setSeek(c.start)}
                  onUpdate={(c) => setClips((cs) => cs.map((x) => (x.id === c.id ? c : x)))}
                  onRemove={(id) => setClips((cs) => cs.filter((x) => x.id !== id))}
                />
                {note}
              </div>
            </div>
          </main>
          <footer className={`sticky bottom-0 border-t border-border bg-card/95 py-4 backdrop-blur ${pad}`}>
            {status === "idle" ? (
              <ControlBar
                fileName={fileName}
                onFileName={setFileName}
                folder={folder}
                onFolder={setFolder}
                smartCut={smartCut}
                onSmartCut={setSmartCut}
                disabled={clips.length === 0 || !fileName.trim()}
                onStart={() => {
                  setProgress(0);
                  setStatus("running");
                }}
                compact={compact}
              />
            ) : (
              <ProgressBar
                progress={progress}
                status={status}
                fileName={`${folder}/${fileName}`}
                onPlay={() => toast("Playback opens in your system player in the desktop app.")}
                onOpenFolder={() => toast(`Would reveal ${folder} in Finder — desktop app only.`)}
                onReset={reset}
              />
            )}
          </footer>
        </>
      )}
    </div>
  );
}

function SectionLabel({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
      <span className="text-muted-foreground tabular-nums">{n}.</span>
      {title}
    </h2>
  );
}
