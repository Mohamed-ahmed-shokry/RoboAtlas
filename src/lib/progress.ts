import { curriculum as legacyCurriculum } from "../legacy/curriculum";
import type { ContentLabel } from "../legacy/curriculum";
import { coreSections, roadmap } from "../data/roadmap";
import type { LearningSection } from "../data/roadmap";

export type CompletionFilter = "all" | "unfinished" | "completed";
export interface Filters {
  query: string;
  completion: CompletionFilter;
  label: ContentLabel | "all";
}
export type StorageReader = Pick<Storage, "getItem">;
export type StorageWriter = Pick<Storage, "setItem">;

export const STORAGE_KEY = "roboatlas.progress.v2";
export const LEGACY_STORAGE_KEY = "roboatlas.progress.v1";
export const MAX_BACKUP_BYTES = 10_000_000;

export interface LegacyProgressState {
  version: 1;
  completed: string[];
  notes: Record<string, string>;
  lastOpened: string | null;
  expanded: string[];
  theme: "dark" | "light";
  [key: string]: unknown;
}

export interface ProgressState {
  version: 2;
  completed: string[];
  lastOpened: string | null;
  expanded: string[];
  theme: "dark" | "light";
  legacy: LegacyProgressState | null;
}

export interface LoadedProgress {
  state: ProgressState;
  warning: string | null;
  canSave: boolean;
  migrated: boolean;
}

const sectionIds = new Set(coreSections.map(({ section }) => section.id));
const stageIds = new Set(roadmap.map((stage) => stage.id));
const legacyStages = new Map(
  legacyCurriculum.map((stage) => [
    stage.id,
    new Set(
      stage.resources.flatMap((resource) =>
        resource.units.map((unit) => unit.id),
      ),
    ),
  ]),
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= 10000 &&
    value.every((item) => typeof item === "string")
  );
}

function validTheme(value: unknown): value is "dark" | "light" {
  return value === "dark" || value === "light";
}

/** Validate legacy structure without filtering against either curriculum's IDs. */
export function validateLegacyProgress(value: unknown): LegacyProgressState {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    !stringArray(value.completed) ||
    !isRecord(value.notes) ||
    !stringArray(value.expanded) ||
    !(value.lastOpened === null || typeof value.lastOpened === "string") ||
    !validTheme(value.theme)
  ) {
    throw new Error(
      "This is not a supported RoboAtlas version-1 progress file.",
    );
  }
  for (const note of Object.values(value.notes)) {
    if (typeof note !== "string" || note.length > 20000) {
      throw new Error(
        "Legacy notes must be plain text, up to 20,000 characters each.",
      );
    }
  }
  // Keep all original fields, including unknown IDs and older display preferences.
  return JSON.parse(JSON.stringify(value)) as LegacyProgressState;
}

export function defaultProgress(): ProgressState {
  return {
    version: 2,
    completed: [],
    lastOpened: null,
    expanded: roadmap[0] ? [roadmap[0].id] : [],
    theme: "dark",
    legacy: null,
  };
}

export function migrateLegacyProgress(value: unknown): ProgressState {
  const legacy = validateLegacyProgress(value);
  const done = new Set(legacy.completed);
  const completed = coreSections
    .filter(
      ({ section }) =>
        !section.task &&
        Boolean(section.legacyUnitIds?.length) &&
        section.legacyUnitIds!.every((id) => done.has(id)),
    )
    .map(({ section }) => section.id);
  const completedIds = new Set(completed);
  const recent = coreSections.find(
    ({ section }) =>
      section.legacyUnitIds?.includes(legacy.lastOpened ?? "") &&
      !completedIds.has(section.id),
  );
  const expanded = roadmap
    .filter((stage) =>
      legacy.expanded.some((oldStageId) => {
        const oldIds = legacyStages.get(oldStageId);
        return (
          stage.id === oldStageId ||
          stage.sections.some((section) =>
            section.legacyUnitIds?.some((id) => oldIds?.has(id)),
          )
        );
      }),
    )
    .map((stage) => stage.id);
  if (recent && !expanded.includes(recent.stage.id))
    expanded.push(recent.stage.id);
  return {
    ...defaultProgress(),
    completed,
    lastOpened: recent?.section.id ?? null,
    expanded: expanded.length ? expanded : defaultProgress().expanded,
    theme: legacy.theme,
    legacy,
  };
}

export function validateProgress(value: unknown): ProgressState {
  if (
    !isRecord(value) ||
    value.version !== 2 ||
    !stringArray(value.completed) ||
    !stringArray(value.expanded) ||
    !validTheme(value.theme) ||
    !(value.lastOpened === null || typeof value.lastOpened === "string") ||
    !(value.legacy === null || isRecord(value.legacy))
  ) {
    throw new Error(
      "This is not a supported RoboAtlas version-2 progress file.",
    );
  }
  if (
    value.completed.some((id) => !sectionIds.has(id)) ||
    value.expanded.some((id) => !stageIds.has(id)) ||
    (value.lastOpened !== null && !sectionIds.has(value.lastOpened))
  ) {
    throw new Error(
      "This backup contains section or stage IDs unavailable in this roadmap. Your saved data has not changed.",
    );
  }
  return {
    version: 2,
    completed: [...new Set(value.completed)],
    lastOpened: value.lastOpened,
    expanded: [...new Set(value.expanded)],
    theme: value.theme,
    legacy: value.legacy === null ? null : validateLegacyProgress(value.legacy),
  };
}

