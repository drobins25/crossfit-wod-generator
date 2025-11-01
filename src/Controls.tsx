import React, { useEffect, useState } from 'react'
import { ALL_EQUIPMENT, EQUIPMENT_LABEL, ALL_MUSCLE_GROUPS, MUSCLE_LABEL, type Equipment } from './types/WodMovements'
import { useBoard } from './store'

export default function Controls(){
    const { date, setDate, equipSel, setEquipSel, focusSel, setFocusSel, workout, setWorkout, generateAll } = useBoard()

    const [workoutStr, setWorkoutStr] = React.useState(String(workout));
    // Re-generate when inputs change
    useEffect(()=>{ generateAll() }, [date, equipSel, focusSel, workout])

    // Collapsible state
    const [equipCollapsed, setEquipCollapsed] = React.useState(true);
    const [focusCollapsed, setFocusCollapsed] = React.useState(true)

    const allFocusSelected = focusSel.length === ALL_MUSCLE_GROUPS.length
    const toggleAllFocus = (checked: boolean) =>
        setFocusSel(() => (checked ? [...ALL_MUSCLE_GROUPS] : []))

    // Equipment "Select all"
    const allSelected = equipSel.length === ALL_EQUIPMENT.length
    const toggleAll = (checked: boolean) => setEquipSel(() => (
        checked ? [...ALL_EQUIPMENT] : [])
    )

    // Stop header toggle when clicking controls in the header
    const stop = (e: React.MouseEvent) => e.stopPropagation()

    const [showTip, setShowTip] = React.useState(false);
    const tipRef = React.useRef<HTMLDivElement>(null);

    // close on outside tap
    React.useEffect(()=>{
        function onDocClick(e: MouseEvent){
            if (!tipRef.current) return;
            if (!tipRef.current.contains(e.target as Node)) setShowTip(false);
        }
        document.addEventListener('click', onDocClick);
        return ()=>document.removeEventListener('click', onDocClick);
    },[]);

    return (
        <div className="panel">
            <div className="section">
                <h3>Session</h3>
                <div className="row row-compact">
                    <label>Date</label>
                    <input className="input input-compact" type="date" value={date}
                           onChange={e => setDate(e.target.value)}/>
                </div>
                <div className="row row-compact" style={{marginTop: 8}}>
                    <label>Total workout time (min) </label>
                    <input
                        className="input input-compact input-xxs"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={3}                    // hard cap to 3 digits
                        value={workoutStr}
                        onChange={(e) => {
                            const digits = e.target.value.replace(/\D+/g, '');
                            setWorkoutStr(digits);
                            const n = parseInt(digits || '0', 10);
                            if (!Number.isNaN(n)) setWorkout(Math.max(0, Math.min(120, n)));
                        }}
                        onBlur={() => {
                            if (workoutStr === '') {
                                setWorkoutStr('40');
                                setWorkout(40);
                            }
                        }}
                    />
                    <span className="small">(excludes warm-up / cool-down)</span>
                </div>
            </div>

            {/* Equipment (collapsible) */}
            <section
                className={`section collapsible ${equipCollapsed ? 'collapsed' : ''}`}
                aria-expanded={!equipCollapsed}
                aria-label="Equipment section"
            >
                <div
                    className="section-head"
                    onClick={() => setEquipCollapsed(c => !c)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setEquipCollapsed(c => !c)}
                >
                    <div className="section-title">Equipment</div>
                    <div className="section-actions" onClick={stop}>
                        <label className="small">
                            Select all
                            <input type="checkbox" checked={allSelected} onChange={(e) => (toggleAll(e.target.checked))}/>
                        </label>
                        {!equipCollapsed && (
                            <button className="btn ghost sm" onClick={() => setEquipCollapsed(true)}>Done</button>
                        )}
                        <span className="chev">▾</span>
                    </div>
                </div>

                <div className="section-body padded">
                    <div>
                        <div className="grid-check" onClick={e => e.stopPropagation()}>
                            <div className="grid-check two">
                                {ALL_EQUIPMENT.map(eq => (
                                    <label key={eq}>
                                        <input
                                            type="checkbox"
                                            checked={equipSel.includes(eq)}
                                            onChange={e => {
                                                setEquipSel(s => e.target.checked ? [...s, eq] : s.filter(x => x !== eq))
                                            }}
                                        /> {EQUIPMENT_LABEL[eq]}
                                    </label>
                                ))}
                            </div>
                            </div>
                        </div>
                    </div>
            </section>

            {/* What hurts (collapsible) */}
            <section
                className={`section collapsible ${focusCollapsed ? 'collapsed' : ''}`}
                aria-expanded={!focusCollapsed}
                aria-label="Focus Areas section"
            >
                <div
                    className="section-head"
                    onClick={() => setFocusCollapsed(c => !c)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFocusCollapsed(c => !c)}
                >
                    <div className="section-title">
                      <span className="section-title-row">
                        Training Focus
                          {/*<span className="note-italic">(avoid unchecked)</span>*/}
                      </span>
                    </div>
                    <div className="section-actions" onClick={e => e.stopPropagation()}>
                        <label className="small">
                            Select all
                            <input
                                type="checkbox"
                                checked={allFocusSelected}
                                onChange={e => toggleAllFocus(e.target.checked)}
                            />
                        </label>
                        {!focusCollapsed && (
                            <button className="btn ghost sm" onClick={() => setFocusCollapsed(true)}>Done</button>
                        )}
                        <span className="chev">▾</span>
                    </div>
                </div>

                <div className="section-body padded">
                    <div>
                        <div className="grid-check" onClick={e => e.stopPropagation()}>
                            <div className="grid-check two">
                                {ALL_MUSCLE_GROUPS.map(mg => (
                                    <label key={mg}>
                                        <input
                                            type="checkbox"
                                            checked={focusSel.includes(mg)}
                                            onChange={e => setFocusSel(s =>
                                                e.target.checked ? [...s, mg] : s.filter(x => x !== mg)
                                            )}
                                        /> {MUSCLE_LABEL[mg]}
                                    </label>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
            </section>
        </div>
    )
}
