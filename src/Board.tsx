import React, { useEffect, useMemo, useRef } from 'react'
type CSSVars = React.CSSProperties & { ['--pct']?: string }
import { useBoard } from './store'
import { pickQuoteForGroups } from './whiteboard/quotes'
import { exportBoardToPng } from './whiteboard/exportBoard'
import { MUSCLE_LABEL, type MuscleGroup } from './types/WodMovements'
import { getSessionLabels } from './workoutTypes/registry'
import { useWorkoutType } from './workoutTypes/context'

const howToUrl = (label: string) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(label + ' exercise how to')}`

const extractMovementName = (line: string): string | null => {
  let t = (line ?? '').trim();

  // skip obvious headers
  if (/^round\s+\d+/i.test(t)) return null;

  // drop leading bullet chars
  t = t.replace(/^[•\-\u2022]\s*/,'');

  // strip labels like "A:", "B:", "Step 2:", "R1:", "Round 2:"
  t = t.replace(/^(?:A|B|Step|R(?:ound)?\s*\d*):\s*/i, '');

  // remove odd/even prefixes
  t = t.replace(/^(?:odd|even)\s+minutes?\s*[-—:]\s*/i, '');

  // prefer the left side before an em dash (often "name — details")
  t = t.split('—')[0].trim();

  // stop at reps/load/tempo markers: " × 10×2s", " x 12", " @ 60%"
  t = t.replace(/\s*(?:×|x|@)\s*.*$/i, '');

  // strip trailing parentheticals (e.g., "(meters)", "(alt)", "(each)")
  while (/\([^)]*\)\s*$/.test(t)) t = t.replace(/\s*\([^)]*\)\s*$/,'');

  // small normalization
  t = t.replace(/\bL\/R\b/gi, 'Left/Right'); // nicer search term
  t = t.replace(/\s{2,}/g, ' ').trim();

  if (!t || /^round\s+\d+/i.test(t)) return null;
  return t;
};

function HowToLink({ label }: { label: string }) {
  return (
      <a
          href={howToUrl(label)}
          target="_blank"
          rel="noreferrer"
          className="small"
          aria-label={`How to: ${label}`}
          title={`How to: ${label}`}
          style={{ whiteSpace: 'nowrap', marginRight: 20, marginLeft: 6,  opacity: 0.8, textDecoration: 'none' }}
      >
        🔍
      </a>
  )
}

function Bullet({ text, workoutType }: { text: string, workoutType: string }) {
  const move = extractMovementName(text) ?? text
  return (
      <div className="marker line list animate">
        <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              columnGap: 8,
              alignItems: 'baseline',
            }}
        >
          {/* left column: wraps */}
          <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
            • {text}
          </div>

          {/* right column: fixed, no wrap */}
          {move && <HowToLink label={workoutType + ' ' + move} />}
        </div>
      </div>
  )
}

export default function Board() {
  const {workoutType} = useWorkoutType();
  const labels = getSessionLabels(workoutType);
  const {date, split, setSplit, workout, lift, hiit, warm, cool, primary, regenLift, regenHiit, generateAll } = useBoard()
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

  // Build a YouTube search for "how to <movement>"
  const howToUrl = (label: string) =>
      `https://www.youtube.com/results?search_query=${encodeURIComponent(`how to ${label} exercise`)}`

