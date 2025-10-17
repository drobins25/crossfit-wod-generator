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

    function generateAll() {
        const minutesLift = Math.round(workout * split);
        const minutesHiit = workout - minutesLift
        const L = generateLift({key: key + '|L|', minutes: minutesLift, sore: soreSet, equipment: equipSet})
        const H = generateHiit({key: key + '|H|', minutes: minutesHiit, equipment: equipSet})
        const P = buildPrep({lift: L, hiit: H})
        setLift(L);
        setHiit(H);
        setWarm(P.warmup);
        setCool(P.cooldown);
        setPrimary(P.primary)
    }

    function regenLift() {
        if (!hiit) return generateAll()
        const minutesLift = Math.round(workout * split)
        const L = generateLift({
            key: key + '|L|' + Math.random(),
            minutes: minutesLift,
            sore: soreSet,
            equipment: equipSet
        })
        setLift(L)
        const P = buildPrep({lift: L, hiit: hiit!})
        setWarm(P.warmup);
        setCool(P.cooldown);
        setPrimary(P.primary)
    }

    function regenHiit() {
        if (!lift) return generateAll()
        const minutesHiit = workout - Math.round(workout * split)
        const H = generateHiit({key: key + '|H|' + Math.random(), minutes: minutesHiit, equipment: equipSet})
        setHiit(H)
        const P = buildPrep({lift: lift!, hiit: H})
        setWarm(P.warmup);
        setCool(P.cooldown);
        setPrimary(P.primary)
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
