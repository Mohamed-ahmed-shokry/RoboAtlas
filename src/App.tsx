import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  DatabaseBackup,
  ListFilter,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
  X,
} from "lucide-react";
import { coreSections, optionalResources, roadmap } from "./data/roadmap";
import type { ContentLabel } from "./legacy/curriculum";
import {
  continueLearning,
  countProgress,
  matchesSection,
  toggleSections,
} from "./lib/progress";
import type { CompletionFilter, Filters } from "./lib/progress";
import { useProgress } from "./lib/useProgress";
import { Sidebar } from "./components/Sidebar";
import { RoadmapStage } from "./components/RoadmapStage";
import { ResourceLink } from "./components/SectionRow";
import { BackupDialog } from "./components/BackupDialog";

const emptyFilters: Filters = { query: "", completion: "all", label: "all" };
const labels: ContentLabel[] = [
  "Technical",
  "Build",
  "Application",
  "Discussion",
];
const sectionIds = coreSections.map(({ section }) => section.id);

export default function App() {
  const { progress, update, replace, warning } = useProgress();
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [active, setActive] = useState(
    () => continueLearning(progress)?.stage.id ?? roadmap[0].id,
  );
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const overall = countProgress(sectionIds, progress.completed);
  const next = continueLearning(progress);
  const filtering =
    filters.query.trim() !== "" ||
    filters.completion !== "all" ||
    filters.label !== "all";
  const visible = coreSections.filter(({ section }) =>
    matchesSection(section, filters, progress.completed),
  );
  const visibleIds = new Set(visible.map(({ section }) => section.id));

  function reveal(stageId: string, sectionId?: string) {
    setFilters(emptyFilters);
    setActive(stageId);
    setHighlighted(sectionId ?? null);
    update((previous) => ({
      ...previous,
      expanded: [...new Set([...previous.expanded, stageId])],
    }));
    if (filtering)
      setNotice("Filters cleared to reveal your place in the full roadmap.");
    requestAnimationFrame(() => {
      const target = document.getElementById(
        sectionId ? "section-" + sectionId : "stage-" + stageId,
      );
      target?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "center",
      });
      if (sectionId) target?.focus({ preventScroll: true });
    });
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
        collapsed={sidebarCollapsed}
      />
      <div
        className={
          "app-body section-dashboard" +
          (sidebarCollapsed ? " sidebar-collapsed" : "")
        }
      >
        <header className="topbar">
          <button
            className="icon-button sidebar-toggle"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!sidebarCollapsed}
            aria-controls="roadmap-sidebar"
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={18} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={18} aria-hidden="true" />
            )}
          </button>
          <div className="topbar-actions">
            <button
              className="icon-button"
              onClick={() =>
                update((previous) => ({
                  ...previous,
                  theme: previous.theme === "dark" ? "light" : "dark",
                }))
              }
              aria-label={
                "Switch to " +
                (progress.theme === "dark" ? "light" : "dark") +
                " theme"
              }
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
          <div className="roadmap-summary">
            <div className="page-heading">
              <h1>Your robotics roadmap</h1>
            </div>
            <section className="progress-summary" aria-label="Overall progress">
              <span className="progress-count">
                <strong>{overall.count}</strong> / {overall.total} sections
              </span>
              <progress
                value={overall.count}
                max={overall.total}
                aria-label="Overall completion"
              />
              <span className="progress-percent">{overall.percent}%</span>
            </section>
          </div>
          <section className="continue-card" aria-label="Continue learning">
            <div className="continue-info">
              <span className="card-eyebrow">
                {next
                  ? "UP NEXT · " + next.stageNumber + "." + next.sectionNumber
                  : "ALL CORE SECTIONS COMPLETE"}
              </span>
              <h2>{next ? next.section.title : "Roadmap complete"}</h2>
            </div>
            <div className="continue-actions">
              <button
                className="primary-button"
                onClick={() =>
                  next
                    ? reveal(next.stage.id, next.section.id)
                    : reveal(roadmap[0].id)
                }
              >
                {next ? "Continue learning" : "Review the roadmap"}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
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
              <h2 className="sr-only">Roadmap</h2>
              <span className="stage-total">{roadmap.length} stages</span>
            </div>
            <button
              className="text-button"
              onClick={() => {
                if (filtering) setFilters(emptyFilters);
                update((previous) => ({
                  ...previous,
                  expanded:
                    !filtering && previous.expanded.length === roadmap.length
                      ? []
                      : roadmap.map((stage) => stage.id),
                }));
              }}
            >
              {!filtering && progress.expanded.length === roadmap.length
                ? "Collapse all"
                : "Expand all"}
              <ChevronDown size={14} aria-hidden="true" />
            </button>
          </div>
          <div className="filter-bar">
            <div className="search-field">
              <Search size={16} aria-hidden="true" />
              <label className="sr-only" htmlFor="roadmap-search">
                Search sections, resources, and creators
              </label>
              <input
                id="roadmap-search"
                type="search"
                placeholder="Search sections, resources, creators…"
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
                  {visible.length} of {overall.total} sections match · Overall
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
            {roadmap.map((stage, index) => {
              const sections = stage.sections.filter((section) =>
                visibleIds.has(section.id),
              );
              const stageComplete = stage.sections.every((section) =>
                progress.completed.includes(section.id),
              );
              const expanded =
                progress.expanded.includes(stage.id) ||
                (filtering && !stageComplete);
              return (
                sections.length > 0 && (
                  <RoadmapStage
                    key={stage.id}
                    stage={stage}
                    number={index + 1}
                    sections={sections}
                    expanded={expanded}
                    completed={progress.completed}
                    highlighted={highlighted}
                    onExpand={() => {
                      if (filtering) {
                        setFilters(emptyFilters);
                        setNotice("Filters cleared. Stage expansion is saved.");
                      }
                      setActive(stage.id);
                      update((previous) => ({
                        ...previous,
                        expanded: expanded
                          ? previous.expanded.filter((id) => id !== stage.id)
                          : [...previous.expanded, stage.id],
                      }));
                    }}
                    onToggle={(id) => {
                      const finishingStage =
                        !progress.completed.includes(id) &&
                        stage.sections.every(
                          (section) =>
                            section.id === id ||
                            progress.completed.includes(section.id),
                        );
                      update((previous) => toggleSections(previous, [id]));
                      if (finishingStage) {
                        requestAnimationFrame(() => {
                          const stageButton = document
                            .getElementById("heading-" + stage.id)
                            ?.querySelector<HTMLButtonElement>("button");
                          (
                            stageButton ??
                            document.getElementById("roadmap-search")
                          )?.focus();
                        });
                      }
                    }}
                    onOpen={(id) =>
                      update((previous) => ({ ...previous, lastOpened: id }))
                    }
                  />
                )
              );
            })}
          </div>
          {!visible.length && (
            <div className="empty-state">
              <Search size={28} aria-hidden="true" />
              <h3>No sections match these filters.</h3>
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
          <details className="optional-resources">
            <summary>
              Optional resources<span>{optionalResources.length}</span>
            </summary>
            <div className="optional-resource-list">
              {optionalResources.map((resource) => (
                <ResourceLink key={resource.id} resource={resource} />
              ))}
            </div>
          </details>
          <div className="sr-only" aria-live="polite">
            {notice}
          </div>
        </main>
      </div>
      {settingsOpen && (
        <BackupDialog
          progress={progress}
          onReplace={replace}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </>
  );
}
