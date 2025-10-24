import { wodLifts, prepLibrary } from '../data/wodLifts'
import type { Equipment, MuscleGroup, Movement } from '../types/WodMovements'

function mulberry32(a: number){ return function(){ let t=(a+=0x6D2B79F5)>>>0; t=Math.imul(t^(t>>>15), t|1); t^=t+Math.imul(t^(t>>>7), t|61); return ((t^(t>>>14))>>>0)/4294967296 } }
function hashSeed(str: string){ let h=2166136261>>>0; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h= (h + (h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24))>>>0 } return h>>>0 }
export function rngFromKey(key: string){ return mulberry32(hashSeed(key||'wod')) }
function pick<T>(rng:()=>number, arr:T[]):T{ return arr[Math.floor(rng()*arr.length)] }
function shuffle<T>(rng:()=>number, arr:T[]):T[]{ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a }

function hasEquipment(m: Movement, user: Set<Equipment>){
  if (!m.equipment || m.equipment.length===0) return true
  return m.equipment.every(eq => user.has(eq))
}

export function generateLift({
                               key, minutes, sore: soreSet, equipment
                             }: {
  key: string, minutes: number, sore: Set<MuscleGroup>, equipment: Set<Equipment>
}) {
  const rng = rngFromKey(key)

  // helpers
  const hasEquipment = (m: any) => (m.equipment ?? []).every((e: Equipment) => equipment.has(e))
  const avoidSore = (m: any) => !(m.strainedMuscleGroups ?? []).some((g: MuscleGroup) => soreSet.has(g))
  const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)]
  const isPush = (m: any) => {
    const p = m.movementPattern ?? []
    return p.includes('verticalPress') || p.includes('horizontalPress') || p.includes('overheadLockout') || p.includes('dipDrive') || p.includes('dipDriveOptional')
  }
  const isPull = (m: any) => {
    const p = m.movementPattern ?? []
    return p.includes('verticalPull') || p.includes('horizontalPull') || p.includes('pull') || p.includes('uprightPull') || p.includes('wideGripPull')
  }
  const union = (a: Set<MuscleGroup>, b: Set<MuscleGroup>) => new Set<MuscleGroup>([...a, ...b])

  // 1) equipment-filtered
  let candidates = wodLifts.lifts.filter(hasEquipment)
  if (candidates.length === 0) candidates = wodLifts.lifts.slice()
  if (candidates.length === 0) {
    return {
      focus: 'core' as MuscleGroup,
      move: 'Bodyweight Squat',
      scheme: `Every 2:00 for ${Math.max(3, Math.floor(minutes/2))} sets: 15 reps`,
      minutes, difficulty: 2,
      strained: new Set<MuscleGroup>(['core'] as MuscleGroup[]),
      groups:   new Set<MuscleGroup>(['core'] as MuscleGroup[])
    }
  }

  const allFocus = Array.from(new Set(candidates.flatMap(m => m.strainedMuscleGroups || [])))
  const focusChoices = allFocus.filter(g => !soreSet.has(g))
  const focus = (focusChoices.length ? pick(focusChoices) : (allFocus[0] ?? 'core')) as MuscleGroup

  // === NEW: try Push/Pull EMOM ==========================================
  const pushers = candidates.filter(m => isPush(m) && avoidSore(m))
  const pullers = candidates.filter(m => isPull(m) && avoidSore(m))

  const canPushPull = minutes >= 12 && pushers.length > 0 && pullers.length > 0
  const doPushPull = canPushPull && (rng() < 0.4) // ~40% chance when eligible

  if (doPushPull) {
    const push = pick(pushers)
    let pull = pick(pullers)
    if (pull === push && pullers.length > 1) pull = pullers.find(m => m !== push)!

    const repsPush = push.amrapSetReps ?? 6
    const repsPull = pull.amrapSetReps ?? 6

    const pushGroups = new Set<MuscleGroup>(
        (push.usedMuscleGroups?.length ? push.usedMuscleGroups : (push.strainedMuscleGroups || ['core'])) as MuscleGroup[]
    )
    const pullGroups = new Set<MuscleGroup>(
        (pull.usedMuscleGroups?.length ? pull.usedMuscleGroups : (pull.strainedMuscleGroups || ['core'])) as MuscleGroup[]
    )
    const pushStrained = new Set<MuscleGroup>((push.strainedMuscleGroups || ['core']) as MuscleGroup[])
    const pullStrained = new Set<MuscleGroup>((pull.strainedMuscleGroups || ['core']) as MuscleGroup[])

    return {
      focus,
      move: `${push.name} / ${pull.name}`,
      scheme: `EMOM ${minutes} (odd/even)`,
      // Slim, friendly explainer:
      note: `Alternate every minute between the two movements (odd then even) for the full duration.`,
      oddEven: {
        // Convention: PULL on odd, PUSH on even (you can flip if you prefer)
        odd:  { name: pull.name, reps: repsPull },
        even: { name: push.name, reps: repsPush }
      },
      minutes,
      difficulty: Math.max(push.difficulty ?? 3, pull.difficulty ?? 3),
      groups: new Set<MuscleGroup>([...pushGroups, ...pullGroups]),
      strained: new Set<MuscleGroup>([...pushStrained, ...pullStrained])
    }
  }

  // ======================================================================

  // === Existing single-movement formats (unchanged) ======================
  const liftsForFocus = candidates.filter(m => (m.strainedMuscleGroups || []).includes(focus) && avoidSore(m))
  const pool = (liftsForFocus.length ? liftsForFocus : candidates.filter(avoidSore))
  const chosen = (pool.length ? pick(pool) : pick(candidates))
  let note: string | undefined;   // NEW

  if (!chosen) {
    return {
      focus,
      move: 'Bodyweight Squat',
      scheme: `Every 2:00 for ${Math.max(3, Math.floor(minutes/2))} sets: 15 reps`,
      minutes, difficulty: 2,
      strained: new Set<MuscleGroup>(['core'] as MuscleGroup[]),
      groups:   new Set<MuscleGroup>(['core'] as MuscleGroup[])
    }
  }

  const liftGroups = new Set<MuscleGroup>(
      (chosen.usedMuscleGroups?.length ? chosen.usedMuscleGroups : (chosen.strainedMuscleGroups || ['core'])) as MuscleGroup[]
  )
  const strained = new Set<MuscleGroup>((chosen.strainedMuscleGroups || ['core']) as MuscleGroup[])

  const build = minutes >= 16 ? (rng() > 0.4) : (rng() > 0.6)
  let scheme: string
  if (build) {
    scheme = 'Build to a heavy'
    note = 'Climb in weight with crisp reps. 4–6 sets of 3–5 reps; rest 2–3 min. Stop one good set before failure.';
  } else {
    const emom = minutes >= 10 && !!chosen.emomOk
    if (emom) {
      note = 'Every minute on the minute: hit smooth, unbroken reps and use the remainder to recover. Pick a load you can hold across all minutes.';
      scheme = `EMOM ${minutes}: ${chosen.amrapSetReps ?? 5} reps`
    } else {
      const sets = Math.max(3, Math.floor(minutes / 2))
      const reps = chosen.amrapSetReps ?? 6
      note = 'On a 2:00 clock: perform the prescribed reps, then rest the remaining time. Aim for consistent quality; add small weight if moving well.';
      scheme = `Every 2:00 for ${sets} sets: ${reps} reps`
    }
  }

  return {
    focus,
    move: chosen.name,
    scheme,
    note,
    minutes,
    difficulty: chosen.difficulty ?? 3,
    groups: liftGroups,
    strained
  }
}

