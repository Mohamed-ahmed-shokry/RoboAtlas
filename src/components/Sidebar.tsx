import { Check, Compass, HardDrive, Route } from 'lucide-react'
import { curriculum } from '../data/curriculum'
import { countProgress } from '../lib/progress'

interface Props { completed: string[]; active: string; onNavigate: (id: string) => void; storageWarning: boolean }

export function Sidebar({ completed, active, onNavigate, storageWarning }: Props) {
  return <aside className="sidebar">
    <a className="brand" href="#main"><span className="brand-icon"><Route size={23} strokeWidth={1.7} aria-hidden="true" /></span><span>Robo<span className="brand-light">Atlas</span><small>A FIELD GUIDE TO ROBOTICS</small></span></a>
    <div className="sidebar-route"><Compass size={16} aria-hidden="true" /><span>My learning roadmap</span></div>
    <div className="nav-heading">YOUR EXPLORATION<span>10 STAGES</span></div>
    <nav aria-label="Roadmap stages">{curriculum.map((stage, index) => {
      const { count, total } = countProgress(stage.resources.flatMap(resource => resource.units.map(unit => unit.id)), completed)
      return <button key={stage.id} className={`nav-stage ${stage.id === active ? 'active' : ''}`} onClick={() => onNavigate(stage.id)} aria-current={stage.id === active ? 'step' : undefined} aria-label={`Stage ${index + 1}: ${stage.title}, ${count} of ${total} complete`}>
        <span className={`nav-number ${count === total ? 'done' : ''}`}>{count === total ? <Check size={12} aria-label="Complete" /> : String(index + 1).padStart(2, '0')}</span><span>{stage.shortTitle}</span>{count > 0 && count < total && <span className="nav-partial" aria-label="In progress" />}
      </button>
    })}</nav>
    <div className="sidebar-bottom"><div className="curiosity"><Compass size={20} aria-hidden="true" /><p>Follow what interests you.<span>No specialization required.</span></p></div><p className="local-status"><HardDrive size={13} aria-hidden="true" />{storageWarning ? 'Storage needs attention' : 'Progress stored in this browser'}</p><span className="sidebar-version">YOUR PACE. YOUR DIRECTION.</span></div>
  </aside>
}
