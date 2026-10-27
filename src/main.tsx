import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode><main><h1>RoboAtlas</h1><p>Your personal robotics learning roadmap.</p></main></StrictMode>,
)
