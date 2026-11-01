import { describe, expect, it, vi } from "vitest";
import { coreSections } from "../src/data/roadmap";
import {
  continueLearning,
  countProgress,
  defaultProgress,
  exportBackup,
  importBackup,
  LEGACY_STORAGE_KEY,
  loadProgress,
  matchesSection,
  MAX_BACKUP_BYTES,
  migrateLegacyProgress,
  persistMigration,
  resetProgress,
  saveProgress,
  STORAGE_KEY,
  toggleSections,
  validateProgress,
} from "../src/lib/sectionProgress";

// Isolate storage rules from later curriculum edits; real-content coverage has its own tests.
vi.mock("../src/data/roadmap", () => {
  const video = {
    id: "hoop",
    title: "Ball seeking hoop",
    creator: "Stuff Made Here",
    url: "https://example.com/hoop",
    label: "Build",
  };
  const geometry = {
    id: "geometry",
    title: "Modern Robotics",
    creator: "Northwestern",
    url: "https://example.com/geometry",
    label: "Technical",
    scope: "Degrees of freedom and workspace",
  };
  const roadmap = [
    {
      id: "new-systems",
      title: "Robot systems",
      shortTitle: "Systems",
      topicGroupId: "systems",
      sections: [
        {
          id: "section-video",
          title: "Sensor to action",
          resources: [video],
          legacyUnitIds: ["hoop-build"],
        },
        {
          id: "section-bundle",
          title: "Robot freedoms",
          resources: [geometry],
          legacyUnitIds: ["rigid-body-dof", "robot-dof"],
        },
        {
          id: "section-task",
          title: "Draw a loop",
          resources: [],
          task: "Sketch the feedback loop.",
          legacyUnitIds: ["hoop-build"],
        },
      ],
    },
    {
      id: "new-control",
      title: "Feedback control",
      shortTitle: "Control",
      topicGroupId: "control",
      sections: [
        {
          id: "section-control",
          title: "Proportional control",
          scope: "Watch the first PID lesson.",
          resources: [geometry, video],
          legacyUnitIds: ["pid-part-one"],
        },
      ],
    },
  ];
  return {
    roadmap,
    coreSections: roadmap.flatMap((stage, stageIndex) =>
      stage.sections.map((section, sectionIndex) => ({
        stage,
        section,
        stageNumber: stageIndex + 1,
        sectionNumber: sectionIndex + 1,
      })),
    ),
    optionalResources: [{ ...video, id: "optional-hoop" }],
  };
});

function legacyProgress(overrides: Record<string, unknown> = {}) {
  return {
    version: 1,
    completed: ["hoop-build", "retired-lesson"],
    notes: {
      "robot-systems": "<b>Keep this plain text</b>",
      "retired-stage": "Keep this too",
    },
    lastOpened: "pid-part-one",
    expanded: ["robot-systems", "retired-stage"],
    theme: "light",
    customPreference: { density: "compact" },
    ...overrides,
  };
}

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
  };
}

