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
                             }:{
  key: string, minutes: number, sore: Set<MuscleGroup>, equipment: Set<Equipment>
}){
  const rng = rngFromKey(key)

  // 1) Start with equipment-filtered list…
  let candidates = wodLifts.lifts.filter(m => hasEquipment(m, equipment))
  // 2) …but if nothing matches (e.g., no equipment selected), fall back to all lifts
  if (candidates.length === 0) candidates = wodLifts.lifts.slice()

  // If we still somehow have zero (shouldn’t happen), return a safe stub
  if (candidates.length === 0) {
    return {
      focus: 'core' as MuscleGroup,
      move: 'Bodyweight Squat',
      scheme: `Every 2:00 for ${Math.max(3, Math.floor(minutes/2))} sets: 15 reps`,
      minutes,
      difficulty: 2,
      strained: new Set<MuscleGroup>(
          (['core']) as MuscleGroup[]
      ),
      groups: new Set<MuscleGroup>(
          (['core']) as MuscleGroup[]
      )
    }
  }

  const allFocus = Array.from(new Set(candidates.flatMap(m => m.strainedMuscleGroups || [])))
  const focusChoices = allFocus.filter(g => !soreSet.has(g))
  const focus = (focusChoices.length ? pick(rng, focusChoices) : (allFocus[0] ?? 'core')) as MuscleGroup

  const liftsForFocus = candidates.filter(m => (m.strainedMuscleGroups || []).includes(focus))
  const chosen = (liftsForFocus.length ? pick(rng, liftsForFocus) : pick(rng, candidates))

  // Guard (double safety)
  if (!chosen) {
    return {
      focus,
      move: 'Bodyweight Squat',
      scheme: `Every 2:00 for ${Math.max(3, Math.floor(minutes/2))} sets: 15 reps`,
      minutes,
      difficulty: 2,
      strained: new Set<MuscleGroup>(
          (['core']) as MuscleGroup[]
      ),
      groups: new Set<MuscleGroup>(
          (['core']) as MuscleGroup[]
      )
    }
  }

  // Full muscle sets from the chosen lift
  const liftGroups = new Set<MuscleGroup>(
      (chosen.usedMuscleGroups?.length
          ? chosen.usedMuscleGroups
          : (chosen.strainedMuscleGroups || ['core'])) as MuscleGroup[]
  );

  // NEW: keep strained groups separately to weight warmups/cooldowns
  const strained = new Set<MuscleGroup>(
      (chosen.strainedMuscleGroups || ['core']) as MuscleGroup[]
  );

  const build = minutes >= 16 ? (rng() > 0.4) : (rng() > 0.6);
  let scheme: string;
  if (build) {
    scheme = 'Build to a heavy';
  } else {
    const emom = minutes >= 10 && !!chosen.emomOk;
    if (emom) {
      scheme = `EMOM ${minutes}: ${chosen.amrapSetReps ?? 5} reps`;
    } else {
      const sets = Math.max(3, Math.floor(minutes / 2));
      const reps = chosen.amrapSetReps ?? 6;
      scheme = `Every 2:00 for ${sets} sets: ${reps} reps`;
    }
  }

  return {
    focus,
    move: chosen.name,
    scheme,
    minutes,
    difficulty: chosen.difficulty ?? 3,
    groups: liftGroups,      // used muscle groups
    strained                 // NEW: strained groups (higher priority for prep)
  }
}

function buildForTimePattern(minutes:number){
  if (minutes >= 18) return "For Time: 10-9-8-7-6-5-4-3-2-1"
  if (minutes >= 14) return "For Time: 5 Rounds"
  return "For Time: 3 Rounds"
}

export function generateHiit({ key, minutes, equipment }:{ key:string, minutes:number, equipment:Set<Equipment> }){
  const rng = rngFromKey(key)
  const pool = wodLifts.hiitMovements.filter(m => hasEquipment(m, equipment))
  if (!pool.length) return { format:'AMRAP '+minutes+' min', minutes, blocks: [] as string[], groups: new Set<MuscleGroup>() }

  const targetMoves = minutes <= 5 ? 2 : 5
  const useEmom = rng()>0.5

  let chosen: Movement[]
  let lines: string[]
  let format: string

  if (useEmom){
    const emomPool = pool.filter(m=>m.emomOk)
    chosen = shuffle(rng, emomPool.length?emomPool:pool).slice(0, targetMoves)
    const avgDiff = chosen.reduce((s,m)=>s+(m.difficulty??3),0)/chosen.length
    const rest = avgDiff >= 4 ? ' + Every 4th minute REST' : ''
    format = `EMOM ${minutes}${rest}`
    lines = chosen.map(m => `${m.name} — ${m.amrapSetReps ?? 10} reps`)
  } else {
    chosen = shuffle(rng, pool).slice(0, targetMoves)

    // Decide the scheme first
    const isForTime = minutes >= 16 && rng() > 0.6
    if (isForTime) {
      format = buildForTimePattern(minutes) // e.g., "For Time: 10-9-8-...-1"
      // IMPORTANT: no per-movement reps on ladders
      lines = chosen.map(m => m.name)
    } else {
      format = `AMRAP ${minutes} min`
      // AMRAP may show a suggested per-movement rep target (optional)
      lines = chosen.map(m =>
          m.amrapSetReps && m.amrapSetReps > 1 ? `${m.name} x ${m.amrapSetReps}` : m.name
      )
    }
  }

  const groups = new Set<MuscleGroup>(chosen.flatMap(m => m.usedMuscleGroups||[]))
  return { format, minutes, blocks: lines, groups }
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
