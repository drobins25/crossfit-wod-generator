// src/workoutTypes/chairYoga.ts (simplified)
import { chairYoga as wodLifts, prepLibrary } from '../data/chairYoga'
import type { Equipment, MuscleGroup, Movement } from '../types/WodMovements'
import { ALL_MUSCLE_GROUPS } from '../types/WodMovements'

/* ---------------- Types (unchanged) ---------------- */
type LiftOut = {
  movements?: string[]
  note?: string
  oddEven?: { odd: { name: string; reps: number }; even: { name: string; reps: number } }
  focus: MuscleGroup
  move: string
  scheme: string
  minutes: number
  difficulty: number
  groups: Set<MuscleGroup>
  strained: Set<MuscleGroup>
}
type HiitOut = { format: string; minutes: number; blocks: string[]; groups: Set<MuscleGroup>; note?: string }

/* ---------------- Small utils (simple & deterministic) ---------------- */
function hashSeed(str: string) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5) >>> 0
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function rngFromKey(key: string) {
  return mulberry32(hashSeed(key || 'chair-yoga'))
}
function pick<T>(r: () => number, arr: T[]): T {
  return arr[Math.max(0, Math.floor(r() * arr.length))]!
}
function shuffle<T>(r: () => number, arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

/* ---------------- Data helpers ---------------- */
function hasEquipment(m: Movement, user: Set<Equipment>) {
  if (!m.equipment?.length) return true
  return m.equipment.every((e) => user.has(e))
}
function toSafeGroups(arr: any[]): MuscleGroup[] {
  const allowed = new Set(ALL_MUSCLE_GROUPS)
  return (arr || []).map((g) => (allowed.has(g) ? (g as MuscleGroup) : ('core' as MuscleGroup)))
}
function groupsFromMany(ms: Movement[]) {
  const g = new Set<MuscleGroup>(), s = new Set<MuscleGroup>()
  for (const m of ms) {
    toSafeGroups(m.usedMuscleGroups || []).forEach((x) => g.add(x))
    toSafeGroups(m.strainedMuscleGroups || []).forEach((x) => s.add(x))
  }
  return { groups: g, strained: s }
}
function primaryFromMany(ms: Movement[], sore: Set<MuscleGroup>): MuscleGroup {
  const score = new Map<MuscleGroup, number>()
  const bump = (g: MuscleGroup, w = 1) => score.set(g, (score.get(g) || 0) + w)
  for (const m of ms) {
    for (const g of toSafeGroups(m.usedMuscleGroups || [])) if (!sore.has(g)) bump(g, 2)
    for (const g of toSafeGroups(m.strainedMuscleGroups || [])) if (!sore.has(g)) bump(g, 1)
  }
  let best: MuscleGroup = 'core' as MuscleGroup,
      bestV = -1
  for (const [g, v] of score) if (v > bestV) (best = g), (bestV = v)
  return best
}

/* --------------------------------- LIFT / “Stretch” --------------------------------- */
/**
 * Three simple templates:
 *  - STATIC_HOLDS: 45–60s holds, 3–5 poses, 2–3 rounds
 *  - GENTLE_FLOW: 40s work / 20s ease, 3–5 poses, 3–5 rounds
 *  - E2MOM_PAIR: 2 poses alternating every 2:00 for 4–6 rounds
 */
export function generateLift(args: {
  key: string
  minutes: number
  sore: Set<MuscleGroup>
  equipment: Set<Equipment>
}): LiftOut {
  const r = rngFromKey(args.key)
  let pool = wodLifts.lifts.filter((m) => hasEquipment(m, args.equipment))
  if (!pool.length) pool = wodLifts.lifts.slice()
  if (!pool.length) {
    return {
      focus: 'core',
      move: 'Chair Yoga — Gentle Mobility',
      scheme: `For Quality · ${args.minutes} min`,
      minutes: args.minutes,
      difficulty: 1,
      groups: new Set<MuscleGroup>(['core']),
      strained: new Set<MuscleGroup>(['core']),
      note: `Coach’s note: slow it down, breathe through the nose, and aim for a light 2–3/10 stretch.`
    }
  }

  // avoid sore groups when possible
  const avoidSore = (m: Movement) => {
    const used = new Set<MuscleGroup>([
      ...((m.usedMuscleGroups || []) as MuscleGroup[]),
      ...((m.strainedMuscleGroups || []) as MuscleGroup[])
    ])
    for (const g of used) if (args.sore.has(g)) return false
    return true
  }
  const source = pool.filter(avoidSore)
  const list = source.length ? source : pool

  // Choose one of three patterns with light randomness
  type LiftFmt = 'STATIC_HOLDS' | 'GENTLE_FLOW' | 'E2MOM_PAIR'
  const candidates: LiftFmt[] = ['STATIC_HOLDS', 'GENTLE_FLOW', 'E2MOM_PAIR']
  const fmt = candidates[Math.floor(r() * candidates.length)]

  let movements: string[] = []
  let scheme = ''
  let note = ''
  let chosen: Movement[] = []

  if (fmt === 'STATIC_HOLDS') {
    const poses = clamp(Math.round(args.minutes / 4), 3, 5) // 3–5 poses
    const rounds = clamp(Math.round(args.minutes / (poses * 2)), 2, 3) // 2–3 rounds
    chosen = shuffle(r, list).slice(0, poses)
    movements = chosen.map((m) => `${m.name} — hold 45–60s`)
    scheme = `Static Holds · ${rounds} rounds`
    note = `Coach’s note: melt into each shape, keep shoulders soft, and breathe slow. Stop at a mild stretch—never numb or sharp.`
  } else if (fmt === 'GENTLE_FLOW') {
    const poses = clamp(Math.round(args.minutes / 5), 3, 5)
    const rounds = clamp(Math.round(args.minutes / 5), 3, 5)
    chosen = shuffle(r, list).slice(0, poses)
    movements = chosen.map((m) => `${m.name} — 40s flow / 20s ease`)
    scheme = `Gentle Flow · ${rounds} rounds (40/20)`
    note = `Coach’s note: move with your breath like tai chi—smooth in, smooth out. Keep effort below 3/10 and let the jaw unclench.`
  } else {
    // E2MOM Pair
    const rounds = clamp(Math.floor(args.minutes / 2), 4, 6)
    const pick2 = shuffle(r, list).slice(0, Math.min(2, list.length))
    const A = pick2[0] ?? list[0]
    const B = pick2[1] ?? list[Math.max(1, list.length - 1)]
    chosen = [A, B]
    movements = [`A: ${A.name} — 1:15 work / :45 breathe`, `B: ${B.name} — 1:15 work / :45 breathe`]
    scheme = `Every 2:00 × ${rounds} — alternate A/B`
    note = `Coach’s note: start a new drill every two minutes. Move crisply, then downshift your breath to recover before the next start.`
  }

  const { groups, strained } = groupsFromMany(chosen)
  const focus = chosen.length ? primaryFromMany(chosen, args.sore || new Set()) : ('core' as MuscleGroup)
  const moveHeader = chosen.length > 1 ? 'Chair Stretch Series' : (chosen[0]?.name ?? 'Chair Yoga')

  return {
    focus,
    move: moveHeader,
    scheme,
    minutes: args.minutes,
    difficulty: 1,
    groups,
    strained,
    note,
    movements
  }
}

/* -------------------------------- HIIT / “Flow” -------------------------------- */
/**
 * Three simple templates:
 *  - INTERVALS: 30:30 or 40:20 with 3–5 simple movements
 *  - EMOM: 2–4 stations, light effort
 *  - BREATH_LADDER: 3→5→7 breaths per pose
 */
export function generateHiit(args: {
  key: string
  minutes: number
  equipment: Set<Equipment>
}): HiitOut {
  const r = rngFromKey(args.key)
  let pool = wodLifts.hiitMovements.filter((m) => hasEquipment(m, args.equipment))
  if (!pool.length) pool = wodLifts.hiitMovements.slice()
  if (!pool.length) {
    return {
      format: `Flow · For Quality`,
      minutes: args.minutes,
      blocks: ['Seated Sun-Arms', 'Gentle Twist L/R', 'Ankle Pumps'],
      groups: new Set<MuscleGroup>(['spine', 'shoulders', 'calves'] as MuscleGroup[]),
      note: `Coach’s note: easy, cyclical movement. Keep it conversational and let the exhale be a touch longer.`
    }
  }

  const emomPool = pool.filter((m) => m.emomOk)
  const base = emomPool.length ? emomPool : pool
  type FlowFmt = 'INTERVALS' | 'EMOM' | 'BREATH_LADDER'
  const fmt = (['INTERVALS', 'EMOM', 'BREATH_LADDER'] as FlowFmt[])[Math.floor(r() * 3)]

  const movesCount = clamp(Math.round(args.minutes / 4), 3, 5)
  const chosen = shuffle(r, base).slice(0, Math.min(movesCount, base.length))
  const names = chosen.map((m) => m.name)
  const groups = new Set<MuscleGroup>(
      toSafeGroups(chosen.flatMap((m) => m.usedMuscleGroups || m.strainedMuscleGroups || []))
  )

  let format = ''
  let blocks: string[] = []
  let note = ''

  if (fmt === 'INTERVALS') {
    const pairs: Array<[number, number]> = args.minutes <= 10 ? [[30, 30], [40, 20]] : [[40, 20], [30, 30]]
    const [work, rest] = pick(r, pairs)
    const rounds = clamp(Math.floor((args.minutes * 60) / (work + rest)), 8, 16)
    format = `Intervals ${work}:${rest} × ${rounds}`
    blocks = names.map((n) => `${n}`)
    note = `Coach’s note: move in the work window, breathe in the rest. Stay smooth, never strained.`
  } else if (fmt === 'EMOM') {
    const stations = clamp(Math.round(args.minutes / 5), 2, 4)
    format = `EMOM ${args.minutes}`
    blocks = names.slice(0, stations).map((n, i) => `Min ${i + 1}: ${n} (light & rhythmic)`)
    note = `Coach’s note: hit the minute, then shake it out. Light effort—think “refresh,” not “work.”`
  } else {
    // BREATH_LADDER
    format = `Breath Ladder 3→5→7`
    // Short & tidy: name list once; progression implied
    blocks = names
    note = `Coach’s note: repeat the same mini-sequence while lengthening the breath counts—3, then 5, then 7. Keep it calm and controlled.`
  }

  return { format, minutes: args.minutes, blocks, groups, note }
}

/* -------------------------------- PREP (unchanged) ------------------------------- */
export function buildPrep(args: {
  lift: LiftOut | null
  hiit: HiitOut | null
}): { warmup: string[] | null; cooldown: string[] | null; primary: Set<MuscleGroup> } {
  const warmup = (prepLibrary.warmups || []).map((w) => w.name)
  const cooldown = (prepLibrary.cooldowns || []).map((c) => c.name)
  const primary = new Set<MuscleGroup>()
  if (args.lift?.groups) args.lift.groups.forEach((g) => primary.add(g))
  if (args.hiit?.groups) args.hiit.groups.forEach((g) => primary.add(g))
  return { warmup, cooldown, primary }
}
