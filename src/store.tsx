import React, { createContext, useContext, useMemo, useState } from 'react'
import { ALL_EQUIPMENT, ALL_MUSCLE_GROUPS, type Equipment, type MuscleGroup } from './types/WodMovements'
import { generateLift, generateHiit, buildPrep } from './whiteboard/generator'

function today() {
    return new Date().toISOString().slice(0, 10)
}

type LiftT =
    | {
    focus: MuscleGroup
    move: string
    scheme: string
    minutes: number
    difficulty: number
    groups: Set<MuscleGroup>
    strained: Set<MuscleGroup>
}
    | null

type HiitT =
    | {
    format: string
    minutes: number
    blocks: string[]
    groups: Set<MuscleGroup>
}
    | null

type PrepResult = {
    warmup: string[] | null
    cooldown: string[] | null
    primary: Set<MuscleGroup>
}

type Ctx = {
    date: string
    setDate: (v: string) => void
    split: number
    setSplit: (v: number) => void
    workout: number
    setWorkout: (v: number) => void

    equipSel: Equipment[]
    setEquipSel: React.Dispatch<React.SetStateAction<Equipment[]>> // accepts value or updater

    // ✅ Focus Areas (checked by default). Unchecked = “sore/avoid”.
    focusSel: MuscleGroup[]
    setFocusSel: React.Dispatch<React.SetStateAction<MuscleGroup[]>> // accepts value or updater

    lift: LiftT
    hiit: HiitT
    warm: string[] | null
    cool: string[] | null
    primary: Set<MuscleGroup> | null

    generateAll: () => void
    regenLift: () => void
    regenHiit: () => void
}

const BoardContext = createContext<Ctx | null>(null)

export function BoardProvider({ children }: { children: React.ReactNode }) {
    const [date, setDate] = useState(today())
    const [split, setSplit] = useState(0.5) // default half / half
    const [workout, setWorkout] = useState(40) // default minutes, 20–60

    // Preselect all equipment on first load
    const [equipSel, setEquipSel] = useState<Equipment[]>(() => [...ALL_EQUIPMENT])

    // ✅ Focus Areas: all muscle groups selected by default
    const [focusSel, setFocusSel] = useState<MuscleGroup[]>(() => [...ALL_MUSCLE_GROUPS])

    const [lift, setLift] = useState<LiftT>(null)
    const [hiit, setHiit] = useState<HiitT>(null)
    const [warm, setWarm] = useState<string[] | null>(null)
    const [cool, setCool] = useState<string[] | null>(null)
    const [primary, setPrimary] = useState<Set<MuscleGroup> | null>(null)

    const equipSet = useMemo(() => new Set<Equipment>(equipSel), [equipSel])
    const focusSet = useMemo(() => new Set<MuscleGroup>(focusSel), [focusSel])

    // ❗ Derive the “sore/avoid” set as ALL minus focus
    const soreSet = useMemo(() => {
        const s = new Set<MuscleGroup>()
        for (const mg of ALL_MUSCLE_GROUPS) {
            if (!focusSet.has(mg)) s.add(mg)
        }
        return s
    }, [focusSet])

    const key = `${date}|${split}|${workout}|${Array.from(equipSet).join(',')}|focus=[${Array.from(focusSet).join(',')}]`

    function generateAll() {
        const minutesLift = Math.round(workout * split)
        const minutesHiit = Math.max(0, workout - minutesLift)

        const L: LiftT =
            minutesLift > 0 ? generateLift({ key: key + '|L|', minutes: minutesLift, sore: soreSet, equipment: equipSet }) : null

        const H: HiitT =
            minutesHiit > 0 ? generateHiit({ key: key + '|H|', minutes: minutesHiit, equipment: equipSet }) : null

        let P: PrepResult
        if (L && H) {
            P = buildPrep({ lift: L, hiit: H })
        } else if (L) {
            // hiit stub: no groups
            P = buildPrep({
                lift: L,
                hiit: { format: '', minutes: 0, blocks: [], groups: new Set<MuscleGroup>() }
            })
        } else if (H) {
            // lift stub: no strain (lets prep fall back to HIIT groups)
            P = buildPrep({
                lift: {
                    focus: 'core' as MuscleGroup,
                    move: '',
                    scheme: '',
                    minutes: 0,
                    difficulty: 2,
                    groups: new Set<MuscleGroup>(),
                    strained: new Set<MuscleGroup>()
                },
                hiit: H
            })
        } else {
            P = { warmup: null, cooldown: null, primary: new Set<MuscleGroup>() }
        }

        setLift(L)
        setHiit(H)
        setWarm(P.warmup)
        setCool(P.cooldown)
        setPrimary(P.primary)
    }

    function regenLift() {
        const minutesLift = Math.round(workout * split)
        if (minutesLift <= 0) {
            setLift(null)
            generateAll()
            return
        }
        const L = generateLift({
            key: key + '|L|' + Math.random(),
            minutes: minutesLift,
            sore: soreSet,
            equipment: equipSet
        })
        setLift(L)
        const hiitStub = { format: '', minutes: 0, blocks: [], groups: new Set<MuscleGroup>() }
        const P = hiit ? buildPrep({ lift: L!, hiit }) : buildPrep({ lift: L!, hiit: hiitStub })
        setWarm(P.warmup)
        setCool(P.cooldown)
        setPrimary(P.primary)
    }

    function regenHiit() {
        const minutesHiit = Math.max(0, workout - Math.round(workout * split))
        if (minutesHiit <= 0) {
            setHiit(null)
            generateAll()
            return
        }
        const H = generateHiit({
            key: key + '|H|' + Math.random(),
            minutes: minutesHiit,
            equipment: equipSet
        })
        setHiit(H)
        const liftStub = {
            focus: 'core' as MuscleGroup,
            move: '',
            scheme: '',
            minutes: 0,
            difficulty: 2,
            groups: new Set<MuscleGroup>(),
            strained: new Set<MuscleGroup>()
        }
        const P = lift ? buildPrep({ lift: lift!, hiit: H! }) : buildPrep({ lift: liftStub, hiit: H! })
        setWarm(P.warmup)
        setCool(P.cooldown)
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

        focusSel,
        setFocusSel,

        lift,
        hiit,
        warm,
        cool,
        primary,

        generateAll,
        regenLift,
        regenHiit
    }

    return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
}

export function useBoard() {
    const ctx = useContext(BoardContext)
    if (!ctx) throw new Error('useBoard must be used within BoardProvider')
    return ctx
}
