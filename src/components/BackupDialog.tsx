import { useEffect, useRef, useState } from 'react'
import { Download, Upload, X } from 'lucide-react'
import { defaultProgress, exportBackup, importBackup } from '../lib/progress'
import type { ProgressState } from '../lib/progress'

interface Props { progress: ProgressState; onReplace: (state: ProgressState) => void; onClose: () => void }

export function BackupDialog({ progress, onReplace, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<ProgressState | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [reading, setReading] = useState(false)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    const element = dialog.current!
    const previouslyFocused = document.activeElement as HTMLElement | null
    element.showModal()
    return () => { element.close(); previouslyFocused?.focus() }
  }, [])

  function downloadBackup() {
    const url = URL.createObjectURL(new Blob([exportBackup(progress)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `roboatlas-progress-${new Date().toISOString().slice(0, 10)}.json`
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('Backup exported. Keep this file somewhere safe.')
    setError('')
  }

  async function readBackup(file: File | undefined) {
    if (!file) return
    setPending(null)
    setError('')
    setMessage('')
    setResetting(false)
    setReading(true)
    try {
      if (file.size > 1_000_000) throw new Error('Choose a RoboAtlas progress backup under 1 MB.')
      setPending(importBackup(await file.text()))
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'This backup could not be read.') }
    finally { setReading(false) }
  }

  return <dialog ref={dialog} className="backup-dialog" aria-labelledby="backup-title" aria-describedby="backup-description" onCancel={event => { event.preventDefault(); onClose() }}>
    <div className="dialog-header"><h2 id="backup-title">Progress & backup</h2><button className="icon-button" aria-label="Close progress and backup" onClick={onClose}><X size={19} /></button></div>
    <p className="dialog-intro" id="backup-description">Your progress and notes stay in this browser profile. They don’t sync across devices, profiles, or containers. Clearing site data can remove them. Export a backup whenever you want a copy.</p>
    <div className="backup-actions">
      <button className="backup-action" onClick={downloadBackup}><Download size={20} aria-hidden="true" /><span><strong>Export progress</strong><small>Download completed lessons, notes, and preferences as JSON.</small></span></button>
      <button className="backup-action" disabled={reading} onClick={() => fileInput.current?.click()}><Upload size={20} aria-hidden="true" /><span><strong>{reading ? 'Reading backup…' : 'Import progress'}</strong><small>Choose a backup. Review it before replacing your progress.</small></span></button>
      <input ref={fileInput} className="sr-only" tabIndex={-1} aria-label="Progress backup file" type="file" accept=".json,application/json" onChange={event => { void readBackup(event.target.files?.[0]); event.target.value = '' }} />
    </div>
    {error && <p className="dialog-error" role="alert">{error} Your current progress has not changed.</p>}
    {pending && <div className="import-preview"><h3>Review this backup</h3><p>This will replace <strong>{progress.completed.length} completed units and {Object.values(progress.notes).filter(Boolean).length} stage notes</strong> with <strong>{pending.completed.length} completed units and {Object.values(pending.notes).filter(Boolean).length} stage notes</strong>. Theme and expanded stages will also be restored. Unknown lesson and stage IDs are ignored. Export your current progress first if you want to keep it.</p><div className="dialog-button-row"><button className="primary-button" onClick={() => { onReplace(pending); setPending(null); setMessage('Progress and notes restored from your backup.'); }}>Replace with this backup</button><button className="secondary-button" onClick={() => setPending(null)}>Cancel import</button></div></div>}
    {message && <p className="dialog-status" role="status">{message}</p>}
    <div className="danger-zone">{!resetting ? <button onClick={() => { setResetting(true); setPending(null); setMessage(''); setError('') }}>Reset learning progress…</button> : <><p><strong>Reset all completed lessons and stage notes?</strong><br />This clears your {progress.completed.length} completed units, notes, and last-opened lesson in this browser. Export a backup first to keep a copy. Your theme and expanded stages stay as they are.</p><div className="dialog-button-row"><button className="danger-button" onClick={() => { onReplace({ ...defaultProgress(), theme: progress.theme, expanded: progress.expanded }); setResetting(false); setMessage('Learning progress and notes reset. Ready for a fresh start.'); }}>Confirm reset</button><button className="secondary-button" onClick={() => setResetting(false)}>Keep my progress</button></div></>}</div>
  </dialog>
}
