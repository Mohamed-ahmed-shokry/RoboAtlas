import { ArrowUpRight } from "lucide-react";
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
  return (
    <article
      className={"learning-section" + (completed ? " is-complete" : "")}
      id={"section-" + section.id}
      tabIndex={-1}
      aria-labelledby={"section-heading-" + section.id}
      data-highlighted={highlighted}
    >
      <div className="section-heading">
        <label className="section-completion">
          <input
            type="checkbox"
            checked={completed}
            onChange={onToggle}
            aria-label={"Complete section " + number + ": " + section.title}
          />
        </label>
        <h4 id={"section-heading-" + section.id}>
          <span className="section-number">{number}</span>{" "}
          {section.title}
        </h4>
      </div>
      <div className="section-body">
        {section.resources.map((resource) => (
          <ResourceLink key={resource.id} resource={resource} onOpen={onOpen} />
        ))}
        {section.scope && <p className="section-scope">{section.scope}</p>}
        {section.task && <p className="section-task">{section.task}</p>}
      </div>
    </article>
  );
}
