import { describe, expect, it } from "vitest";
import { curriculum as legacyCurriculum } from "../src/legacy/curriculum";
import {
  coreSections,
  optionalResources,
  roadmap,
  sourceVerification,
  topicGroupIds,
  workloadEstimates,
} from "../src/data/roadmap";

const sections = coreSections.map(({ section }) => section);
const find = (id: string) => sections.find((section) => section.id === id)!;

describe("the updated exploration curriculum", () => {
  it("covers all thirteen topic groups in prerequisite order with bounded stages", () => {
    expect(roadmap).toHaveLength(27);
    expect(sections).toHaveLength(128);
    expect([...new Set(roadmap.map((stage) => stage.topicGroupId))]).toEqual([
      ...topicGroupIds,
    ]);
    expect(
      roadmap.every(
        (stage) => stage.sections.length > 0 && stage.sections.length <= 7,
      ),
    ).toBe(true);
    for (const stage of roadmap) {
      const estimates = stage.sections.map(
        (section) => workloadEstimates[section.id],
      );
      expect(estimates.every((minutes) => minutes > 0 && minutes < 60)).toBe(
        true,
      );
      expect(
        estimates.reduce((sum, minutes) => sum + minutes, 0),
      ).toBeLessThanOrEqual(420);
    }
  });

  it("uses unique explicit stage and section IDs and consistent reusable source metadata", () => {
    const ids = [
      ...roadmap.map((stage) => stage.id),
      ...sections.map((section) => section.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    const resources = new Map<string, string>();
    for (const section of sections) {
      expect(section.resources.length > 0 || Boolean(section.task)).toBe(true);
      expect(
        new Set(section.resources.map((resource) => resource.id)).size,
      ).toBe(section.resources.length);
      for (const resource of section.resources) {
        const metadata = JSON.stringify([
          resource.title,
          resource.creator,
          resource.url,
        ]);
        expect(resources.get(resource.id) ?? metadata).toBe(metadata);
        resources.set(resource.id, metadata);
        if (resource.url.startsWith("./")) {
          expect(resource.url).toBe("./feedback-control.py");
        } else {
          expect(new URL(resource.url).protocol).toBe("https:");
        }
      }
    }
  });

  it("preserves exact assigned playlist portions rather than assigning entire courses", () => {
    expect(
      [
        "pid-fundamentals",
        "pid-windup",
        "pid-noise",
        "pid-tuning",
        "pid-sampling",
      ].map((id) => find(id).scope?.match(/Part (\d)/)?.[1]),
    ).toEqual(["1", "2", "3", "4", "7"]);
    expect(find("mpc-concepts").scope).toContain("Parts 1 and 2 only");
    expect(find("kalman-observers").scope).toContain("Parts 1 and 2");
    expect(find("kalman-optimal-estimator").scope).toContain("Parts 3 and 4");
    expect(find("kalman-nonlinear").scope).toContain("Part 5");
    expect(find("ros2-rviz").scope).toContain("Stop before the advanced");
    expect(find("arm-episode-five").scope).toContain("Episode 5 only");
    expect(find("arm-episode-six").scope).toContain("Episode 6 only");
    expect(find("arm-episode-seven-record").scope).toContain("Episode 7");
    expect(find("arm-episode-seven-deploy").scope).toContain("Episode 7");
    expect(find("walking-rl-problem").scope).toContain("Part 4");
    expect(find("rl-practical-challenges").scope).toContain("Part 5");
  });

  it("keeps practical anchors concrete and prevents added work from receiving old completion", () => {
    expect(find("scalar-feedback-simulation").resources[0].url).toBe(
      "./feedback-control.py",
    );
    expect(find("feedback-gain-comparison").task).toContain("0.5 and 2");
    expect(find("nav2-prepare-example").scope).toContain("Gazebo Harmonic");
    expect(
      find("nav2-launch-example").resources.some(
        (resource) => resource.id === "nav2-jazzy-quickstart",
      ),
    ).toBe(true);
    expect(
      find("aloha-episode-zero").resources.some((resource) =>
        resource.url.includes("episode_0"),
      ),
    ).toBe(true);
    expect(
      find("sensor-pose-change").resources.some((resource) =>
        resource.url.endsWith("01-myfirst.urdf"),
      ),
    ).toBe(true);
    expect(find("ros2-environment-readiness").task).toContain(
      "first unmet prerequisite",
    );
    expect(find("aloha-labeled-failure").legacyUnitIds).toBeUndefined();
    expect(find("agile-flight-method").legacyUnitIds).toBeUndefined();
    expect(
      sections
        .filter((section) => section.task)
        .every((section) => !section.legacyUnitIds?.length),
    ).toBe(true);
    expect(sourceVerification.act).toContain("no creator chapters");
  });

  it("retains unmatched old resources without duplicating their assigned core portions", () => {
    const oldResources = legacyCurriculum.flatMap((stage) => stage.resources);
    expect(optionalResources.length).toBeGreaterThan(0);
    expect(new Set(optionalResources.map((resource) => resource.id)).size).toBe(
      optionalResources.length,
    );
    expect(
      optionalResources.find(
        (resource) => resource.id === "optional-fusion-pose",
      )?.scope,
    ).toBe("Part 3: Fusing a GPS and IMU to Estimate Pose.");
    for (const resource of optionalResources.filter(
      (resource) => resource.id !== "optional-fusion-pose",
    )) {
      expect(oldResources.some((old) => old.id === resource.id)).toBe(true);
      expect(
        sections.some((section) =>
          section.resources.some((core) => core.id === resource.id),
        ),
      ).toBe(false);
    }
  });
});