function buildForTimePattern(minutes:number){
  if (minutes >= 18) return "For Time: 10-9-8-7-6-5-4-3-2-1"
  if (minutes >= 14) return "For Time: 5 Rounds"
  return "For Time: 3 Rounds"
}

export function generateHiit({
                               key, minutes, equipment
                             }: { key:string, minutes:number, equipment:Set<Equipment> }) {
  const rng = rngFromKey(key)

  // ---- helpers -----------------------------------------------------------
  const diff = (m: Movement) => m.difficulty ?? 3
  const isVeryHard = (m: Movement) => diff(m) >= 5
  const hitsGrip = (m: Movement) =>
      (m.usedMuscleGroups ?? []).includes('grip' as MuscleGroup)

  const byEquipment = (m: Movement) => hasEquipment(m, equipment)

  function pickWeighted<T>(items: Array<[T, number]>) {
    const total = items.reduce((s, [,w]) => s + w, 0)
    let r = rng() * total
    for (const [val, w] of items) { r -= w; if (r <= 0) return val }
    return items[items.length - 1][0]
  }

  function nameList(ms: Movement[]) {
    return ms.map(m => m.name).join(', ')
  }

  // Movements that work well as the “go-to” for Intervals part B
  const GO_TO_IDS = new Set([
    'rowCalories','airBikeCalories','skiErgCalories','run400m',
    'burpee','slamBall','doubleUnder','singleUnder','boxJump'
  ])
  function pickGoTo(pool: Movement[]) {
    const go = pool.filter(m => GO_TO_IDS.has(m.id))
    if (go.length) return go[Math.floor(rng()*go.length)]
    // fallback: lowest difficulty mono-structural or simple bodyweight
    const fallback = pool.slice().sort((a,b)=>diff(a)-diff(b))
    return fallback[0]
  }

  // ---- pool & sizing -----------------------------------------------------
  let pool = wodLifts.hiitMovements.filter(byEquipment)
  if (!pool.length) pool = wodLifts.hiitMovements.slice()
  if (!pool.length) {
    return { format:`AMRAP ${minutes} min`, minutes, blocks:[], groups:new Set<MuscleGroup>(), note:
          'As many rounds/reps as possible. Move steady, break early to keep transitions fast, and keep quality high.' }
  }

  const targetMoves =
      minutes <= 5 ? 2 :
          minutes <= 10 ? 3 :
              Math.min(5, Math.round(minutes / 4))

  // ---- choose scheme (smart weights by duration) -------------------------
  type Scheme = 'EMOM'|'AMRAP'|'FORTIME'|'LADDER'|'INTERVALS'|'OT2'|'CHIPPER'
  const weights: Array<[Scheme, number]> = [
    ['EMOM',      0.25],
    ['AMRAP',     0.25],
    ['FORTIME',   0.10],
    ['LADDER',    0.12],
    ['INTERVALS', 0.13],
    ['OT2',       0.08],
    ['CHIPPER',   0.07]
  ]
  if (minutes >= 18)              weights.find(w=>w[0]==='CHIPPER')![1]   += 0.04
  if (minutes >= 16)              weights.find(w=>w[0]==='LADDER')![1]    += 0.03
  if (minutes <= 12)              weights.find(w=>w[0]==='INTERVALS')![1] += 0.04

  const scheme = pickWeighted(weights)

  // Prefer EMOM-friendly moves for EMOM/OT2
  const emomPool = pool.filter(m => m.emomOk)
  const basePool = (scheme === 'EMOM' || scheme === 'OT2') && emomPool.length ? emomPool : pool

  // ---- difficulty-aware selection ---------------------------------------
  // Build the set of movements while limiting “very hard” items and
  // avoiding back-to-back high-grip choices.
  function pickBalanced(pool: Movement[], n: number) {
    const candidates = shuffle(rng, pool).slice()
    const result: Movement[] = []
    let veryHardCount = 0

    while (result.length < n && candidates.length) {
      const m = candidates.shift()!
      const wouldBeBackToBackGrip = result.length && hitsGrip(result[result.length-1]) && hitsGrip(m)
      const hard = isVeryHard(m)

      // rules for EMOM/OT2 are stricter
      const hardCap = (scheme === 'EMOM' || scheme === 'OT2') ? 1 : 2
      if (hard && veryHardCount >= hardCap) continue
      if ((scheme === 'EMOM' || scheme === 'OT2') && wouldBeBackToBackGrip) continue

      result.push(m)
      if (hard) veryHardCount++
    }

    // if we underfilled (rare), top up with easiest remaining
    if (result.length < n) {
      const rest = pool.filter(x => !result.includes(x)).slice().sort((a,b)=>diff(a)-diff(b))
      result.push(...rest.slice(0, n - result.length))
    }
    return result.slice(0, n)
  }

  const chosen = pickBalanced(basePool, targetMoves)

  // ---- build blocks per scheme ------------------------------------------
  let format = ''
  let lines: string[] = []
  let note = ''

  if (scheme === 'EMOM') {
    const avgDiff = chosen.reduce((s,m)=>s+(m.difficulty ?? 3),0)/chosen.length
    const addRest = avgDiff >= 4 && minutes >= 14
    format = `EMOM ${minutes}${addRest ? ' + Every 4th minute REST' : ''}`
    // per-movement reps tuned for sustainability
    lines = chosen.map(m => `${m.name} — ${(m.amrapSetReps ?? 10)} reps`)
    note = 'Every minute on the minute. Hit the work, then breathe. Pick reps you can sustain across all minutes.'
  }
  else if (scheme === 'AMRAP') {
    format = `AMRAP ${minutes} min`
    lines = chosen.map(m =>
        (m.amrapSetReps && m.amrapSetReps > 1) ? `${m.name} × ${m.amrapSetReps}` : m.name
    )
    note = 'As many rounds/reps as possible. Steady effort, quick transitions, and quality movement.'
  }
  else if (scheme === 'FORTIME') {
    format = `For Time (${minutes} min cap)`
    // simple for-time: sensible totals per movement
    lines = chosen.map(m => {
      const base = (m.amrapSetReps ?? 10)
      const scale = minutes <= 12 ? 3 : 4
      const reps = Math.max(8, Math.round((base * scale) / Math.max(1, chosen.length - 1)))
      return `${m.name} × ${reps}`
    })
    note = 'Complete all listed work fast—but clean. Partition early, keep transitions tight.'
  }
  else if (scheme === 'LADDER') {
    const ladder = minutes >= 18 && rng() < 0.5 ? '10-9-8-7-6-5-4-3-2-1' : '21-15-9'
    format = `For Time: ${ladder}`
    // ladders define reps—names only
    lines = chosen.map(m => m.name)
    note = 'Descending ladder—reps drop as fatigue rises. Keep positions crisp and pace the early sets.'
  }
  else if (scheme === 'INTERVALS') {
    // A/B Intervals: A cycles through chosen movements, B is a single go-to
    const options = minutes <= 10
        ? [[30,30],[40,20],[20,10]] as const
        : [[40,20],[45,15],[30,30]] as const
    const [work, rest] = options[Math.floor(rng()*options.length)]
    const rounds = Math.max(4, Math.floor((minutes*60)/(work+rest)))

    const goTo = pickGoTo(pool)
    format = `Intervals ${work}:${rest} × ${rounds} — A/B`

    // ⬇️ NEW: each A-movement as its own line, plus a single B line
    const aLines = chosen.map(m => `A: ${m.name}`)
    const bLine  = `B: ${goTo.name}`

    lines = [...aLines, bLine]

    note = 'Alternate sets: A cycles through the listed movements (one per round); B is the same go-to each time. Push the work window; recover on rest.'
  }
  else if (scheme === 'OT2') {
    // On the clock: 2:00 or 1:30 depending on duration
    const period = minutes <= 10 ? 90 : 120
    const rounds = Math.max(3, Math.floor((minutes*60)/period))
    format = `On the ${period/60 === 2 ? '2:00' : '1:30'} × ${rounds} rounds`
    // reps scaled to allow :20–:40s rest
    lines = chosen.map(m => {
      const base = m.amrapSetReps ?? 10
      const scale = period === 120 ? 1 : 0.75
      const reps = Math.max(6, Math.round(base * scale))
      return `${m.name} × ${reps}`
    })
    note = 'Start a new round on the clock. Finish fast to earn more rest. Aim for consistent round times.'
  }
  else { // CHIPPER
    format = `Chipper (${minutes} min cap)`
    lines = chosen.map((m, i) => {
      const base = (m.amrapSetReps ?? 12)
      const mult = 6 - Math.min(i+1,5)    // 5,4,3,2,1
      const reps = Math.max(12, base * mult)
      return `${m.name} × ${reps}`
    })
    note = 'Finish each movement before the next. Partition smart and keep moving.'
  }

  const groups = new Set<MuscleGroup>(chosen.flatMap(m => m.usedMuscleGroups || []))
  return { format, minutes, blocks: lines, groups, note }
}



