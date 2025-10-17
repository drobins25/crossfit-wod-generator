import React, { useEffect, useMemo, useRef } from 'react'
import { useBoard } from './store'
import { pickQuoteForGroups } from './whiteboard/quotes'
import { exportBoardToPng } from './whiteboard/exportBoard'

export default function Board(){
  const { date, split, setSplit, workout, lift, hiit, warm, cool, primary, regenLift, regenHiit, generateAll } = useBoard()
  const key = `${date}|${split}|${workout}`
  const rng = useMemo(()=>{
    let h=0; for (let i=0;i<key.length;i++){ h = ((h<<5)-h + key.charCodeAt(i))|0 }
    return ()=>{ h = (h*1664525 + 1013904223)|0; return ((h>>>0)%1e6)/1e6 }
  }, [key])
  const quote = pickQuoteForGroups(rng, primary || new Set())
  const boardRef = useRef<HTMLDivElement>(null)
  const liftPct = Math.round(split*100); const hiitPct = 100 - liftPct

  // Auto-generate when split changes
  useEffect(()=>{ generateAll() }, [split])

  return (
    <div className="panel" style={{padding:16}}>
      <div className="header-tools">
        <div className="split-wrap">
          <label>Split</label>
          <span className="small">Lift {liftPct}% / HIIT {hiitPct}%</span>
          <input type="range" min="0.3" max="0.9" step="0.01" value={split} onChange={e=>setSplit(Number(e.target.value))}/>
        </div>
        <button className="btn ghost" onClick={()=>exportBoardToPng(boardRef.current!, 'wod.png')}>Export WOD</button>
      </div>

      <div className="board" ref={boardRef}>
        <div className="marker title">WOD</div>
        <div className="marker" style={{fontSize:18, opacity:.85, marginBottom:8}}>{'“'+quote+'”'}</div>

        <div className="columns">
          <div>
            <div className="marker head blue">Lift {lift ? `(${lift.minutes} min)` : ''} <button className="btn ghost" onClick={regenLift}>↻</button></div>
            {!lift ? <div className="marker line">—</div> : (
              <>
                <div className="marker scheme">{lift.scheme}</div>
                <div className="marker move">{lift.move}</div>
                <div className="line" style={{fontSize:14, opacity:.75}}>Focus: {lift.focus}</div>
              </>
            )}
          </div>
          <div>
            <div className="marker head red">HIIT {hiit ? `(${hiit.minutes} min)` : ''} <button className="btn ghost" onClick={regenHiit}>↻</button></div>
            {!hiit ? <div className="marker line">—</div> : (
              <>
                <div className="marker scheme">{hiit.format}</div>
                {hiit.blocks.map((b,i)=>(<div key={i} className="marker line">• {b}</div>))}
              </>
            )}
          </div>
        </div>

        <div className="divider" />
        <div className="marker head green">Warm-up</div>
        {warm ? warm.map((w,i)=>(<div key={i} className="marker line">• {w}</div>)) : <div className="marker line">—</div>}
        <div className="divider" />
        <div className="marker head blue-soft">Cool-down</div>
        {cool ? cool.map((c,i)=>(<div key={i} className="marker line blue-soft">• {c}</div>)) : <div className="marker line blue-soft">—</div>}
      </div>
    </div>
  )
}
