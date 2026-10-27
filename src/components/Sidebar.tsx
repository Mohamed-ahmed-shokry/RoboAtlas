import { Check, HardDrive, Route } from "lucide-react";
import { curriculum } from "../data/curriculum";
import { countProgress } from "../lib/progress";

interface Props {
  completed: string[];
  active: string;
  onNavigate: (id: string) => void;
  storageWarning: boolean;
}

export function Sidebar({
  completed,
  active,
  onNavigate,
  storageWarning,
}: Props) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#main">
        <Route size={23} aria-hidden="true" />
        <span>RoboAtlas</span>
      </a>
      <div className="nav-heading">
        Roadmap<span>{curriculum.length} stages</span>
      </div>
      <nav aria-label="Roadmap stages">
        {curriculum.map((stage, index) => {
          const { count, total } = countProgress(
            stage.resources.flatMap((resource) =>
              resource.units.map((unit) => unit.id),
            ),
            completed,
          );
          return (
            <button
              key={stage.id}
              className={`nav-stage ${stage.id === active ? "active" : ""}`}
              onClick={() => onNavigate(stage.id)}
              aria-current={stage.id === active ? "step" : undefined}
              aria-label={`Stage ${index + 1}: ${stage.title}, ${count} of ${total} complete`}
            >
              <span className="nav-number">
                {count === total ? (
                  <Check size={13} aria-label="Complete" />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </span>
              <span>{stage.shortTitle}</span>
              {count > 0 && count < total && (
                <span className="nav-partial" aria-label="In progress">
                  {count}/{total}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="mobile-stage-nav">
        <label className="sr-only" htmlFor="jump-stage">
          Jump to a stage
        </label>
        <select
          id="jump-stage"
          value={active}
          onChange={(event) => onNavigate(event.target.value)}
        >
          {curriculum.map((stage, index) => (
            <option key={stage.id} value={stage.id}>
              {String(index + 1).padStart(2, "0")} · {stage.shortTitle}
            </option>
          ))}
        </select>
      </div>
      <p className="local-status">
        <HardDrive size={13} aria-hidden="true" />
        {storageWarning ? "Storage needs attention" : "Saved in this browser"}
      </p>
    </aside>
  );
}