export function buildPrep({
                            lift,
                            hiit
                          }: {
  // lift/hiit shapes should match your store typing
  lift: {
    focus: MuscleGroup;
    move: string;
    scheme: string;
    minutes: number;
    difficulty: number;
    groups: Set<MuscleGroup>;
    strained: Set<MuscleGroup>; // NEW
  };
  hiit: { format: string; minutes: number; blocks: string[]; groups: Set<MuscleGroup> };
}) {
  // If lift exists, prefer it exclusively, otherwise fall back to HIIT groups.
  const primary = new Set<MuscleGroup>();
  const weighted = new Map<MuscleGroup, number>();

  if (lift) {
    // Weight strained groups higher (2) and used groups lower (1)
    lift.groups.forEach((g) => weighted.set(g, Math.max(weighted.get(g) || 0, 1)));
    lift.strained.forEach((g) => weighted.set(g, Math.max(weighted.get(g) || 0, 2)));
    // Build primary (for quotes, etc.) as union of both
    lift.groups.forEach((g) => primary.add(g));
    lift.strained.forEach((g) => primary.add(g));
  } else {
    // Rare fallback if lift is missing
    hiit.groups.forEach((g) => {
      primary.add(g);
      weighted.set(g, 1);
    });
  }

  const score = (gs: MuscleGroup[]) =>
      gs.reduce((s, g) => s + (weighted.get(g) || 0), 0);

  const warm = [...prepLibrary.warmups]
      .sort((a, b) => score(b.groups) - score(a.groups))
      .slice(0, 3)
      .map((x) => x.name);

  const cool = [...prepLibrary.cooldowns]
      .sort((a, b) => score(b.groups) - score(a.groups))
      .slice(0, 2)
      .map((x) => x.name);

  return { warmup: warm, cooldown: cool, primary };
}
