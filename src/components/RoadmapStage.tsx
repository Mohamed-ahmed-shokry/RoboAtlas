import { ChevronDown } from "lucide-react";
import type { LearningSection, RoadmapStage as Stage } from "../data/roadmap";
import { countProgress } from "../lib/progress";
import { SectionRow } from "./SectionRow";

export function RoadmapStage({
  stage,
  number,
  sections,
  expanded,
  searching = false,
  completed,
  currentSectionId,
  onExpand,
  onToggle,
  onOpen,
}: {
  stage: Stage;
  number: number;
  sections: LearningSection[];
  expanded: boolean;
  searching?: boolean;
  completed: string[];
  currentSectionId: string | null;
  onExpand: () => void;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const progress = countProgress(
    stage.sections.map((section) => section.id),
    completed,
  );
  return (
    <section
      className={"stage-section" + (expanded ? " expanded" : "")}
      id={"stage-" + stage.id}
      aria-labelledby={"heading-" + stage.id}
    >
      <h3 id={"heading-" + stage.id}>
        <button
          className="stage-toggle"
          onClick={onExpand}
          aria-expanded={expanded}
          aria-controls={"content-" + stage.id}
        >
          <span className="stage-number">
            {String(number).padStart(2, "0")}
          </span>
          <span className="stage-title-block">
            <span className="stage-title">{stage.title}</span>
          </span>
          <span
            className="stage-completion"
            aria-label={
              progress.count + " of " + progress.total + " sections complete"
            }
          >
            {progress.count}
            <span className="muted"> / {progress.total}</span>
          </span>
          <ChevronDown className="stage-chevron" size={16} aria-hidden="true" />
        </button>
      </h3>
      {expanded && (
        <div className="stage-content" id={"content-" + stage.id}>
          {sections.map((section) => (
            <SectionRow
              key={section.id}
              section={section}
              number={number + "." + (stage.sections.indexOf(section) + 1)}
              completed={completed.includes(section.id)}
              current={currentSectionId === section.id}
              searching={searching}
              onToggle={() => onToggle(section.id)}
              onOpen={() => onOpen(section.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
