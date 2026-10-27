import { describe, expect, it } from 'vitest'
import { curriculum, learningUnits } from '../src/data/curriculum'
import { continueLearning, countProgress, defaultProgress, exportBackup, importBackup, loadProgress, matchesUnit, saveProgress, STORAGE_KEY, toggleUnits, validateProgress } from '../src/lib/progress'

describe('completion and continuing', () => {
  it('counts units, handles partial groups, toggles all, and unchecks all', () => {
    const ids = curriculum[2].resources[0].units.map(unit => unit.id)
    let state = toggleUnits(defaultProgress(), [ids[0]])
    expect(countProgress(ids, state.completed)).toEqual({ count: 1, total: 3, percent: 33 })
    state = toggleUnits(state, ids)
    expect(countProgress(ids, state.completed).count).toBe(3)
    expect(toggleUnits(state, ids).completed).toEqual([])
  })
  it('remembers an intentionally later lesson without completing earlier lessons', () => {
    const state = { ...defaultProgress(), lastOpened: 'rl-part-three' }
    expect(continueLearning(state)?.unit.id).toBe('rl-part-three')
    expect(state.completed).toEqual([])
  })
  it('falls back to earliest unfinished if recent is complete or missing', () => {
    const state = { ...defaultProgress(), completed: ['hoop-build', 'rl-part-three'], lastOpened: 'rl-part-three' }
    expect(continueLearning(state)?.unit.id).toBe('princeton-lecture-one')
    expect(continueLearning({ ...state, lastOpened: 'removed-lesson' })?.unit.id).toBe('princeton-lecture-one')
  })
  it('supports all-complete and safe unknown unit IDs', () => {
    const completed = learningUnits.map(item => item.unit.id)
    expect(continueLearning({ ...defaultProgress(), completed })).toBeNull()
    expect(countProgress(completed, completed).percent).toBe(100)
    expect(toggleUnits(defaultProgress(), ['not-a-lesson']).completed).toEqual([])
  })
  it('keeps completion independent for different parts of the same playlist', () => {
    const state = toggleUnits(defaultProgress(), ['navigation-particle-filter'])
    expect(state.completed).not.toContain('navigation-path-planning')
  })
})

describe('storage and backup safety', () => {
  it('round-trips progress, plain text notes, last-opened and preferences through storage', () => {
    const state = { ...defaultProgress(), completed: ['hoop-build'], notes: { 'robot-systems': '<b>Interesting / unclear / want to try</b>' }, lastOpened: 'pid-part-seven', theme: 'light' as const, expanded: ['dynamics-control'] }
    const values = new Map<string, string>()
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
    expect(saveProgress(storage, state)).toBeNull()
    expect(values.has(STORAGE_KEY)).toBe(true)
    expect(loadProgress(storage).state).toEqual(state)
    expect(importBackup(exportBackup(state))).toEqual(state)
  })
  it('recovers from missing, malformed, unsupported, or blocked saved data', () => {
    expect(loadProgress({ getItem: () => null }).state).toEqual(defaultProgress())
    for (const input of ['broken', 'null', '[]', '{"version":2}', '{"version":1,"completed":42}']) {
      expect(loadProgress({ getItem: () => input }).warning).toBeTruthy()
    }
    expect(loadProgress({ getItem: () => { throw new Error('blocked') } }).warning).toBeTruthy()
    expect(saveProgress({ setItem: () => { throw new Error('quota') } }, defaultProgress())).toMatch(/Export a backup/)
  })
  it('drops unknown IDs and deduplicates without losing known progress', () => {
    const state = validateProgress({ ...defaultProgress(), completed: ['hoop-build', 'removed', 'hoop-build'], notes: { 'robot-systems': 'keep', removed: 'ignore' }, expanded: ['removed', 'robot-systems', 'robot-systems'], lastOpened: 'removed' })
    expect(state.completed).toEqual(['hoop-build'])
    expect(state.notes).toEqual({ 'robot-systems': 'keep' })
    expect(state.expanded).toEqual(['robot-systems'])
    expect(state.lastOpened).toBeNull()
  })
  it('rejects invalid imports completely without changing existing progress', () => {
    const existing = { ...defaultProgress(), completed: ['hoop-build'] }
    for (const input of ['no', '{}', 'null', JSON.stringify({ app: 'RoboAtlas', progress: { ...existing, notes: { 'robot-systems': 3 } } }), JSON.stringify({ app: 'RoboAtlas', progress: { ...existing, completed: ['hoop-build', 4] } })]) {
      expect(() => importBackup(input)).toThrow()
      expect(existing.completed).toEqual(['hoop-build'])
    }
    expect(() => importBackup('x'.repeat(1_000_001))).toThrow(/too large/)
    expect(() => validateProgress({ ...existing, notes: { 'robot-systems': 'x'.repeat(20001) } })).toThrow(/20,000/)
  })
})

describe('search and filters', () => {
  it('searches creators, resource titles and selected lesson names', () => {
    const item = learningUnits.find(item => item.unit.id === 'rotation-matrices-two')!
    for (const query of ['northwestern', 'modern robotics', 'Rotation Matrices, Part 2']) {
      expect(matchesUnit(item.resource, item.unit.title, item.unit.id, { query, completion: 'all', label: 'all' }, [])).toBe(true)
    }
    expect(matchesUnit(item.resource, item.unit.title, item.unit.id, { query: 'missing', completion: 'all', label: 'all' }, [])).toBe(false)
  })
  it('combines filters without altering global progress or Continue learning', () => {
    const state = { ...defaultProgress(), completed: ['hoop-build'] }
    const filters = { query: '', completion: 'unfinished' as const, label: 'Build' as const }
    const visible = learningUnits.filter(item => matchesUnit(item.resource, item.unit.title, item.unit.id, filters, state.completed))
    expect(visible).toHaveLength(3)
    expect(countProgress(learningUnits.map(item => item.unit.id), state.completed).total).toBe(60)
    expect(continueLearning(state)?.unit.id).toBe('princeton-lecture-one')
  })
})
