export type VideoMeta = {
  name: string;
  size: string;
  duration: number;
  resolution: string;
  fps: number;
  videoCodec: string;
  audioCodec: string;
};

export const DEMO_VIDEO: VideoMeta = {
  name: "Coastline_Drive_2024.mkv",
  size: "4.2 GB",
  duration: 1 * 3600 + 52 * 60 + 14,
  resolution: "3840 × 1608",
  fps: 23.976,
  videoCodec: "HEVC (H.265)",
  audioCodec: "AAC 5.1",
};

export const ACCEPTED = ["MP4", "MKV", "MOV", "AVI", "WEBM"];
