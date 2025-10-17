import React, { useEffect } from 'react'
import { ALL_EQUIPMENT, EQUIPMENT_LABEL, ALL_MUSCLE_GROUPS, MUSCLE_LABEL, type Equipment, type MuscleGroup } from './types/WodMovements'
import { useBoard } from './store'

export default function Controls(){
    const { date, setDate, equipSel, setEquipSel, soreSel, setSoreSel, workout, setWorkout, generateAll } = useBoard()

    useEffect(()=>{ generateAll() }, [date, equipSel, soreSel, workout])

    const allSelected = equipSel.length === ALL_EQUIPMENT.length
    const toggleAll = (checked: boolean) => {
        setEquipSel(() => (checked ? [...ALL_EQUIPMENT] : []))
    }

    return (
        <div className="panel">
            <div className="section">
                <h3>Session</h3>
                <div className="row">
                    <label>Date</label>
                    <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
                </div>
                <div className="row" style={{marginTop:8}}>
                    <label>Total workout time</label>
                    <input className="input" type="number" min={20} max={60} step={5}
                           value={workout}
                           onChange={e=>setWorkout(Math.max(20, Math.min(60, Number(e.target.value)||40)))} />
                    <span className="small">minutes (excludes warm-up / cool-down)</span>
                </div>
            </div>

            <div className="section">
                {/* Header with Select all checkbox on the right */}
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
                    <h3 style={{margin:0}}>Equipment</h3>
                    <label className="small" style={{display:'flex', alignItems:'center', gap:8}}>
                        Select all
                        <input type="checkbox" checked={allSelected} onChange={e=>toggleAll(e.target.checked)} />
                    </label>
                </div>

                <div className="grid-check">
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

            <div className="section">
                <h3>What hurts (avoid in Lift)</h3>
                <div className="grid-check">
                    {ALL_MUSCLE_GROUPS.map(mg => (
                        <label key={mg}>
                            <input
                                type="checkbox"
                                checked={soreSel.includes(mg)}
                                onChange={e=>{
                                    setSoreSel(s => e.target.checked ? [...s, mg] : s.filter(x=>x!==mg))
                                }}
                            /> {MUSCLE_LABEL[mg]}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}
