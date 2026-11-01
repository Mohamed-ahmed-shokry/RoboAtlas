import { useState } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import type { LearningResource, LearningSection } from "../data/roadmap";

export function ResourceLink({
  resource,
  onOpen,
}: {
  resource: LearningResource;
  onOpen?: () => void;
}) {
  return (
    <div className="section-resource">
      <a
        className="section-resource-link"
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={"Open " + resource.title + " in a new tab"}
        onClick={onOpen}
        onAuxClick={(event) => {
          if (event.button === 1) onOpen?.();
        }}
      >
        <span className="section-resource-title">
          {resource.title}
          <ArrowUpRight size={14} aria-hidden="true" />
        </span>
        <span className="section-resource-creator">{resource.creator}</span>
      </a>
      {resource.scope && <p className="section-scope">{resource.scope}</p>}
    </div>
  );
}

export function SectionRow({
  section,
  number,
  completed,
  highlighted,
  onToggle,
  onOpen,
}: {
  section: LearningSection;
  number: string;
  completed: boolean;
  highlighted: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const expanded = !completed || reviewOpen;
  const bodyId = "section-body-" + section.id;

  return (
    <article
      className={"learning-section" + (completed ? " is-complete" : "")}
      id={"section-" + section.id}
      tabIndex={-1}
      aria-labelledby={"section-heading-" + section.id}
      data-highlighted={highlighted}
      data-collapsed={!expanded}
    >
      <div className="section-heading">
        <label className="section-completion">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => {
              setReviewOpen(false);
              onToggle();
            }}
            aria-label={"Complete section " + number + ": " + section.title}
          />
        </label>
        <h4 id={"section-heading-" + section.id}>
          <span className="section-number">{number}</span>{" "}
          <span className="section-title">{section.title}</span>
        </h4>
        {completed && (
          <button
            type="button"
            className="icon-button section-details-toggle"
            aria-label={
              (expanded ? "Collapse" : "Expand") +
              " section " +
              number +
              ": " +
              section.title
            }
            aria-expanded={expanded}
            aria-controls={bodyId}
            title={expanded ? "Hide details" : "Show details"}
            onClick={() => setReviewOpen((previous) => !previous)}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="section-body" id={bodyId} hidden={!expanded}>
        {section.resources.map((resource) => (
          <ResourceLink key={resource.id} resource={resource} onOpen={onOpen} />
        ))}
        {section.scope && <p className="section-scope">{section.scope}</p>}
        {section.task && <p className="section-task">{section.task}</p>}
      </div>
    </article>
  );
}
