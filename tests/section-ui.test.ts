import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ResourceLink, SectionRow } from "../src/components/SectionRow";
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
  it("renders the assigned video time without changing companion links", () => {
    const html = renderToStaticMarkup(createElement(ResourceLink, {
      resource: {
        ...section.resources[0],
        url: "https://www.youtube.com/watch?v=example",
        startSeconds: 1136,
      },
    }));
    expect(html).toContain('href="https://www.youtube.com/watch?v=example&amp;t=1136s"');
    expect(html).toContain('target="_blank"');
    const companion = renderToStaticMarkup(createElement(ResourceLink, {
      resource: section.resources[1],
    }));
    expect(companion).toContain('href="https://example.com/reading"');
    expect(companion).not.toContain("?t=");
  });

  it("counts a multi-resource section once and keeps resource links separate", () => {
    const html = renderToStaticMarkup(
      createElement(SectionRow, {
        section,
        number: "1.1",
        completed: false,
        current: true,
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
    expect(html).toContain('aria-current="step"');
    expect(html).not.toContain('hidden=""');
    expect(html).not.toContain('class="section-details-toggle"');
  });

  it.each([false, true])(
    "starts a non-current section collapsed, completed=%s, with a separate details control",
    (completed) => {
      const html = renderToStaticMarkup(
        createElement(SectionRow, {
          section,
          number: "1.2",
          completed,
          current: false,
          onToggle: () => {},
          onOpen: () => {},
        }),
      );
      expect(html).toContain('data-collapsed="true"');
      expect(html).toContain('hidden=""');
      expect(html).toContain('aria-expanded="false"');
      expect(html).toContain('aria-controls="section-body-example-section"');
      expect(html).toContain(
        'aria-label="Expand section 1.2: Inspect a feedback loop"',
      );
      expect(html).not.toContain('aria-current="step"');
      expect(html.match(/type="checkbox"/g)).toHaveLength(1);
      const heading = html.match(/<h4\b[^>]*>([\s\S]*?)<\/h4>/)?.[1];
      expect(heading).toMatch(/^<button\b/);
      expect(heading).toContain('class="section-number">1.2</span>');
      expect(heading).toContain(section.title);
      expect(heading).not.toContain('type="checkbox"');
      expect(html.match(/<button\b/g)).toHaveLength(1);
    },
  );

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
        currentSectionId: section.id,
        onExpand: () => {},
        onToggle: () => {},
        onOpen: () => {},
      }),
    );
    expect(html).toContain("1 of 2 sections complete");
    expect(html).toContain('class="section-number">2.2</span>');
    expect(html).toContain('data-current="true"');
    expect(html).not.toContain("First section");
    expect(html.match(/type="checkbox"/g)).toHaveLength(1);
  });
});
