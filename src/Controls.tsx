import React, { useEffect, useState } from 'react'
import { ALL_EQUIPMENT, EQUIPMENT_LABEL, ALL_MUSCLE_GROUPS, MUSCLE_LABEL, type Equipment } from './types/WodMovements'
import { useBoard } from './store'

export default function Controls(){
    const { date, setDate, equipSel, setEquipSel, soreSel, setSoreSel, workout, setWorkout, generateAll } = useBoard()

    // Re-generate when inputs change
    useEffect(()=>{ generateAll() }, [date, equipSel, soreSel, workout])

    // Collapsible state
    const [equipCollapsed, setEquipCollapsed] = React.useState(true);
    const [hurtCollapsed,  setHurtCollapsed]  = React.useState(true);

    // Equipment "Select all"
    const allSelected = equipSel.length === ALL_EQUIPMENT.length
    const toggleAll = (checked: boolean) => setEquipSel(() => (checked ? [...ALL_EQUIPMENT] : []))

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
                    <label>Total workout time</label>
                    <input className="input input-compact" type="number" min={20} max={60} step={5}
                           value={workout}
                           onChange={e => setWorkout(Math.max(20, Math.min(60, Number(e.target.value) || 40)))}/>
                    <span className="small">minutes (excludes warm-up / cool-down)</span>
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
                            <input type="checkbox" checked={allSelected} onChange={e => toggleAll(e.target.checked)}/>
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
                            {ALL_EQUIPMENT.map(eq => (
                                <label key={eq}>
                                    <input
                                        type="checkbox"
                                        checked={equipSel.includes(eq)}
                                        onChange={e=>{
                                            setEquipSel(s => e.target.checked ? [...s, eq] : s.filter(x=>x!==eq))
                                        }}
                                    /> {EQUIPMENT_LABEL[eq]}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* What hurts (collapsible) */}
            <section
                className={`section collapsible ${hurtCollapsed ? 'collapsed' : ''}`}
                aria-expanded={!hurtCollapsed}
                aria-label="What hurts section"
            >
                <div
                    className="section-head"
                    onClick={() => setHurtCollapsed(c => !c)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setHurtCollapsed(c => !c)}
                >
                    <div className="section-title">
                      <span className="section-title-row">
                        What hurts?<span className="note-italic">(avoid for lift)</span>
                      </span>
                    </div>
                    {/*<div className="section-title">Sore areas (lift avoids)</div>*/}
                    <div className="section-actions" onClick={stop}>
                        {/* Optional quick action */}
                        {!hurtCollapsed && (
                            <button
                                className="btn ghost sm"
                                onClick={() => setSoreSel(() => [])}
                                title="Clear all selections"
                            >
                                Clear
                            </button>
                        )}
                        {!hurtCollapsed && (
                            <button
                                className="btn ghost sm"
                                onClick={() => setHurtCollapsed(true)}
                            >
                                Done
                            </button>
                        )}
                        <span className="chev">▾</span>
                    </div>
                </div>

                <div className="section-body padded">
                    <div>
                        <div className="grid-check" onClick={e => e.stopPropagation()}>
                            {ALL_MUSCLE_GROUPS.map(mg => (
                                <label key={mg}>
                                    <input
                                        type="checkbox"
                                        checked={soreSel.includes(mg)}
                                        onChange={e => {
                                            setSoreSel(s => e.target.checked ? [...s, mg] : s.filter(x => x !== mg))
                                        }}
                                    /> {MUSCLE_LABEL[mg]}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
