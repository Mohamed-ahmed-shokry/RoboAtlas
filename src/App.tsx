import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Compass,
  DatabaseBackup,
  ListFilter,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { curriculum, learningUnits } from "./data/curriculum";
import type { ContentLabel } from "./data/curriculum";
import {
  continueLearning,
  countProgress,
  matchesUnit,
  toggleUnits,
} from "./lib/progress";
import type { CompletionFilter, Filters } from "./lib/progress";
import { useProgress } from "./lib/useProgress";
import { Sidebar } from "./components/Sidebar";
import { StageSection } from "./components/StageSection";
import { BackupDialog } from "./components/BackupDialog";

const emptyFilters: Filters = { query: "", completion: "all", label: "all" };
const labels: ContentLabel[] = [
  "Technical",
  "Build",
  "Application",
  "Discussion",
  "Career",
];

export default function App() {
  const { progress, update, warning } = useProgress();
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [active, setActive] = useState(
    () => continueLearning(progress)?.stage.id ?? curriculum[0].id,
  );
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const overall = countProgress(
    learningUnits.map((item) => item.unit.id),
    progress.completed,
  );
  const next = continueLearning(progress);
  const filtering =
    filters.query.trim() !== "" ||
    filters.completion !== "all" ||
    filters.label !== "all";
  const visible = learningUnits.filter((item) =>
    matchesUnit(
      item.resource,
      item.unit.title,
      item.unit.id,
      filters,
      progress.completed,
    ),
  );
  const visibleStages = new Set(visible.map((item) => item.stage.id));

  function reveal(stageId: string, unitId?: string) {
    setFilters(emptyFilters);
    setActive(stageId);
    setHighlighted(unitId ?? null);
    update((previous) => ({
      ...previous,
      expanded: [...new Set([...previous.expanded, stageId])],
    }));
    if (filtering)
      setNotice("Filters cleared to reveal your place in the full roadmap.");
    requestAnimationFrame(() => {
      const target = document.getElementById(
        unitId ? `unit-${unitId}` : `stage-${stageId}`,
      );
      target?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "center",
      });
      if (unitId) target?.focus({ preventScroll: true });
    });
  }

  function openUnit(id: string) {
    update((previous) => ({ ...previous, lastOpened: id }));
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to roadmap
      </a>
      <Sidebar
        completed={progress.completed}
        active={active}
        onNavigate={reveal}
        storageWarning={Boolean(warning)}
      />
      <div className="app-body">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Learning roadmap</span>
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button"
              onClick={() =>
                update((previous) => ({
                  ...previous,
                  theme: previous.theme === "dark" ? "light" : "dark",
                }))
              }
              aria-label={`Switch to ${progress.theme === "dark" ? "light" : "dark"} theme`}
            >
              {progress.theme === "dark" ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )}
            </button>
            <button
              className="backup-button"
              aria-label="Progress & backup"
              onClick={() => setSettingsOpen(true)}
            >
              <DatabaseBackup size={15} aria-hidden="true" />
              <span>Progress & backup</span>
            </button>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          <div className="page-heading">
            <div>
              <h1>Your robotics roadmap</h1>
            </div>
          </div>
          <section className="progress-summary" aria-label="Overall progress">
            <span className="progress-count">
              <strong>{overall.count}</strong> / {overall.total} units complete
            </span>
            <progress
              value={overall.count}
              max={overall.total}
              aria-label="Overall completion"
            />
            <span className="progress-percent">{overall.percent}%</span>
          </section>
          <section
            className={`continue-card ${!next ? "all-complete" : ""}`}
            aria-label="Continue learning"
          >
            <div className="continue-info">
              <span className="card-eyebrow">
                {next
                  ? `UP NEXT · STAGE ${String(next.stageNumber).padStart(2, "0")}`
                  : `ALL ${overall.total} UNITS COMPLETE`}
              </span>
              <h2>{next ? next.unit.title : "Roadmap complete"}</h2>
              <p>
                {next
                  ? `${next.resource.creator} · ${next.resource.format}`
                  : "Revisit any stage, reflect on your notes, and pick two experiments to try next."}
              </p>
              {next?.resource.selection && (
                <p className="continue-selection">{next.resource.selection}</p>
              )}
            </div>
            <div className="continue-actions">
              {next ? (
                <>
                  <button
                    className="primary-button"
                    onClick={() => reveal(next.stage.id, next.unit.id)}
                  >
                    Continue learning
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                  <a
                    href={next.resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => openUnit(next.unit.id)}
                    onAuxClick={(event) => {
                      if (event.button === 1) openUnit(next.unit.id);
                    }}
                  >
                    Open resource
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </>
              ) : (
                <button
                  className="primary-button"
                  onClick={() => reveal(curriculum[0].id)}
                >
                  Review the roadmap
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </section>
          {warning && (
            <div role="alert" className="storage-warning">
              {warning}
              <button onClick={() => setSettingsOpen(true)}>
                Open backup controls
              </button>
            </div>
          )}
          <div className="roadmap-heading">
            <div>
              <h2>
                Roadmap <span>{curriculum.length} stages</span>
              </h2>
            </div>
            <button
              className="text-button"
              onClick={() => {
                if (filtering) setFilters(emptyFilters);
                update((previous) => ({
                  ...previous,
                  expanded:
                    !filtering && previous.expanded.length === curriculum.length
                      ? []
                      : curriculum.map((stage) => stage.id),
                }));
              }}
            >
              {!filtering && progress.expanded.length === curriculum.length
                ? "Collapse all"
                : "Expand all"}
              <ChevronDown size={14} aria-hidden="true" />
            </button>
          </div>
          <div className="filter-bar">
            <div className="search-field">
              <Search size={16} aria-hidden="true" />
              <label className="sr-only" htmlFor="roadmap-search">
                Search resources, creators, and lessons
              </label>
              <input
                id="roadmap-search"
                type="search"
                placeholder="Search resources, creators, lessons…"
                value={filters.query}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    query: event.target.value,
                  }))
                }
              />
            </div>
            <div className="filter-select">
              <ListFilter size={14} aria-hidden="true" />
              <label className="sr-only" htmlFor="completion-filter">
                Completion filter
              </label>
              <select
                id="completion-filter"
                value={filters.completion}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    completion: event.target.value as CompletionFilter,
                  }))
                }
              >
                <option value="all">All progress</option>
                <option value="unfinished">Unfinished</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="filter-select">
              <label className="sr-only" htmlFor="content-filter">
                Content type filter
              </label>
              <select
                id="content-filter"
                value={filters.label}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    label: event.target.value as Filters["label"],
                  }))
                }
              >
                <option value="all">All content types</option>
                {labels.map((label) => (
                  <option key={label}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="filter-status" role="status">
            {filtering && (
              <>
                <span>
                  {visible.length} of {overall.total} units match · Overall
                  progress stays {overall.count}/{overall.total}
                </span>
                <button
                  className="text-button"
                  onClick={() => setFilters(emptyFilters)}
                >
                  Clear filters
                  <X size={12} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
          <div className="stages">
            {curriculum.map(
              (stage, index) =>
                visibleStages.has(stage.id) && (
                  <StageSection
                    key={stage.id}
                    stage={stage}
                    number={index + 1}
                    expanded={filtering || progress.expanded.includes(stage.id)}
                    completed={progress.completed}
                    note={progress.notes[stage.id] ?? ""}
                    filters={filters}
                    highlighted={highlighted}
                    onExpand={() => {
                      if (filtering) {
                        setFilters(emptyFilters);
                        setNotice("Filters cleared. Stage expansion is saved.");
                      }
                      setActive(stage.id);
                      update((previous) => ({
                        ...previous,
                        expanded:
                          filtering || previous.expanded.includes(stage.id)
                            ? previous.expanded.filter((id) => id !== stage.id)
                            : [...previous.expanded, stage.id],
                      }));
                    }}
                    onToggle={(ids) =>
                      update((previous) => toggleUnits(previous, ids))
                    }
                    onOpen={openUnit}
                    onNote={(note) =>
                      update((previous) => ({
                        ...previous,
                        notes: { ...previous.notes, [stage.id]: note },
                      }))
                    }
                  />
                ),
            )}
          </div>
          {!visible.length && (
            <div className="empty-state">
              <Search size={28} aria-hidden="true" />
              <h3>No lessons match these filters.</h3>
              <p>
                Try another title or creator, or return to your full roadmap.
              </p>
              <button
                className="secondary-button"
                onClick={() => setFilters(emptyFilters)}
              >
                Clear all filters
              </button>
            </div>
          )}
          <footer className="page-footer">
            <Compass size={16} aria-hidden="true" />
            <p>
              An exploration path, with room to change direction.
              <span>
                25–30 hours is a planning estimate, including pauses and
                readings; video runtime is unverified. This path is not a
                professional qualification.
              </span>
            </p>
            <span>MADE FOR YOUR CURIOSITY</span>
          </footer>
          <div className="sr-only" aria-live="polite">
            {notice}
          </div>
        </main>
      </div>
      {settingsOpen && (
        <BackupDialog
          progress={progress}
          onReplace={update}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </>
  );
}
