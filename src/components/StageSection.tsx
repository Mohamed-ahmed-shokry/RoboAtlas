import { Check, ChevronDown } from "lucide-react";
import type { Stage } from "../data/curriculum";
import { countProgress } from "../lib/progress";
import type { Filters } from "../lib/progress";
import { ResourceGroup } from "./ResourceGroup";

interface Props {
  stage: Stage;
  number: number;
  expanded: boolean;
  completed: string[];
  filters: Filters;
  highlighted: string | null;
  onExpand: () => void;
  onToggle: (ids: string[]) => void;
  onOpen: (id: string) => void;
}

export function StageSection({
  stage,
  number,
  expanded,
  completed,
  filters,
  highlighted,
  onExpand,
  onToggle,
  onOpen,
}: Props) {
  const progress = countProgress(
    stage.resources.flatMap((resource) =>
      resource.units.map((unit) => unit.id),
    ),
    completed,
  );
  const done = progress.count === progress.total;

  return (
    <section
      className={`stage-section ${expanded ? "expanded" : ""}`}
      id={`stage-${stage.id}`}
      aria-labelledby={`heading-${stage.id}`}
    >
      <h3 id={`heading-${stage.id}`}>
        <button
          className="stage-toggle"
          onClick={onExpand}
          aria-expanded={expanded}
          aria-controls={`content-${stage.id}`}
        >
          <span className={`stage-number ${done ? "done" : ""}`}>
            {done ? (
              <Check size={19} aria-label="Complete" />
            ) : (
              String(number).padStart(2, "0")
            )}
          </span>
          <span className="stage-title-block">
            <span className="stage-title">{stage.title}</span>
            <span className="stage-description">{stage.learn}</span>
          </span>
          <span className="stage-completion">
            <span>
              {progress.count}
              <span className="muted"> / {progress.total}</span>
            </span>
            <span className="mini-progress">
              <span style={{ width: `${progress.percent}%` }} />
            </span>
          </span>
          <ChevronDown className="stage-chevron" size={17} aria-hidden="true" />
        </button>
      </h3>
      {expanded && (
        <div className="stage-content" id={`content-${stage.id}`}>
          <div className="resources">
            {stage.resources.map((resource) => (
              <ResourceGroup
                key={resource.id}
                resource={resource}
                completed={completed}
                filters={filters}
                highlighted={highlighted}
                onToggle={onToggle}
                onOpen={onOpen}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
