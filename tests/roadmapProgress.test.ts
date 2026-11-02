import { describe, expect, it } from "vitest";
import {
  curriculum as legacyCurriculum,
  learningUnits as legacyLearningUnits,
  unitIds as legacyUnitIds,
} from "../src/legacy/curriculum";
import { coreSections, optionalResources, roadmap } from "../src/data/roadmap";
import type { LegacyProgressState } from "../src/lib/progress";
import {
  continueLearning,
  countProgress,
  defaultProgress,
  exportBackup,
  importBackup,
  LEGACY_STORAGE_KEY,
  loadProgress,
  matchesSection,
  migrateLegacyProgress,
  resetProgress,
  saveProgress,
  STORAGE_KEY,
  toggleSections,
  validateProgress,
} from "../src/lib/progress";

function legacyProgress(completed: string[] = []): LegacyProgressState {
  return {
    version: 1,
    completed,
    notes: {
      "robot-systems": "Keep the original feedback-loop idea.",
      "retired-stage": "Keep unmatched notes as plain text: <b>idea</b>.",
    },
    lastOpened: "navigation-path-planning",
    expanded: legacyCurriculum.map((stage) => stage.id),
    theme: "light",
    olderPreference: { compact: true },
  };
}

function memoryStorage(initial: Record<string, string>) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

const allLegacyIds = legacyLearningUnits.map(({ unit }) => unit.id);
const addedSectionIds = [
  "point-cloud-processing",
  "gps-imu-pose-fusion",
  "gemini-vla-example",
  "world-model-concepts",
  "physical-ai-development-cycle",
];
const allCoreIds = coreSections.map(({ section }) => section.id);

