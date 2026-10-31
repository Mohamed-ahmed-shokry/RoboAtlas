import { ArrowUpRight, BookOpen, Layers3, Play, Video } from "lucide-react";
import type { Resource } from "../data/curriculum";
import { countProgress, matchesUnit } from "../lib/progress";
import type { Filters } from "../lib/progress";

interface Props {
  resource: Resource;
  completed: string[];
  filters: Filters;
  highlighted: string | null;
  onToggle: (ids: string[]) => void;
  onOpen: (id: string) => void;
}

export function ResourceGroup({
  resource,
  completed,
  filters,
  highlighted,
  onToggle,
  onOpen,
}: Props) {
  const ids = resource.units.map((unit) => unit.id);
  const { count, total } = countProgress(ids, completed);
  const grouped = total > 1;
  const visible = resource.units.filter((unit) =>
    matchesUnit(resource, unit.title, unit.id, filters, completed),
  );
  if (!visible.length) return null;
  const partial = count > 0 && count < total;
  const next =
    resource.units.find((unit) => !completed.includes(unit.id)) ??
    resource.units[0];
  const Icon =
    resource.format === "Reading"
      ? BookOpen
      : resource.format === "Playlist selection"
        ? Layers3
        : resource.format === "Mixed resource"
          ? Video
          : Play;

  return (
    <article
      className={`resource ${count === total ? "is-complete" : ""}`}
      aria-labelledby={`resource-${resource.id}`}
    >
      <div className="resource-top">
        <input
          className="completion-checkbox"
          type="checkbox"
          aria-label={
            grouped
              ? `Complete all ${total} assigned lessons in ${resource.title}`
              : `Complete ${resource.units[0].title}`
          }
          checked={count === total}
          ref={(node) => {
            if (node) node.indeterminate = partial;
          }}
          onChange={() => onToggle(ids)}
        />
        <div
          className="resource-info"
          id={!grouped ? `unit-${next.id}` : undefined}
          tabIndex={-1}
          data-highlighted={highlighted === next.id}
        >
          <div className="resource-heading">
            <h4 id={`resource-${resource.id}`}>
              <a
                className="resource-title-link"
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${resource.title} in a new tab`}
                onClick={() => onOpen(next.id)}
                onAuxClick={(event) => {
                  if (event.button === 1) onOpen(next.id);
                }}
              >
                {resource.title}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </h4>
          </div>
          <div className="resource-meta">
            <span>{resource.creator}</span>
            <span className="meta-separator">·</span>
            <span className="format">
              <Icon size={12} aria-hidden="true" />
              {resource.format}
            </span>
            <span className={`tag tag-${resource.label.toLowerCase()}`}>
              {resource.label}
            </span>
            {grouped && (
              <span className="unit-count">
                {count}/{total} done
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="resource-body">
        {resource.selection && (
          <p className="selection">
            <span>YOUR SELECTION</span>
            {resource.selection}
          </p>
        )}
        {resource.context && (
          <p className="resource-context">{resource.context}</p>
        )}
        {grouped && (
          <div className="lesson-list">
            {visible.length < total && (
              <p className="filtered-lessons">
                Showing {visible.length} of {total} assigned lessons. The group
                checkbox toggles all {total}.
              </p>
            )}
            {visible.map((unit) => (
              <div
                key={unit.id}
                id={`unit-${unit.id}`}
                tabIndex={-1}
                className={`lesson ${completed.includes(unit.id) ? "is-complete" : ""}`}
                data-highlighted={highlighted === unit.id}
              >
                <label className="lesson-completion">
                  <input
                    type="checkbox"
                    checked={completed.includes(unit.id)}
                    onChange={() => onToggle([unit.id])}
                  />
                  <span className="sr-only">{unit.title}</span>
                </label>
                <a
                  className="lesson-link"
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${unit.title} in a new tab`}
                  onClick={() => onOpen(unit.id)}
                  onAuxClick={(event) => {
                    if (event.button === 1) onOpen(unit.id);
                  }}
                >
                  <span>{unit.title}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