// Return a movement name from a block line, or null if it's a header/meta line.
  const extractMovementName = (line: string): string | null => {
    // Skip obvious headers
    if (/^round\s+\d+/i.test(line)) return null

    // If the line is like "A: <move>", "B: <move>", "Step 1: <move>", "R1: <move>"
    const tagMatch = line.match(/^(?:A|B|Step|R(?:ound)?\s*\d*):\s*(.+)$/i)
    if (tagMatch) return tagMatch[1].trim()

    // If the line has details after an em-dash, keep the left part as the move:
    // e.g. "Half-Lift (Seated) — 5 breaths each"
    const left = line.split('—')[0].trim()

    // If what's left still looks like a header, skip it
    if (/^round\s+\d+/i.test(left)) return null

    // Otherwise treat the left portion as the movement label
    return left.length ? left : null
  }

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
              <span className="marker line blue">{labels.liftLabel} {lift ? `(${lift.minutes} min)` : ''}</span>
              {' ~ '}
              <span className="red">{labels.hiitLabel} {hiit ? `(${hiit.minutes} min)` : ''}</span>
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
        <div className="board wod" ref={boardRef}>
          <div className="center">
            <div className="marker title">Your {labels.typeLabel} Workout</div>
            <div key={quote} className="marker quote animate">{'“' + quote + '”'}</div>
          </div>
          {/*<div className="columns">*/}
            <div key={quote} className="board-grid animate">
              <section key={quote + "lift"} className="mini-board animate">
                <div>
                  <div className="board-head">
                    <div className="marker head blue">💪 {labels.liftLabel} {lift ? `(${lift.minutes} min) ` : ''}
                      <button className="btn ghost" onClick={regenLift}>↻</button>
                    </div>
                  </div>
                  {!lift ? <div className="marker line">No lift today, eh?</div> : (
                      <>
                        <div className="marker line">{lift.scheme}</div>
                        {/*<div className="marker line scheme">{lift.scheme}</div>*/}
                        {lift.note && <div className="scheme-sub small">{lift.note}</div>}
                        {/* Bullet list */}
                        <div key={quote} className="marker line list animate">
                          {lift.oddEven ? (
                              <>
                                {lift.oddEven && (
                                    <>
                                      <Bullet
                                          workoutType={labels.typeLabel}
                                          text={`Odd minutes — ${lift.oddEven?.odd.name} × ${lift.oddEven?.odd.reps}`}
                                      />
                                      <Bullet
                                          workoutType={labels.typeLabel}
                                          text={`Even minutes — ${lift.oddEven?.even.name} × ${lift.oddEven?.even.reps}`}
                                      />
                                    </>
                                )}
                              </>
                          ) : (
                              (lift.movements && lift.movements.length > 0) ? (
                                    <>
                                      {lift.movements.map((m, idx) => <Bullet key={idx} workoutType={labels.typeLabel} text={m}/>)}
                                    </>
                                ) : (
                                    /* your existing single-line case */
                                  <Bullet workoutType={labels.typeLabel} text={lift.move}/>
                                    // <div>• {lift.move}</div>
                                )
                              // (lift.movements && lift.movements.length > 1) ? (
                              //   <>
                              //     {lift.movements.map((m, idx) => (<div key={idx}>• {m}</div>))}
                              //   </>
                              // ) : (
                              //   <div>• {lift.move}</div>
                              // )
                          )}
                        </div>
                        <div className="line focus" style={{
                          fontSize: 14,
                          opacity: .75
                        }}>Focus: {MUSCLE_LABEL[lift.focus as MuscleGroup] ?? String(lift.focus)}</div>
                      </>
                  )}
                </div>
              </section>
              <section key={quote + "hiit"} className="mini-board animate">
                <div>
                  <div className="board-head">
                    <div className="marker head red">🔥 {labels.hiitLabel} {hiit ? `(${hiit.minutes} min) ` : ''}
                      <button className="btn ghost red" onClick={regenHiit}>↻</button>
                    </div>
                  </div>
                  <div className="mov-list">
                    {!hiit ? <div className="marker line">No {labels.hiitLabel} workout today, eh?</div> : (
                        <>
                          <div className="marker line">{hiit.format}</div>
                          {hiit.note && <div key={quote + 'hiit-scheme'} className="scheme-sub small">{hiit.note}</div>}

                          <div className="mov-list">
                            {/*{hiit.blocks.map((b, i) => (*/}
                            {/*    <div key={i} className="marker line list animate">• {b}</div>*/}
                            {/*))}*/}
                            {hiit.blocks.map((b, i) => {
                              const move = extractMovementName(b);
                              return (
                                  <div key={i} className="marker line list animate">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', columnGap: 8, alignItems: 'baseline' }}>
                                      <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>• {b}</div>
                                      {move && (
                                          <a
                                              href={howToUrl(move)}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="small"
                                              style={{ whiteSpace: 'nowrap', opacity: 0.8, textDecoration: 'none' }}
                                              aria-label={`How to: ${move}`}
                                              title={`How to: ${move}`}
                                          >
                                            🔍
                                          </a>
                                      )}
                                    </div>
                                  </div>
                              );
                            })}
                          </div>
                          {/*<div className="marker line">{hiit.format}</div>*/}
                          {/*<div className="mov-list">*/}
                          {/*  {hiit.blocks.map((b, i) => (<div key={i} className="marker line list">• {b}</div>))}*/}
                          {/*</div>*/}
                        </>
                    )}
                  </div>
                </div>
              </section>
            </div>
          {/*</div>*/}

          <div className="divider"/>
          <div key={quote + "prep"} className="prepGrid animate">
          {/* Warm-up (left) */}
            <section className="mini-board">
              {/*<div className="prepCard">*/}
                <div className="board-head">
                  <div className="marker head green">🟢 Warm-up 🟢</div>
                </div>
                {warm ? warm.map((w, i) => (<div key={i} className="marker line list animate">• {w}</div>)) :
                    <div className="marker line list animate">—</div>}
              {/*</div>*/}
            </section>

            {/* Cool-down (right) */}
            <section className="mini-board">
              <div className="board-head">
                <div className="marker head blue-soft">🔵 Cool-down 🔵</div>
              </div>
                {/*<div className="sectionHead blue-soft">🧊 Cool-down</div>*/}
                {cool ? cool.map((c, i) => (<div key={i} className="marker line list animate">• {c}</div>)) :
                    <div className="marker line">—</div>}
            </section>
          </div>

          <div className="divider"/>
        </div>
      </div>
  )
}
