export type Clip = {
  id: string;
  start: number; // seconds
  end: number;
  description?: string | undefined;
};

export type ClipIssue = "overlap" | "out-of-bounds" | "invalid-range";

const TIME = String.raw`(\d{1,2}(?::\d{1,2}){1,2}(?:[.,]\d+)?)`;
const SEP = String.raw`\s*(?:-{1,2}>?|–|—|→|to)\s*`;
const LINE = new RegExp(String.raw`^\s*\[?\s*${TIME}${SEP}${TIME}\s*\]?\s*[:\-–—]?\s*(.*)$`, "i");

export function toSeconds(t: string): number {
  const parts = t.replace(",", ".").split(":").map(Number);
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}

export function formatTime(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return [h, m, r].map((n) => String(n).padStart(2, "0")).join(":");
}

export function formatDuration(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m ? `${m}m ${String(r).padStart(2, "0")}s` : `${r}s`;
}

/** Smart-parse pasted AI timestamp text into clips. Unrecognised lines are ignored. */
export function parseTimestamps(text: string): Clip[] {
  const clips: Clip[] = [];
  text.split(/\r?\n/).forEach((line, i) => {
    const m = line.match(LINE);
    if (!m) return;
    const description = m[3]?.replace(/^[\s\-–—:]+/, "").trim();
    clips.push({
      id: `c${i}-${m[1]}`,
      start: toSeconds(m[1]!),
      end: toSeconds(m[2]!),
      description: description || undefined,
    });
  });
  return clips;
}

export function validateClips(clips: Clip[], videoDuration: number): Record<string, ClipIssue[]> {
  const issues: Record<string, ClipIssue[]> = {};
  const add = (id: string, issue: ClipIssue) => {
    issues[id] = [...(issues[id] ?? []), issue];
  };
  clips.forEach((c, i) => {
    if (c.end <= c.start) add(c.id, "invalid-range");
    if (c.end > videoDuration || c.start > videoDuration) add(c.id, "out-of-bounds");
    clips.forEach((o, j) => {
      if (i !== j && c.start < o.end && o.start < c.end) add(c.id, "overlap");
    });
  });
  for (const k in issues) issues[k] = [...new Set(issues[k])];
  return issues;
}

export const totalDuration = (clips: Clip[]) =>
  clips.reduce((a, c) => a + Math.max(0, c.end - c.start), 0);

export const SAMPLE_TIMESTAMPS = `[00:02:10 - 00:02:25] Opening drive along the coast
00:05:40 - 00:06:02 First look at the cliff road
08:15 -> 08:41
11:02 to 11:30 Conversation at the overlook
[00:14:05 - 00:14:20] Sun touches the horizon
00:14:12 - 00:14:30 Wide aerial (overlaps previous)
02:05:00 - 02:05:20 Credits roll (beyond video length)`;

export const AI_MASTER_PROMPT = `You are a film editor. Watch/analyse the movie and list the most compelling scenes.
Return ONLY one scene per line in this exact format:
[HH:MM:SS - HH:MM:SS] Short scene description
Rules: chronological order, no overlaps, each clip 5–60 seconds, stay within the movie runtime.`;
