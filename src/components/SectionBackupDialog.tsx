import { useEffect, useRef, useState } from "react";
import { Download, Upload, X } from "lucide-react";
import {
  exportBackup,
  importBackup,
  MAX_BACKUP_BYTES,
  resetProgress,
} from "../lib/sectionProgress";
import type { ProgressState } from "../lib/sectionProgress";

export function SectionBackupDialog({
  progress,
  onReplace,
  onClose,
}: {
  progress: ProgressState;
  onReplace: (state: ProgressState) => boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<ProgressState | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reading, setReading] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const element = dialog.current!;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    element.showModal();
    return () => {
      element.close();
      previouslyFocused?.focus();
    };
  }, []);

  function downloadBackup() {
    try {
      const url = URL.createObjectURL(
        new Blob([exportBackup(progress)], { type: "application/json" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "roboatlas-progress.json";
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("Backup exported, including retained legacy data.");
      setError("");
    } catch {
      setError(
        "The backup could not be exported. Your saved data is unchanged.",
      );
    }
  }

  async function readBackup(file: File | undefined) {
    if (!file) return;
    setPending(null);
    setError("");
    setMessage("");
    setResetting(false);
    setReading(true);
    try {
      if (file.size > MAX_BACKUP_BYTES) {
        throw new Error("Choose a RoboAtlas progress backup under 10 MB.");
      }
      setPending(importBackup(await file.text()));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "This backup could not be read.",
      );
    } finally {
      setReading(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      className="backup-dialog"
      aria-labelledby="backup-title"
      aria-describedby="backup-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="dialog-header">
        <h2 id="backup-title">Progress & backup</h2>
        <button
          className="icon-button"
          aria-label="Close progress and backup"
          onClick={onClose}
        >
          <X size={19} />
        </button>
      </div>
      <p className="dialog-intro" id="backup-description">
        Progress stays in this browser and website address. It does not sync
        between devices. Export a backup before clearing site data.
      </p>
      {progress.legacy && (
        <p className="dialog-intro">
          Original progress and legacy notes are retained for recovery and
          included in exports.
        </p>
      )}
      <div className="backup-actions">
        <button className="backup-action" onClick={downloadBackup}>
          <Download size={20} aria-hidden="true" />
          <span>
            <strong>Export progress</strong>
            <small>
              Save core sections, preferences, and legacy recovery data.
            </small>
          </span>
        </button>
        <button
          className="backup-action"
          disabled={reading}
          onClick={() => fileInput.current?.click()}
        >
          <Upload size={20} aria-hidden="true" />
          <span>
            <strong>{reading ? "Reading backup…" : "Import progress"}</strong>
            <small>
              Supports original and section-based RoboAtlas backups.
            </small>
          </span>
        </button>
        <input
          ref={fileInput}
          className="sr-only"
          tabIndex={-1}
          aria-label="Progress backup file"
          type="file"
          accept=".json,application/json"
          onChange={(event) => {
            void readBackup(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
      {error && (
        <p className="dialog-error" role="alert">
          {error} Your current progress has not changed.
        </p>
      )}
      {pending && (
        <div className="import-preview">
          <h3>Review this backup</h3>
          <p>
            Replace {progress.completed.length} completed core sections with{" "}
            {pending.completed.length}. Theme and expanded stages will also be
            restored.
            {pending.legacy && " Original legacy data is included."} Export your
            current progress first if you want to keep a copy.
          </p>
          <div className="dialog-button-row">
            <button
              className="primary-button"
              onClick={() => {
                const saved = onReplace(pending);
                setPending(null);
                setMessage(
                  saved
                    ? "Progress restored."
                    : "Restored in this tab. Browser storage could not be updated; export a backup.",
                );
              }}
            >
              Replace with this backup
            </button>
            <button
              className="secondary-button"
              onClick={() => setPending(null)}
            >
              Cancel import
            </button>
          </div>
        </div>
      )}
      {message && (
        <p className="dialog-status" role="status">
          {message}
        </p>
      )}
      <div className="danger-zone">
        {!resetting ? (
          <button
            onClick={() => {
              setResetting(true);
              setPending(null);
              setMessage("");
              setError("");
            }}
          >
            Reset learning progress…
          </button>
        ) : (
          <>
            <p>
              <strong>Reset completed core sections?</strong>
              <br />
              This clears core completion and your resume position. Preferences
              and original legacy recovery data remain. Export a backup first to
              keep your current progress.
            </p>
            <div className="dialog-button-row">
              <button
                className="danger-button"
                onClick={() => {
                  const saved = onReplace(resetProgress(progress));
                  setResetting(false);
                  setMessage(
                    saved
                      ? "Core progress reset. Legacy recovery data retained."
                      : "Reset in this tab. Browser storage could not be updated; export a backup.",
                  );
                }}
              >
                Confirm reset
              </button>
              <button
                className="secondary-button"
                onClick={() => setResetting(false)}
              >
                Keep my progress
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
