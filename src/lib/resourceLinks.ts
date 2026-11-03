import type { LearningResource } from "../data/roadmap";

export function resourceHref(resource: LearningResource): string {
  const { startSeconds } = resource;
  if (
    startSeconds === undefined ||
    !Number.isSafeInteger(startSeconds) ||
    startSeconds < 0
  ) {
    return resource.url;
  }
  try {
    const url = new URL(resource.url);
    const youtubeWatch =
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname) &&
      url.pathname === "/watch" && Boolean(url.searchParams.get("v"));
    const shortVideo = url.hostname === "youtu.be" && url.pathname.length > 1;
    if (url.protocol !== "https:" || !(youtubeWatch || shortVideo)) {
      return resource.url;
    }
    url.searchParams.set("t", startSeconds + "s");
    return url.toString();
  } catch {
    return resource.url;
  }
}
