import { useState } from "react";
import { Check, ChevronDown, Lightbulb, PenLine } from "lucide-react";
import type { Stage } from "../data/curriculum";
import { countProgress } from "../lib/progress";
import type { Filters } from "../lib/progress";
import { ResourceGroup } from "./ResourceGroup";

interface Props {
  stage: Stage;
  number: number;
  expanded: boolean;
  completed: string[];
  note: string;
  filters: Filters;
  highlighted: string | null;
  onExpand: () => void;
  onToggle: (ids: string[]) => void;
  onOpen: (id: string) => void;
  onNote: (note: string) => void;
}

export function StageSection({
  stage,
  number,
  expanded,
  completed,
  note,
  filters,
  highlighted,
  onExpand,
  onToggle,
  onOpen,
  onNote,
}: Props) {
  const [notesOpen, setNotesOpen] = useState(Boolean(note));
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
          <div className="enough-depth">
            <Lightbulb size={16} aria-hidden="true" />
            <p>
              <strong>Enough depth</strong>
              {stage.enough}
            </p>
          </div>
          <div className="stage-note">
            <button
              className="note-toggle"
              onClick={() => setNotesOpen(!notesOpen)}
              aria-expanded={notesOpen}
              aria-controls={`note-area-${stage.id}`}
            >
              <PenLine size={14} aria-hidden="true" />
              {note ? "Your stage note" : "Add a personal note"}
              <span>Optional</span>
            </button>
            {notesOpen && (
              <div id={`note-area-${stage.id}`} className="note-area">
                <label htmlFor={`note-${stage.id}`}>
                  Interesting / unclear / want to try
                </label>
                <textarea
                  id={`note-${stage.id}`}
                  value={note}
                  maxLength={20000}
                  rows={3}
                  placeholder="A question, an idea, a robot you want to build…"
                  onChange={(event) => onNote(event.target.value)}
                />
                <span className="note-hint">
                  Plain text · saved with your progress
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
