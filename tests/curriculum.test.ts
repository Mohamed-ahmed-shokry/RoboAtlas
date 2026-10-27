import { describe, expect, it } from 'vitest'
import { curriculum, learningUnits } from '../src/data/curriculum'

describe('the supplied roadmap', () => {
  it('has ten ordered stages with exactly the expected 60 units', () => {
    expect(curriculum.map(stage => stage.id)).toEqual(['robot-systems', 'hardware-embedded', 'geometry-kinematics', 'dynamics-control', 'robot-perception', 'estimation-slam', 'planning-applications', 'robot-learning', 'physical-ai', 'explore-directions'])
    expect(curriculum.map(stage => stage.resources.reduce((n, resource) => n + resource.units.length, 0))).toEqual([3, 3, 9, 8, 6, 7, 5, 8, 6, 5])
    expect(learningUnits).toHaveLength(60)
    expect(curriculum.flatMap(stage => stage.resources)).toHaveLength(37)
  })
  it('uses unique stable IDs and secure supplied external links', () => {
    const stages = curriculum.map(stage => stage.id)
    const resources = curriculum.flatMap(stage => stage.resources.map(resource => resource.id))
    const units = learningUnits.map(item => item.unit.id)
    expect(new Set([...stages, ...resources, ...units]).size).toBe(stages.length + resources.length + units.length)
    expect(learningUnits.every(item => new URL(item.resource.url).protocol === 'https:')).toBe(true)
  })
  it('preserves specific selections and separate repeated navigation lessons', () => {
    const groups = curriculum.flatMap(stage => stage.resources)
    expect(groups.find(r => r.id === 'pid-control')?.units.map(u => u.id)).toEqual(['pid-part-one', 'pid-part-two', 'pid-part-three', 'pid-part-four', 'pid-part-seven'])
    const estimation = groups.find(r => r.id === 'navigation-estimation')!
    const planning = groups.find(r => r.id === 'navigation-planning')!
    expect(estimation.url).toBe(planning.url)
    expect(new Set([...estimation.units, ...planning.units].map(u => u.id)).size).toBe(5)
    expect(groups.find(r => r.id === 'begin-robotics')?.units).toHaveLength(1)
    expect(groups.find(r => r.id === 'gemini-robotics')?.units).toHaveLength(1)
  })
})
