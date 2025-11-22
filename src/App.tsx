import React, { useEffect, useState } from 'react'
import Board from './Board'
import Controls from './Controls'
import { BoardProvider } from './store'
import { WorkoutTypeProvider } from './workoutTypes/context'
import WizardControls from './wizard/WizardControls'

export default function App() {
  const [dark, setDark] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dark') || 'true') } catch { return true }
  })

  const [manualWizardMode, setManualWizardMode] = useState<boolean | null>(() => {
    try {
      const stored = localStorage.getItem('wizardMode')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)

  const wizardMode = manualWizardMode !== null ? manualWizardMode : isMobile

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', dark)
    try { localStorage.setItem('dark', JSON.stringify(dark)) } catch {}
  }, [dark])

  useEffect(() => {
    if (manualWizardMode !== null) {
      try { localStorage.setItem('wizardMode', JSON.stringify(manualWizardMode)) } catch {}
    }
  }, [manualWizardMode])

  return (
      <div className={`container ${wizardMode ? 'wizard-mode' : ''}`}>
        {!wizardMode && (
          <div className="topbar">
            <div className="brand"><h1>WODSpark</h1></div>
            <div className="switch desktop-only">
              <label>Dark mode</label>
              <input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)} />
            </div>
          </div>
        )}

        <WorkoutTypeProvider>
          <BoardProvider>
            {wizardMode ? (
              <div className="layout-hero-board">
                <div className="left-col" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div id="controls"></div>
                  <section className="controls-wrap" style={{ padding: '0 20px 20px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <WizardControls/>
                  </section>
                </div>
              </div>
            ) : (
              <div className="layout-hero-board">
                <div className="left-col">
                  <div id="controls"></div>
                  <section className="controls-wrap">
                    <Controls/>
                  </section>
                </div>

                <div className="right-col">
                  <section className="board-wrap">
                    <Board/>
                  </section>
                </div>
              </div>
            )}
          </BoardProvider>
        </WorkoutTypeProvider>
      </div>
  )
}
