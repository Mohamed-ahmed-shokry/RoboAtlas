import { learningUnits, stageIds, unitIds } from '../data/curriculum'
import type { ContentLabel, Resource } from '../data/curriculum'

export const STORAGE_KEY = 'roboatlas.progress.v1'
export interface ProgressState {
  version: 1
  completed: string[]
  notes: Record<string, string>
  lastOpened: string | null
  expanded: string[]
  theme: 'dark' | 'light'
}
export type StorageReader = Pick<Storage, 'getItem'>
export type StorageWriter = Pick<Storage, 'setItem'>
export type CompletionFilter = 'all' | 'unfinished' | 'completed'
export interface Filters { query: string; completion: CompletionFilter; label: ContentLabel | 'all' }

export function defaultProgress(): ProgressState {
  return { version: 1, completed: [], notes: {}, lastOpened: null, expanded: ['robot-systems'], theme: 'dark' }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length <= 10000 && value.every(item => typeof item === 'string')
}

/** Validate the entire payload before changing state. Unknown stable IDs are safely ignored. */
export function validateProgress(value: unknown): ProgressState {
  if (!isRecord(value) || value.version !== 1 || !stringArray(value.completed) ||
      !stringArray(value.expanded) || !isRecord(value.notes) ||
      !(value.lastOpened === null || typeof value.lastOpened === 'string') ||
      !['dark', 'light'].includes(String(value.theme))) {
    throw new Error('This is not a supported RoboAtlas progress file (version 1).')
  }
  const notes: Record<string, string> = {}
  for (const [id, note] of Object.entries(value.notes)) {
    if (typeof note !== 'string' || note.length > 20000) {
      throw new Error('Stage notes must be plain text, up to 20,000 characters each.')
    }
    if (stageIds.has(id)) notes[id] = note
  }
  return {
    version: 1,
    completed: [...new Set(value.completed.filter(id => unitIds.has(id)))],
    notes,
    lastOpened: typeof value.lastOpened === 'string' && unitIds.has(value.lastOpened) ? value.lastOpened : null,
    expanded: [...new Set(value.expanded.filter(id => stageIds.has(id)))],
    theme: value.theme as ProgressState['theme'],
  }
}

export function loadProgress(storage: StorageReader): { state: ProgressState; warning: string | null } {
  try {
    const saved = storage.getItem(STORAGE_KEY)
    return { state: saved ? validateProgress(JSON.parse(saved)) : defaultProgress(), warning: null }
  } catch {
    return { state: defaultProgress(), warning: 'Saved progress could not be read. You can still learn here; import a backup or export before making changes. Browser storage may be unavailable.' }
  }
}

export function saveProgress(storage: StorageWriter, state: ProgressState): string | null {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
    return null
  } catch {
    return 'Your changes are in this tab, but could not be saved to browser storage. Export a backup before closing.'
  }
}

export function countProgress(ids: string[], completed: readonly string[]) {
  const done = new Set(completed)
  const count = ids.filter(id => done.has(id)).length
  return { count, total: ids.length, percent: ids.length ? Math.round(count / ids.length * 100) : 0 }
}

export function toggleUnits(state: ProgressState, ids: string[]): ProgressState {
  const done = new Set(state.completed)
  const known = ids.filter(id => unitIds.has(id))
  const allDone = known.every(id => done.has(id))
  for (const id of known) { if (allDone) done.delete(id); else done.add(id) }
  return { ...state, completed: [...done] }
}

export function continueLearning(state: ProgressState) {
  const done = new Set(state.completed)
  const recent = learningUnits.find(item => item.unit.id === state.lastOpened && !done.has(item.unit.id))
  return recent ?? learningUnits.find(item => !done.has(item.unit.id)) ?? null
}

export function matchesUnit(resource: Resource, title: string, id: string, filters: Filters, completed: readonly string[]) {
  const text = [resource.title, resource.creator, resource.selection ?? '', title].join(' ').toLocaleLowerCase()
  const query = filters.query.trim().toLocaleLowerCase()
  const done = completed.includes(id)
  return (!query || text.includes(query)) &&
    (filters.label === 'all' || resource.label === filters.label) &&
    (filters.completion === 'all' || (filters.completion === 'completed' ? done : !done))
}

export function exportBackup(state: ProgressState): string {
  return JSON.stringify({ app: 'RoboAtlas', exportedAt: new Date().toISOString(), progress: state }, null, 2)
}

export function importBackup(text: string): ProgressState {
  if (text.length > 1_000_000) throw new Error('This file is too large. Choose a RoboAtlas progress backup under 1 MB.')
  let value: unknown
  try { value = JSON.parse(text) } catch { throw new Error('This file is not valid JSON. Choose a RoboAtlas progress backup.') }
  if (!isRecord(value) || value.app !== 'RoboAtlas') throw new Error('Choose a progress backup exported from RoboAtlas.')
  return validateProgress(value.progress)
}