describe("section completion and resume", () => {
  it("counts each section once and never adds unknown or optional IDs", () => {
    const state = toggleSections(defaultProgress(), [
      "section-video",
      "optional-hoop",
      "unknown",
    ]);
    expect(state.completed).toEqual(["section-video"]);
    expect(
      countProgress(
        ["section-video", "section-video", "section-task"],
        state.completed,
      ),
    ).toEqual({ count: 1, total: 2, percent: 50 });
    expect(toggleSections(state, ["section-video"]).completed).toEqual([]);
  });

  it("prefers a recent unfinished core section and falls back when complete", () => {
    const state = { ...defaultProgress(), lastOpened: "section-control" };
    expect(continueLearning(state)?.section.id).toBe("section-control");
    expect(state.completed).toEqual([]);
    expect(
      continueLearning(toggleSections(state, ["section-control"]))?.section.id,
    ).toBe("section-video");
    expect(
      continueLearning({ ...state, lastOpened: "optional-hoop" })?.section.id,
    ).toBe("section-video");
    expect(
      continueLearning({
        ...state,
        completed: coreSections.map(({ section }) => section.id),
      }),
    ).toBeNull();
  });

  it("returns whole-section search matches including scope, task, creators and resource metadata", () => {
    const filters = {
      query: "",
      completion: "all" as const,
      label: "all" as const,
    };
    const section = coreSections[3].section;
    for (const query of [
      "Northwestern",
      "Ball seeking hoop",
      "first PID",
      "workspace",
      "proportional",
    ]) {
      expect(matchesSection(section, { ...filters, query }, [])).toBe(true);
    }
    expect(
      matchesSection(
        coreSections[2].section,
        { ...filters, query: "Sketch" },
        [],
      ),
    ).toBe(true);
    expect(
      matchesSection(
        section,
        { ...filters, label: "Build", completion: "unfinished" },
        [],
      ),
    ).toBe(true);
    expect(
      matchesSection(section, { ...filters, completion: "completed" }, []),
    ).toBe(false);
    expect(matchesSection(section, { ...filters, query: "missing" }, [])).toBe(
      false,
    );
    expect(section.resources).toHaveLength(2);
  });

  it("treats resource-free practical tasks as Technical without losing their search text", () => {
    const section = coreSections[2].section;
    const filters = {
      query: "feedback",
      completion: "all" as const,
      label: "Technical" as const,
    };
    expect(matchesSection(section, filters, [])).toBe(true);
    expect(matchesSection(section, { ...filters, label: "Build" }, [])).toBe(
      false,
    );
    expect(
      matchesSection(section, { ...filters, completion: "completed" }, [
        section.id,
      ]),
    ).toBe(true);
  });
});

