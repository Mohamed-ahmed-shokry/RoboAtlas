import { useEffect, useRef, useState } from 'react'
import { defaultProgress, loadProgress, saveProgress } from './progress'
import type { ProgressState } from './progress'

function readInitialProgress() {
  try { return loadProgress(window.localStorage) }
  catch { return { state: defaultProgress(), warning: 'Browser storage is unavailable. Export a backup to keep your progress.' } }
}

export function useProgress() {
  const [initial] = useState(readInitialProgress)
  const [progress, setProgress] = useState(initial.state)
  const [warning, setWarning] = useState(initial.warning)
  const current = useRef(progress)

  function update(change: ProgressState | ((previous: ProgressState) => ProgressState)) {
    const next = typeof change === 'function' ? change(current.current) : change
    current.current = next
    setProgress(next)
    try { setWarning(saveProgress(window.localStorage, next)) }
    catch { setWarning('Your changes could not be saved. Export a backup before closing this tab.') }
  }

  useEffect(() => { document.documentElement.dataset.theme = progress.theme }, [progress.theme])
  return { progress, update, warning }
}
