import { useEffect, useRef, useState } from "react";
import {
  defaultProgress,
  loadProgress,
  persistMigration,
  saveProgress,
  validateProgress,
} from "./sectionProgress";
import type { ProgressState } from "./sectionProgress";

function readInitialProgress() {
  try {
    return loadProgress(window.localStorage);
  } catch {
    return {
      state: defaultProgress(),
      warning:
        "Browser storage is unavailable. Export a backup to keep your progress.",
      canSave: false,
      migrated: false,
    };
  }
}

export function useSectionProgress() {
  const [initial] = useState(readInitialProgress);
  const [progress, setProgress] = useState(initial.state);
  const [warning, setWarning] = useState(initial.warning);
  const current = useRef(progress);
  const canSave = useRef(initial.canSave);

  function persist(next: ProgressState) {
    try {
      const failure = saveProgress(window.localStorage, next);
      setWarning(failure);
      return failure === null;
    } catch {
      setWarning(
        "Your changes could not be saved. Export a backup before closing this tab.",
      );
      return false;
    }
  }

  function update(
    change: ProgressState | ((previous: ProgressState) => ProgressState),
  ) {
    const next =
      typeof change === "function" ? change(current.current) : change;
    current.current = next;
    setProgress(next);
    // Corrupt or unrecognized saved data is never overwritten by ordinary learning actions.
    if (canSave.current) persist(next);
  }

  /** Only use after the user confirms a validated import or an explicit reset. */
  function replace(next: ProgressState) {
    const validated = validateProgress(next);
    current.current = validated;
    setProgress(validated);
    canSave.current = true;
    return persist(validated);
  }

  useEffect(() => {
    if (!initial.migrated || !canSave.current) return;
    try {
      const result = persistMigration(window.localStorage, current.current);
      current.current = result.state;
      canSave.current = result.canSave;
      setProgress(result.state);
      setWarning(result.warning);
    } catch {
      canSave.current = false;
      setWarning(
        "Your migrated progress could not be saved. The original progress is intact; export a backup before closing this tab.",
      );
    }
  }, [initial.migrated]);

  useEffect(() => {
    document.documentElement.dataset.theme = progress.theme;
  }, [progress.theme]);

  return { progress, update, replace, warning };
}