describe("legacy migration without lost coverage", () => {
  it("maps exact coverage while keeping the complete legacy payload and notes", () => {
    const original = legacyProgress();
    const migrated = migrateLegacyProgress(original);
    expect(migrated.completed).toEqual(["section-video"]);
    expect(migrated.completed).not.toContain("section-task");
    expect(migrated.legacy).toEqual(original);
    expect(migrated.theme).toBe("light");
    expect(migrated.lastOpened).toBe("section-control");
    expect(migrated.expanded).toEqual(["new-systems", "new-control"]);
    original.notes["retired-stage"] = "changed after migration";
    expect(migrated.legacy?.notes["retired-stage"]).toBe("Keep this too");
  });

  it("requires all old units for a combined section, with new exercises unfinished", () => {
    expect(
      migrateLegacyProgress(legacyProgress({ completed: ["rigid-body-dof"] }))
        .completed,
    ).toEqual([]);
    expect(
      migrateLegacyProgress(
        legacyProgress({
          completed: ["rigid-body-dof", "robot-dof", "hoop-build"],
        }),
      ).completed,
    ).toEqual(["section-video", "section-bundle"]);
  });

  it("never changes v1 storage while migrating, and makes saved v2 authoritative", () => {
    const raw = JSON.stringify(legacyProgress());
    const storage = memoryStorage({ [LEGACY_STORAGE_KEY]: raw });
    const initial = loadProgress(storage);
    expect(initial).toMatchObject({
      canSave: true,
      migrated: true,
      warning: null,
    });
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(saveProgress(storage, initial.state)).toBeNull();
    const second = loadProgress(storage);
    expect(second).toMatchObject({
      canSave: true,
      migrated: false,
      state: initial.state,
    });
    const unchecked = toggleSections(second.state, ["section-video"]);
    expect(saveProgress(storage, unchecked)).toBeNull();
    expect(loadProgress(storage).state.completed).toEqual([]);
    expect(storage.getItem(LEGACY_STORAGE_KEY)).toBe(raw);
  });

  it("persists reset as an empty v2 state so old completions cannot resurrect", () => {
    const storage = memoryStorage({
      [LEGACY_STORAGE_KEY]: JSON.stringify(legacyProgress()),
    });
    const reset = resetProgress(loadProgress(storage).state);
    expect(reset).toMatchObject({
      completed: [],
      lastOpened: null,
      theme: "light",
    });
    expect(reset.legacy).toEqual(legacyProgress());
    expect(saveProgress(storage, reset)).toBeNull();
    expect(loadProgress(storage).state.completed).toEqual([]);
    expect(loadProgress(storage).migrated).toBe(false);
  });

  it("adopts a newer v2 reset instead of overwriting it with a delayed migration", () => {
    const rawLegacy = JSON.stringify(legacyProgress());
    const storage = memoryStorage({ [LEGACY_STORAGE_KEY]: rawLegacy });
    const earlier = loadProgress(storage).state;
    const newer = resetProgress(earlier);
    expect(saveProgress(storage, newer)).toBeNull();
    const writes = storage.setItem.mock.calls.length;

    const bootstrapped = persistMigration(storage, earlier);
    expect(bootstrapped).toMatchObject({
      state: newer,
      canSave: true,
      migrated: false,
      warning: null,
    });
    expect(storage.setItem).toHaveBeenCalledTimes(writes);
    expect(loadProgress(storage).state.completed).toEqual([]);
    expect(storage.getItem(LEGACY_STORAGE_KEY)).toBe(rawLegacy);
  });

  it("preserves a malformed v2 that appeared after the initial legacy read", () => {
    const storage = memoryStorage({
      [LEGACY_STORAGE_KEY]: JSON.stringify(legacyProgress()),
    });
    const earlier = loadProgress(storage).state;
    storage.values.set(STORAGE_KEY, "unreadable newer state");

    const bootstrapped = persistMigration(storage, earlier);
    expect(bootstrapped).toMatchObject({
      state: earlier,
      canSave: false,
      migrated: false,
    });
    expect(bootstrapped.warning).toMatch(
      /Existing browser data has not changed/,
    );
    expect(storage.getItem(STORAGE_KEY)).toBe("unreadable newer state");
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("persists legitimate migration once and retains the in-memory state on a failed write", () => {
    const storage = memoryStorage({
      [LEGACY_STORAGE_KEY]: JSON.stringify(legacyProgress()),
    });
    const earlier = loadProgress(storage).state;
    const result = persistMigration(storage, earlier);
    expect(result).toMatchObject({
      state: earlier,
      canSave: true,
      warning: null,
    });
    expect(loadProgress(storage).migrated).toBe(false);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(persistMigration(storage, earlier).state).toEqual(earlier);
    expect(storage.setItem).toHaveBeenCalledTimes(1);

    const failed = persistMigration(
      {
        getItem: () => null,
        setItem: () => {
          throw new Error("quota");
        },
      },
      earlier,
    );
    expect(failed.state).toEqual(earlier);
    expect(failed.warning).toMatch(/Export a backup/);
  });
});

describe("backup validation and persistence failures", () => {
  it("imports v1 backups, then round-trips v2 including unmatched legacy recovery data", () => {
    const oldBackup = JSON.stringify({
      app: "RoboAtlas",
      progress: legacyProgress(),
    });
    const state = importBackup(oldBackup);
    expect(state).toEqual(migrateLegacyProgress(legacyProgress()));
    expect(importBackup(exportBackup(state))).toEqual(state);
    expect(state.legacy?.completed).toContain("retired-lesson");
    expect(state.legacy?.notes["retired-stage"]).toBe("Keep this too");
  });

  it("round-trips a large non-ASCII legacy payload using its actual UTF-8 byte size", () => {
    const state = migrateLegacyProgress(
      legacyProgress({
        customPreference: "漢".repeat(700_000),
      }),
    );
    const backup = exportBackup(state);
    const bytes = new TextEncoder().encode(backup).byteLength;
    expect(bytes).toBeGreaterThan(2_000_000);
    expect(bytes).toBeLessThanOrEqual(MAX_BACKUP_BYTES);
    expect(importBackup(backup)).toEqual(state);
  });

  it("rejects oversized UTF-8 imports and exports before offering an unimportable backup", () => {
    const oversizedUnicode = "漢".repeat(Math.ceil(MAX_BACKUP_BYTES / 3));
    expect(oversizedUnicode.length).toBeLessThan(MAX_BACKUP_BYTES);
    expect(() => importBackup(oversizedUnicode)).toThrow(/too large/);
    const oversizedState = migrateLegacyProgress(
      legacyProgress({
        customPreference: "x".repeat(MAX_BACKUP_BYTES),
      }),
    );
    expect(() => exportBackup(oversizedState)).toThrow(/exceeds 10 MB/);
  });

  it("does not silently lose unavailable v2 IDs or malformed legacy data", () => {
    expect(() =>
      validateProgress({
        ...defaultProgress(),
        completed: ["removed-section"],
      }),
    ).toThrow(/unavailable/);
    expect(() =>
      validateProgress({ ...defaultProgress(), expanded: ["removed-stage"] }),
    ).toThrow(/unavailable/);
    expect(() =>
      validateProgress({ ...defaultProgress(), lastOpened: "removed-section" }),
    ).toThrow(/unavailable/);
    expect(() =>
      migrateLegacyProgress(legacyProgress({ notes: { old: 4 } })),
    ).toThrow(/plain text/);
    expect(() =>
      migrateLegacyProgress(
        legacyProgress({ notes: { old: "x".repeat(20001) } }),
      ),
    ).toThrow(/20,000/);
    expect(() =>
      migrateLegacyProgress(legacyProgress({ completed: [4] })),
    ).toThrow(/version-1/);
  });

  it("blocks ordinary saves after an invalid existing state rather than falling back over it", () => {
    const old = JSON.stringify(legacyProgress());
    for (const damaged of [
      "broken",
      "",
      '{"version":3}',
      JSON.stringify({ ...defaultProgress(), completed: ["unknown"] }),
    ]) {
      const storage = memoryStorage({
        [STORAGE_KEY]: damaged,
        [LEGACY_STORAGE_KEY]: old,
      });
      expect(loadProgress(storage)).toMatchObject({
        canSave: false,
        migrated: false,
      });
      expect(loadProgress(storage).warning).toMatch(
        /Existing browser data has not changed/,
      );
      expect(storage.getItem(STORAGE_KEY)).toBe(damaged);
      expect(storage.getItem(LEGACY_STORAGE_KEY)).toBe(old);
      expect(storage.setItem).not.toHaveBeenCalled();
    }
    const brokenLegacy = memoryStorage({ [LEGACY_STORAGE_KEY]: "broken" });
    expect(loadProgress(brokenLegacy).canSave).toBe(false);
    expect(brokenLegacy.setItem).not.toHaveBeenCalled();
  });

  it("leaves existing data intact on invalid input or quota failures", () => {
    const state = migrateLegacyProgress(legacyProgress());
    const storage = memoryStorage({
      [STORAGE_KEY]: JSON.stringify(state),
      [LEGACY_STORAGE_KEY]: JSON.stringify(legacyProgress()),
    });
    const before = new Map(storage.values);
    expect(saveProgress(storage, { ...state, completed: ["unknown"] })).toMatch(
      /not replaced/,
    );
    expect(storage.values).toEqual(before);
    const blocked = {
      setItem: () => {
        throw new Error("quota");
      },
    };
    expect(saveProgress(blocked, state)).toMatch(/Export a backup/);
    expect(
      loadProgress({
        getItem: () => {
          throw new Error("blocked");
        },
      }),
    ).toMatchObject({ canSave: false });
  });

  it("rejects malformed, oversized, and unrelated backups without altering current state", () => {
    const state = migrateLegacyProgress(legacyProgress());
    const before = JSON.stringify(state);
    for (const input of [
      "broken",
      "null",
      "{}",
      JSON.stringify({ app: "Elsewhere", progress: state }),
      JSON.stringify({ app: "RoboAtlas", progress: { ...state, version: 3 } }),
    ]) {
      expect(() => importBackup(input)).toThrow();
      expect(JSON.stringify(state)).toBe(before);
    }
    expect(() => importBackup("x".repeat(MAX_BACKUP_BYTES + 1))).toThrow(
      /too large/,
    );
  });
});