describe("migration against the actual updated roadmap", () => {
  it("keeps added sections unfinished in existing v2 progress despite retained legacy completions", () => {
    const state = {
      ...defaultProgress(),
      completed: allCoreIds.filter((id) => !addedSectionIds.includes(id)),
      legacy: legacyProgress(allLegacyIds),
    };
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(state) });
    const loaded = loadProgress(storage);
    expect(loaded.canSave).toBe(true);
    expect(loaded.migrated).toBe(false);
    expect(loaded.state).toEqual(state);
    expect(continueLearning(loaded.state)?.section.id).toBe(
      "point-cloud-processing",
    );
    expect(importBackup(exportBackup(state)).completed).toEqual(state.completed);
  });

  it("maps added sections only from their exact v1 learning units", () => {
    const units = [
      "point-cloud-basics",
      "fusion-pose",
      "gemini-intro-demo",
      "world-model-introduction",
      "physical-ai-development",
    ];
    for (const [index, unit] of units.entries()) {
      const mapped = migrateLegacyProgress(legacyProgress([unit]));
      expect(mapped.completed).toEqual([addedSectionIds[index]]);
    }
    expect(
      migrateLegacyProgress(legacyProgress(["fusion-orientation"])).completed,
    ).not.toContain("gps-imu-pose-fusion");
  });

  it("uses valid, explicit legacy coverage IDs and never assigns them to new practical work", () => {
    const mapped = coreSections.filter(
      ({ section }) => section.legacyUnitIds?.length,
    );
    expect(mapped.length).toBeGreaterThan(0);
    for (const { section } of mapped) {
      expect(section.task, section.id).toBeUndefined();
      expect(new Set(section.legacyUnitIds).size, section.id).toBe(
        section.legacyUnitIds!.length,
      );
      for (const id of section.legacyUnitIds!) {
        expect(legacyUnitIds.has(id), `${section.id}: ${id}`).toBe(true);
      }
    }
  });

  it("migrates all legacy completions only to proven coverage and leaves new material unfinished", () => {
    const original = legacyProgress([
      ...allLegacyIds,
      "unmatched-historical-unit",
    ]);
    const migrated = migrateLegacyProgress(original);
    expect(migrated.completed.length).toBeGreaterThan(0);
    expect(migrated.completed.length).toBeLessThan(coreSections.length);
    expect(migrated.completed).toContain("hoop-system-case-study");
    expect(migrated.completed).toContain("robot-examples-definitions");
    expect(migrated.completed).toContain("robot-anatomy-uncertainty");
    expect(migrated.completed).not.toContain("sensor-action-loop");
    expect(migrated.completed).not.toContain("aloha-episode-zero");
    expect(migrated.completed).not.toContain("nav2-launch-example");

    for (const { section } of coreSections) {
      if (migrated.completed.includes(section.id)) {
        expect(section.task, section.id).toBeUndefined();
        expect(section.legacyUnitIds?.length, section.id).toBeGreaterThan(0);
        expect(
          section.legacyUnitIds!.every((id) => allLegacyIds.includes(id)),
          section.id,
        ).toBe(true);
      } else if (section.task || !section.legacyUnitIds?.length) {
        expect(migrated.completed, section.id).not.toContain(section.id);
      }
    }
    expect(migrated.legacy).toEqual(original);
    expect(migrated.legacy?.completed).toContain("unmatched-historical-unit");
    expect(migrated.legacy?.notes["retired-stage"]).toBe(
      original.notes["retired-stage"],
    );
    expect(validateProgress(migrated)).toEqual(migrated);
  });

  it("does not promote a partially watched bundle to a completed section", () => {
    const partial = migrateLegacyProgress(
      legacyProgress([
        "rigid-body-dof",
        "rigid-body-motions",
        "rotation-matrices-one",
        "camera-intrinsics-extrinsics",
      ]),
    );
    expect(partial.completed).not.toContain("degrees-of-freedom");
    expect(partial.completed).not.toContain("rigid-body-rotations");
    expect(partial.completed).not.toContain("camera-calibration");

    const complete = migrateLegacyProgress(
      legacyProgress([
        "rigid-body-dof",
        "robot-dof",
        "rigid-body-motions",
        "rotation-matrices-one",
        "rotation-matrices-two",
        "camera-intrinsics-extrinsics",
        "intrinsic-calibration",
      ]),
    );
    expect(complete.completed).toEqual(
      expect.arrayContaining([
        "degrees-of-freedom",
        "rigid-body-rotations",
        "camera-calibration",
      ]),
    );
  });

  it("preserves original storage and keeps unchecking/reset authoritative across reloads", () => {
    const original = legacyProgress(allLegacyIds);
    const rawLegacy = JSON.stringify(original);
    const storage = memoryStorage({ [LEGACY_STORAGE_KEY]: rawLegacy });
    const migrated = loadProgress(storage);
    expect(migrated).toMatchObject({ migrated: true, canSave: true });
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    expect(storage.getItem(LEGACY_STORAGE_KEY)).toBe(rawLegacy);

    const unchecked = toggleSections(migrated.state, [
      "hoop-system-case-study",
    ]);
    expect(saveProgress(storage, unchecked)).toBeNull();
    const reloaded = loadProgress(storage);
    expect(reloaded.migrated).toBe(false);
    expect(reloaded.state.completed).not.toContain("hoop-system-case-study");
    expect(reloaded.state.legacy).toEqual(original);

    const reset = resetProgress(reloaded.state);
    expect(saveProgress(storage, reset)).toBeNull();
    const afterReset = loadProgress(storage);
    expect(afterReset).toMatchObject({ migrated: false, canSave: true });
    expect(afterReset.state.completed).toEqual([]);
    expect(afterReset.state.lastOpened).toBeNull();
    expect(afterReset.state.legacy).toEqual(original);
    expect(afterReset.state.theme).toBe("light");
    expect(storage.getItem(LEGACY_STORAGE_KEY)).toBe(rawLegacy);
  });

  it("imports both backup versions with actual IDs without losing unmatched history", () => {
    const original = legacyProgress([...allLegacyIds, "older-unmatched-unit"]);
    const fromOldBackup = importBackup(
      JSON.stringify({
        app: "RoboAtlas",
        exportedAt: "2026-10-27T00:00:00.000Z",
        progress: original,
      }),
    );
    expect(fromOldBackup).toEqual(migrateLegacyProgress(original));
    expect(importBackup(exportBackup(fromOldBackup))).toEqual(fromOldBackup);
    expect(fromOldBackup.legacy?.notes).toEqual(original.notes);
    expect(fromOldBackup.legacy?.completed).toEqual(original.completed);
  });
});

