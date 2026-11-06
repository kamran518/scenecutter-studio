import { describe, it, expect } from "vitest";
import { parseTimestamps, validateClips } from "./timestamps";

describe("parseTimestamps", () => {
  it("parses all supported formats", () => {
    const c = parseTimestamps(
      "00:01:20 - 00:01:35\n01:20 -> 01:35\n1:20 to 1:35\n[00:02:10 - 00:02:25] Scene description\nnoise",
    );
    expect(c).toHaveLength(4);
    expect(c[0]).toMatchObject({ start: 80, end: 95 });
    expect(c[1]).toMatchObject({ start: 80, end: 95 });
    expect(c[2]).toMatchObject({ start: 80, end: 95 });
    expect(c[3]).toMatchObject({ start: 130, end: 145, description: "Scene description" });
  });
});

describe("validateClips", () => {
  it("flags overlaps and clips beyond video duration", () => {
    const c = parseTimestamps("00:00:10 - 00:00:20\n00:00:15 - 00:00:25\n00:10:00 - 00:10:10");
    const v = validateClips(c, 300);
    expect(v[c[0]!.id]).toContain("overlap");
    expect(v[c[1]!.id]).toContain("overlap");
    expect(v[c[2]!.id]).toContain("out-of-bounds");
  });
});
