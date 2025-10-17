import React, { useEffect, useMemo, useRef } from 'react'
type CSSVars = React.CSSProperties & { ['--pct']?: string }
import { useBoard } from './store'
import { pickQuoteForGroups } from './whiteboard/quotes'
import { exportBoardToPng } from './whiteboard/exportBoard'
import { MUSCLE_LABEL, type MuscleGroup } from './types/WodMovements'

export default function Board(){
  const { date, split, setSplit, workout, lift, hiit, warm, cool, primary, regenLift, regenHiit, generateAll } = useBoard()
  const key = `${date}|${split}|${workout}`
  const rng = useMemo(()=>{
    let h=0; for (let i=0;i<key.length;i++){ h = ((h<<5)-h + key.charCodeAt(i))|0 }
    return ()=>{ h = (h*1664525 + 1013904223)|0; return ((h>>>0)%1e6)/1e6 }
  }, [key])
  const quote = pickQuoteForGroups(rng, primary || new Set())
  const boardRef = useRef<HTMLDivElement>(null)
  // const liftPct = Math.round(split*100);

  const liftPct = Math.round(split * 100)
  const hiitPct = 100 - liftPct
  const sliderStyle: CSSVars = { ['--pct']: `${liftPct}%` }

  // Auto-generate when split changes
  useEffect(()=>{ generateAll() }, [split])

  return (
      <div className="panel" style={{padding: 16}}>
        <div className="header-tools">
          {/* left spacer (empty) */}
          <div/>

          {/* centered slider block */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
            <div className="marker" aria-label="Workout split">
              <span className="marker line blue">Lift {lift ? `(${lift.minutes} min)` : ''}</span>
              {' ~ '}
              <span className="red">HIIT {hiit ? `(${hiit.minutes} min)` : ''}</span>
            </div>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={split}
                onChange={e => setSplit(Number(e.target.value))}
                className="split-range"
                style={sliderStyle /* or your gradient 'background' style */}
            />
          </div>

          {/* right-aligned button */}
          <button className="btn ghost export" onClick={() => exportBoardToPng(boardRef.current!, 'wod.png')}>
            Export WOD
          </button>
        </div>
        <div className="board" ref={boardRef}>
          <div className="center">
            <div className="marker title">WOD</div>
            <div key={quote} className="marker quote animate">{'“' + quote + '”'}</div>
          </div>
          <div className="columns">
            <div>
              <div className="marker head blue">Lift {lift ? `(${lift.minutes} min) ` : ''}
                <button className="btn ghost" onClick={regenLift}>↻</button>
              </div>
              {!lift ? <div className="marker line">No lift today, eh?</div> : (
                  <>
                    <div className="marker line">{lift.scheme}</div>
                    <div className="marker line">
                      • {lift.move}
                    </div>
                    <div className="line" style={{fontSize: 14, opacity: .75}}>Focus: {MUSCLE_LABEL[lift.focus as MuscleGroup] ?? String(lift.focus)}</div>
                  </>
              )}
            </div>
            <div>
              <div className="marker head red">HIIT {hiit ? `(${hiit.minutes} min) ` : ''}
                <button className="btn ghost" onClick={regenHiit}>↻</button>
              </div>
              {!hiit ? <div className="marker line">No HIIT workout today, eh?</div> : (
                  <>
                    <div className="marker line">{hiit.format}</div>
                    {hiit.blocks.map((b, i) => (<div key={i} className="marker line">• {b}</div>))}
                  </>
              )}
            </div>
          </div>

          <div className="divider"/>
          <div className="prepGrid">
            {/* Warm-up (left) */}
            <div className="prepCard">
              <div className="marker head green">🟢 Warm-up</div>
              {warm ? warm.map((w, i) => (<div key={i} className="marker line">• {w}</div>)) :
                  <div className="marker line">—</div>}
            </div>

            {/* Cool-down (right) */}
            <div className="prepCard">
              <div className="marker head blue-soft">🔵 Cool-down</div>
              {/*<div className="sectionHead blue-soft">🧊 Cool-down</div>*/}
              {cool ? cool.map((c, i) => (<div key={i} className="marker line blue-soft">• {c}</div>)) :
                  <div className="marker line blue-soft">—</div>}
            </div>
          </div>

          <div className="divider"/>
        </div>
      </div>
  )
}
