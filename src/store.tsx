import React, {createContext, useContext, useMemo, useState} from 'react'
import type {Equipment, MuscleGroup} from './types/WodMovements'
import {rngFromKey, generateLift, generateHiit, buildPrep} from './whiteboard/generator'

function today() {
    return new Date().toISOString().slice(0, 10)
}

type LiftT =
    | {
    focus: MuscleGroup;
    move: string;
    scheme: string;
    minutes: number;
    difficulty: number;
    groups: Set<MuscleGroup>;
    strained: Set<MuscleGroup>; // NEW
}
    | null;

type HiitT = { format: string, minutes: number, blocks: string[], groups: Set<MuscleGroup> } | null

type Ctx = {
    date: string; setDate: (v: string) => void
    split: number; setSplit: (v: number) => void
    workout: number; setWorkout: (v: number) => void
    equipSel: Equipment[]; setEquipSel: (f: (s: Equipment[]) => Equipment[]) => void
    soreSel: MuscleGroup[]; setSoreSel: (f: (s: MuscleGroup[]) => MuscleGroup[]) => void
    lift: LiftT; hiit: HiitT; warm: string[] | null; cool: string[] | null; primary: Set<MuscleGroup> | null
    generateAll: () => void; regenLift: () => void; regenHiit: () => void
}

const C = createContext<Ctx>(null as any)

export function BoardProvider({children}: { children: React.ReactNode }) {
    const [date, setDate] = useState(today())
    const [split, setSplit] = useState(0.5) // default half / half
    const [workout, setWorkout] = useState(40) // default minutes, 20–60
    const [equipSel, setEquipSel] = useState<Equipment[]>([]) // default empty
    const [soreSel, setSoreSel] = useState<MuscleGroup[]>([]) // default empty
    const [lift, setLift] = useState<LiftT>(null)
    const [hiit, setHiit] = useState<HiitT>(null)
    const [warm, setWarm] = useState<string[] | null>(null)
    const [cool, setCool] = useState<string[] | null>(null)
    const [primary, setPrimary] = useState<Set<MuscleGroup> | null>(null)

    const equipSet = useMemo(() => new Set(equipSel), [equipSel])
    const soreSet = useMemo(() => new Set(soreSel), [soreSel])
    const key = `${date}|${split}|${workout}|${Array.from(equipSet).join(',')}|${Array.from(soreSet).join(',')}`

    function generateAll(){
        const minutesLift = Math.round(workout * split)
        const minutesHiit = Math.max(0, workout - minutesLift)

        const L = minutesLift > 0
            ? generateLift({ key:key+'|L|', minutes: minutesLift, sore: soreSet, equipment: equipSet })
            : null

        const H = minutesHiit > 0
            ? generateHiit({ key:key+'|H|', minutes: minutesHiit, equipment: equipSet })
            : null

        // Build warmup/cooldown using whatever exists
        let P
        if (L && H) {
            P = buildPrep({ lift: L, hiit: H })
        } else if (L) {
            // hiit stub: no groups
            P = buildPrep({ lift: L, hiit: { format:'', minutes:0, blocks:[], groups: new Set<MuscleGroup>() } })
        } else if (H) {
            // lift stub: no strain (lets prep fall back to HIIT groups)
            P = buildPrep({
                lift: { focus:'core', move:'', scheme:'', minutes:0, difficulty:2, groups: new Set<MuscleGroup>(), strained: new Set<MuscleGroup>() },
                hiit: H
            })
        } else {
            P = { warmup: null, cooldown: null, primary: new Set<MuscleGroup>() }
        }

        setLift(L); setHiit(H)
        setWarm(P.warmup); setCool(P.cooldown); setPrimary(P.primary)
    }

    function regenLift(){
        const minutesLift = Math.round(workout * split)
        if (minutesLift <= 0) { setLift(null); generateAll(); return }
        const L = generateLift({ key:key+'|L|'+Math.random(), minutes: minutesLift, sore: soreSet, equipment: equipSet })
        setLift(L)
        const hiitStub = { format:'', minutes:0, blocks:[], groups:new Set<MuscleGroup>() }
        const P = hiit ? buildPrep({ lift:L, hiit }) : buildPrep({ lift:L, hiit: hiitStub })
        setWarm(P.warmup); setCool(P.cooldown); setPrimary(P.primary)
    }


    function regenHiit(){
        const minutesHiit = Math.max(0, workout - Math.round(workout * split))
        if (minutesHiit <= 0) { setHiit(null); generateAll(); return }
        const H = generateHiit({ key:key+'|H|'+Math.random(), minutes: minutesHiit, equipment: equipSet })
        setHiit(H)
        const liftStub = { focus: 'core' as MuscleGroup, move:'', scheme:'', minutes:0, difficulty:2, groups:new Set<MuscleGroup>(), strained:new Set<MuscleGroup>() }
        const P = lift ? buildPrep({ lift, hiit:H }) : buildPrep({ lift: liftStub, hiit:H })
        setWarm(P.warmup); setCool(P.cooldown); setPrimary(P.primary)
    }

    const value: Ctx = {
        date,
        setDate,
        split,
        setSplit,
        workout,
        setWorkout,
        equipSel,
        setEquipSel,
        soreSel,
        setSoreSel,
        lift,
        hiit,
        warm,
        cool,
        primary,
        generateAll,
        regenLift,
        regenHiit
    }
    return <C.Provider value={value}>{children}</C.Provider>
}

export function useBoard() {
    return useContext(C)
}
