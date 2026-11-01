import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SectionRow } from "../src/components/SectionRow";
import { RoadmapStage } from "../src/components/RoadmapStage";
import type {
  LearningSection,
  RoadmapStage as Stage,
} from "../src/data/roadmap";

const section: LearningSection = {
  id: "example-section",
  title: "Inspect a feedback loop",
  resources: [
    {
      id: "example-video",
      title: "Feedback video",
      creator: "Example lecturer",
      url: "https://example.com/video",
      label: "Technical",
    },
    {
      id: "example-reading",
      title: "Companion reading",
      creator: "Example author",
      url: "https://example.com/reading",
      label: "Technical",
    },
  ],
  scope: "Study the feedback example.",
  task: "Sketch the sensor-to-action loop.",
};

describe("section-based interface", () => {
  it("counts a multi-resource section once and keeps resource links separate", () => {
    const html = renderToStaticMarkup(
      createElement(SectionRow, {
        section,
        number: "1.1",
        completed: false,
        highlighted: false,
        onToggle: () => {},
        onOpen: () => {},
      }),
    );
    expect(html.match(/type="checkbox"/g)).toHaveLength(1);
    expect(html.match(/target="_blank"/g)).toHaveLength(2);
    expect(html.match(/rel="noopener noreferrer"/g)).toHaveLength(2);
    expect(html).toContain("Example lecturer");
    expect(html).toContain("Example author");
    expect(html).toContain(section.scope);
    expect(html).toContain(section.task);
    expect(html).not.toContain("textarea");
    expect(html).not.toContain("Enough depth");
  });

  it("keeps stage totals and original numbering when a filter shows one section", () => {
    const first = { ...section, id: "example-first", title: "First section" };
    const stage: Stage = {
      id: "example-stage",
      title: "Example stage",
      shortTitle: "Example",
      topicGroupId: "example",
      sections: [first, section],
    };
    const html = renderToStaticMarkup(
      createElement(RoadmapStage, {
        stage,
        number: 2,
        sections: [section],
        expanded: true,
        completed: [first.id],
        highlighted: section.id,
        onExpand: () => {},
        onToggle: () => {},
        onOpen: () => {},
      }),
    );
    expect(html).toContain("1 of 2 sections complete");
    expect(html).toContain('class="section-number">2.2</span>');
    expect(html).toContain('data-highlighted="true"');
    expect(html).not.toContain("First section");
    expect(html.match(/type="checkbox"/g)).toHaveLength(1);
  });
});
