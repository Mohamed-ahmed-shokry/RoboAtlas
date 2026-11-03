import { describe, expect, it } from "vitest";
import { resourceHref } from "../src/lib/resourceLinks";
import type { LearningResource } from "../src/data/roadmap";

const video: LearningResource = {
  id: "lecture",
  title: "Lecture",
  creator: "Lecturer",
  url: "https://www.youtube.com/watch?v=example&list=course&t=99s",
  label: "Technical",
};

describe("assigned video start times", () => {
  it.each([0, 1136, 4283])("opens at %s seconds and preserves the video and playlist", (startSeconds) => {
    const source = { ...video, startSeconds };
    const href = new URL(resourceHref(source));
    expect(href.searchParams.get("t")).toBe(startSeconds + "s");
    expect(href.searchParams.get("v")).toBe("example");
    expect(href.searchParams.get("list")).toBe("course");
    expect(source.url).toBe(video.url);
  });

  it("supports short YouTube video links", () => {
    expect(resourceHref({ ...video, url: "https://youtu.be/example", startSeconds: 75 }))
      .toBe("https://youtu.be/example?t=75s");
  });

  it.each([undefined, -1, NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1])(
    "preserves the original destination for an absent or invalid time: %s",
    (startSeconds) => expect(resourceHref({ ...video, startSeconds })).toBe(video.url),
  );

  it.each([
    "https://example.com/article",
    "https://www.youtube.com/playlist?list=course",
    "https://www.youtube.com/watch?list=course",
    "https://youtube.com.example.com/watch?v=example",
    "https://youtu.be/",
    "./feedback-control.py",
  ])("does not alter other resource destinations: %s", (url) => {
    expect(resourceHref({ ...video, url, startSeconds: 75 })).toBe(url);
  });
});
