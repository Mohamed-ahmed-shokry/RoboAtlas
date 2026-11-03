import { afterEach, describe, expect, it, vi } from "vitest";
import {
  loadSidebarCollapsed,
  saveSidebarCollapsed,
  SIDEBAR_STORAGE_KEY,
} from "../src/lib/sidebarPreference";

afterEach(() => vi.unstubAllGlobals());

describe("sidebar display preference", () => {
  it.each([null, "false", "invalid", "{}"])(
    "defaults to expanded for a missing or unrecognized preference: %s",
    (value) => {
      vi.stubGlobal("window", { localStorage: { getItem: () => value } });
      expect(loadSidebarCollapsed()).toBe(false);
    },
  );

  it("restores both choices without touching learning progress", () => {
    const progress = '{"version":2,"completed":["robot-examples-definitions"]}';
    const entries = new Map([["roboatlas.progress.v2", progress]]);
    const getItem = vi.fn((key: string) => entries.get(key) ?? null);
    const setItem = vi.fn((key: string, value: string) => entries.set(key, value));
    vi.stubGlobal("window", { localStorage: { getItem, setItem } });
    for (const collapsed of [true, false]) {
      saveSidebarCollapsed(collapsed);
      expect(loadSidebarCollapsed()).toBe(collapsed);
      expect(entries.get("roboatlas.progress.v2")).toBe(progress);
    }
    expect(getItem.mock.calls.every(([key]) => key === SIDEBAR_STORAGE_KEY)).toBe(true);
    expect(setItem.mock.calls.every(([key]) => key === SIDEBAR_STORAGE_KEY)).toBe(true);
  });

  it("tolerates unavailable storage on reads and writes", () => {
    vi.stubGlobal("window", {
      get localStorage() { throw new Error("Blocked storage"); },
    });
    expect(loadSidebarCollapsed()).toBe(false);
    expect(() => saveSidebarCollapsed(true)).not.toThrow();
  });

  it("tolerates quota failures without throwing from the toggle handler", () => {
    vi.stubGlobal("window", { localStorage: {
      getItem: () => "true",
      setItem: () => { throw new Error("Storage full"); },
    } });
    expect(loadSidebarCollapsed()).toBe(true);
    expect(() => saveSidebarCollapsed(false)).not.toThrow();
  });
});
