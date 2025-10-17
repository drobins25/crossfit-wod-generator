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
      difficulty: 2
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
      difficulty: 2
    }
  }

  const build = minutes >= 16 ? (rng() > 0.4) : (rng() > 0.6)
  let scheme: string
  if (build) {
    scheme = 'Build to a heavy 5-4-3-2-1'
  } else {
    const emom = minutes >= 10 && !!chosen.emomOk
    if (emom) {
      scheme = `EMOM ${minutes}: ${chosen.amrapSetReps ?? 5} reps`
    } else {
      const sets = Math.max(3, Math.floor(minutes / 2))
      const reps = chosen.amrapSetReps ?? 6
      scheme = `Every 2:00 for ${sets} sets: ${reps} reps`
    }
  }

  return { focus, move: chosen.name, scheme, minutes, difficulty: chosen.difficulty ?? 3 }
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

  const targetMoves = Math.min(5, Math.max(2, 1 + Math.floor(minutes/6)))
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
    const style = minutes >= 18 ? 'AMRAP 20 min' : (minutes >= 12 ? 'AMRAP 15 min' : 'AMRAP 10 min')
    format = style
    lines = chosen.map(m => `${m.name} x ${m.amrapSetReps ?? 12}`)
    if (minutes >= 16 && rng()>0.6) format = buildForTimePattern(minutes)
  }

  const groups = new Set<MuscleGroup>(chosen.flatMap(m => m.usedMuscleGroups||[]))
  return { format, minutes, blocks: lines, groups }
}

export function buildPrep({ lift, hiit }:{ lift:{ focus:MuscleGroup, move:string, scheme:string, minutes:number, difficulty:number }, hiit:{ format:string, minutes:number, blocks:string[], groups:Set<MuscleGroup> } }){
  const primary = new Set<MuscleGroup>([lift.focus])
  hiit.groups.forEach(g => primary.add(g))

  const w = prepLibrary.warmups.filter(w => w.groups.some(g=>primary.has(g)))
  const warm = (w.length? w.slice(0,3) : prepLibrary.warmups.slice(0,3)).map(x=>x.name)

  const c = prepLibrary.cooldowns.filter(c => c.groups.some(g=>primary.has(g)))
  const cool = (c.length? c.slice(0,2) : prepLibrary.cooldowns.slice(0,2)).map(x=>x.name)

  return { warmup: warm, cooldown: cool, primary }
}
