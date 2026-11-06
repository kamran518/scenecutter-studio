import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { SceneCutterApp } from "@/components/scenecutter/App";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SceneCutter Pro — Cut movie scenes from AI timestamps" },
      { name: "description", content: "Import a movie, paste AI-generated timestamps, review clips and stitch them into one video. Clickable prototype." },
      { property: "og:title", content: "SceneCutter Pro — Cut movie scenes from AI timestamps" },
      { property: "og:description", content: "Import a movie, paste timestamps, review clips and export a stitched highlight reel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const isMobile = useIsMobile();
  const [device, setDevice] = useState<"desktop" | "android">("desktop");
  useEffect(() => {
    if (isMobile) setDevice("android");
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="h-dvh">
        <SceneCutterApp compact />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-chrome px-6 pb-10 pt-5">
      <div className="mb-5 flex items-center gap-3">
        <span className="text-[12px] text-muted-foreground">Prototype preview</span>
        <div className="flex rounded-lg border border-border bg-card p-0.5 shadow-soft">
          {([["desktop", Monitor, "macOS"], ["android", Smartphone, "Android"]] as const).map(([d, Icon, label]) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-[12.5px] ${device === d ? "bg-secondary font-medium text-foreground" : "text-muted-foreground"}`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>
      {device === "desktop" ? (
        <div className="h-[820px] w-full max-w-[1280px] overflow-hidden rounded-xl border border-border bg-background shadow-window">
          <SceneCutterApp compact={false} />
        </div>
      ) : (
        <div className="h-[820px] w-[392px] overflow-hidden rounded-[2.4rem] border-[10px] border-foreground bg-background shadow-window">
          <div className="flex h-6 items-center justify-between bg-card px-5 text-[11px] font-medium">
            <span>9:41</span>
            <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
            <span>100%</span>
          </div>
          <div className="h-[calc(100%-1.5rem)]">
            <SceneCutterApp compact />
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