/** Read only: the hook persists a successful migration without changing the v1 key. */
export function loadProgress(storage: StorageReader): LoadedProgress {
  try {
    const current = storage.getItem(STORAGE_KEY);
    if (current !== null) {
      return {
        state: validateProgress(JSON.parse(current)),
        warning: null,
        canSave: true,
        migrated: false,
      };
    }
    const previous = storage.getItem(LEGACY_STORAGE_KEY);
    return {
      state:
        previous === null
          ? defaultProgress()
          : migrateLegacyProgress(JSON.parse(previous)),
      warning: null,
      canSave: true,
      migrated: previous !== null,
    };
  } catch {
    return {
      state: defaultProgress(),
      warning:
        "Saved progress could not be read safely. Existing browser data has not changed. Import a valid backup or explicitly reset progress before saving. Browser storage may be unavailable.",
      canSave: false,
      migrated: false,
    };
  }
}

/** Recheck v2 synchronously before the initial migration can write anything. */
export function persistMigration(
  storage: StorageReader & StorageWriter,
  migrated: ProgressState,
): LoadedProgress {
  try {
    const current = storage.getItem(STORAGE_KEY);
    if (current !== null) {
      return {
        state: validateProgress(JSON.parse(current)),
        warning: null,
        canSave: true,
        migrated: false,
      };
    }
    return {
      state: migrated,
      warning: saveProgress(storage, migrated),
      canSave: true,
      migrated: false,
    };
  } catch {
    return {
      state: migrated,
      warning:
        "Saved progress changed before migration and could not be read safely. Existing browser data has not changed. Import a valid backup or explicitly reset progress before saving.",
      canSave: false,
      migrated: false,
    };
  }
}

export function saveProgress(
  storage: StorageWriter,
  state: ProgressState,
): string | null {
  try {
    const validated = validateProgress(state);
    storage.setItem(STORAGE_KEY, JSON.stringify(validated));
    return null;
  } catch {
    return "Your changes could not be saved. Existing saved data was not replaced. Export a backup before closing this tab.";
  }
}

export function countProgress(ids: string[], completed: readonly string[]) {
  const unique = [...new Set(ids)];
  const done = new Set(completed);
  const count = unique.filter((id) => done.has(id)).length;
  return {
    count,
    total: unique.length,
    percent: unique.length ? Math.round((count / unique.length) * 100) : 0,
  };
}

export function toggleSections(
  state: ProgressState,
  ids: string[],
): ProgressState {
  const completed = new Set(state.completed);
  const known = ids.filter((id) => sectionIds.has(id));
  const allDone = known.every((id) => completed.has(id));
  for (const id of known) {
    if (allDone) completed.delete(id);
    else completed.add(id);
  }
  return { ...state, completed: [...completed] };
}

export function resetProgress(state: ProgressState): ProgressState {
  return { ...state, completed: [], lastOpened: null };
}

export function continueLearning(state: ProgressState) {
  const done = new Set(state.completed);
  return (
    coreSections.find(
      ({ section }) => section.id === state.lastOpened && !done.has(section.id),
    ) ??
    coreSections.find(({ section }) => !done.has(section.id)) ??
    null
  );
}

export function matchesSection(
  section: LearningSection,
  filters: Filters,
  completed: readonly string[],
) {
  const text = [
    section.title,
    section.scope ?? "",
    section.task ?? "",
    ...section.resources.flatMap((resource) => [
      resource.title,
      resource.creator,
      resource.scope ?? "",
    ]),
  ]
    .join(" ")
    .toLocaleLowerCase();
  const done = completed.includes(section.id);
  return (
    text.includes(filters.query.trim().toLocaleLowerCase()) &&
    (filters.label === "all" ||
      (section.resources.length === 0 && filters.label === "Technical") ||
      section.resources.some((resource) => resource.label === filters.label)) &&
    (filters.completion === "all" ||
      (filters.completion === "completed" ? done : !done))
  );
}

export function exportBackup(state: ProgressState): string {
  // Compact JSON avoids inflating retained legacy payloads with indentation.
  const backup = JSON.stringify({
    app: "RoboAtlas",
    exportedAt: new Date().toISOString(),
    progress: validateProgress(state),
  });
  if (new TextEncoder().encode(backup).byteLength > MAX_BACKUP_BYTES) {
    throw new Error(
      "This backup exceeds 10 MB and could not be exported. Existing saved data has not changed.",
    );
  }
  return backup;
}

export function importBackup(text: string): ProgressState {
  if (new TextEncoder().encode(text).byteLength > MAX_BACKUP_BYTES) {
    throw new Error(
      "This file is too large. Choose a RoboAtlas progress backup under 10 MB.",
    );
  }
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error(
      "This file is not valid JSON. Choose a RoboAtlas progress backup.",
    );
  }
  if (
    !isRecord(value) ||
    value.app !== "RoboAtlas" ||
    !isRecord(value.progress)
  ) {
    throw new Error("Choose a progress backup exported from RoboAtlas.");
  }
  return value.progress.version === 1
    ? migrateLegacyProgress(value.progress)
    : validateProgress(value.progress);
}
