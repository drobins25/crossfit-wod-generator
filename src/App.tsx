import React, { useEffect, useState } from 'react'
import Board from './Board'
import Controls from './Controls'
import { BoardProvider } from './store'
import { WorkoutTypeProvider } from './workoutTypes/context'
import IntroHero from './IntroHero'

export default function App() {
  const [dark, setDark] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dark') || 'true') } catch { return true }
  })

  useEffect(() => {
    document.body.classList.toggle('dark', dark)
    try { localStorage.setItem('dark', JSON.stringify(dark)) } catch {}
  }, [dark])

  return (
      <div className="container">
        <div className="topbar">
          <div className="brand"><h1>WODSpark</h1></div>
          <div className="switch">
            <label>Dark mode</label>
            <input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)} />
          </div>
        </div>

        <WorkoutTypeProvider>
          <BoardProvider>
              <div className="layout-hero-board">

              <div className="left-col">
                <IntroHero/>
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
          </BoardProvider>
        </WorkoutTypeProvider>
      </div>
  )
}