describe("core-only resume, filtering, and counts with real content", () => {
  it("collapses only after all stage sections finish even when the toggle comes from a filtered view", () => {
    const stage = roadmap.find((item) => item.id === "systems-foundations")!;
    const state = { ...defaultProgress(), expanded: [stage.id] };
    const matching = stage.sections.filter((section) =>
      matchesSection(
        section,
        {
          query: "Sketch a feedback loop",
          completion: "unfinished",
          label: "all",
        },
        state.completed,
      ),
    );
    expect(matching.map((section) => section.id)).toEqual(["sensor-action-loop"]);

    const matchingIds = matching.map((section) => section.id);
    const partial = toggleSections(state, matchingIds);
    const stageIds = stage.sections.map((section) => section.id);
    expect(countProgress(stageIds, partial.completed)).toMatchObject({
      count: 1,
      total: stage.sections.length,
    });
    expect(partial.expanded).toEqual([stage.id]);

    const hiddenComplete = {
      ...state,
      completed: stageIds.filter((id) => !matchingIds.includes(id)),
    };
    const finished = toggleSections(hiddenComplete, matchingIds);
    expect(countProgress(stageIds, finished.completed).percent).toBe(100);
    expect(finished.expanded).toEqual([]);
    expect(continueLearning(finished)?.stage.id).not.toBe(stage.id);
  });

  it("excludes optional resources from completion and from the all-complete calculation", () => {
    expect(optionalResources.length).toBeGreaterThan(0);
    const optionalIds = optionalResources.map((resource) => resource.id);
    expect(optionalIds.some((id) => allCoreIds.includes(id))).toBe(false);
    const state = toggleSections(defaultProgress(), [
      ...allCoreIds,
      ...optionalIds,
    ]);
    expect(state.completed).toHaveLength(coreSections.length);
    expect(state.completed.some((id) => optionalIds.includes(id))).toBe(false);
    expect(countProgress(allCoreIds, state.completed)).toEqual({
      count: coreSections.length,
      total: coreSections.length,
      percent: 100,
    });
    expect(continueLearning(state)).toBeNull();
    const firstUnfinished = toggleSections(state, [allCoreIds[0]]);
    expect(continueLearning(firstUnfinished)?.section.id).toBe(allCoreIds[0]);
  });

  it("selects the earliest unfinished section without applying recent history or filters", () => {
    const fresh = defaultProgress();
    expect(continueLearning(fresh)?.section.id).toBe(
      "robot-examples-definitions",
    );
    const recent = { ...fresh, lastOpened: "nav2-launch-example" };
    expect(continueLearning(recent)?.section.id).toBe("robot-examples-definitions");
    expect(recent.completed).toEqual([]);
    expect(recent.lastOpened).toBe("nav2-launch-example");

    const matching = coreSections.filter(({ section }) =>
      matchesSection(
        section,
        { query: "Northwestern", completion: "unfinished", label: "Technical" },
        recent.completed,
      ),
    );
    expect(matching.length).toBeGreaterThan(0);
    expect(
      matching.some(({ section }) => section.id === "robot-examples-definitions"),
    ).toBe(false);
    expect(continueLearning(recent)?.section.id).toBe("robot-examples-definitions");
    expect(countProgress(allCoreIds, recent.completed).total).toBe(
      coreSections.length,
    );
    expect(
      continueLearning(toggleSections(recent, [recent.lastOpened]))?.section.id,
    ).toBe("robot-examples-definitions");
    const restored = importBackup(exportBackup(recent));
    expect(restored.lastOpened).toBe("nav2-launch-example");
    expect(continueLearning(restored)?.section.id).toBe("robot-examples-definitions");
  });

  it("keeps roadmap order across saved stage transitions and an earlier unchecked section", () => {
    const state = {
      ...defaultProgress(),
      completed: roadmap[0].sections.map((section) => section.id),
      lastOpened: "nav2-launch-example",
    };
    const storage = memoryStorage({});
    expect(saveProgress(storage, state)).toBeNull();
    const reloaded = loadProgress(storage).state;
    expect(continueLearning(reloaded)?.section.id).toBe("motor-control-chain");

    const unchecked = toggleSections(reloaded, ["robot-anatomy-uncertainty"]);
    expect(saveProgress(storage, unchecked)).toBeNull();
    const afterUncheck = loadProgress(storage).state;
    expect(continueLearning(afterUncheck)?.section.id).toBe("robot-anatomy-uncertainty");
    expect(afterUncheck.lastOpened).toBe("nav2-launch-example");
  });

  it("preserves mapped legacy opened history while selecting the earliest unfinished section", () => {
    const migrated = migrateLegacyProgress(legacyProgress());
    const next = continueLearning(migrated);
    expect(next?.section.id).toBe("robot-examples-definitions");
    expect(migrated.lastOpened).toBe("path-planning-concepts");
    expect(migrated.expanded).toContain(next!.stage.id);
    const currentStageIds = new Set(roadmap.map((stage) => stage.id));
    expect(migrated.expanded.every((id) => currentStageIds.has(id))).toBe(true);
    expect(validateProgress(migrated)).toEqual(migrated);
  });
});
