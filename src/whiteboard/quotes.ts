import type { MuscleGroup } from '../types/WodMovements'

type Q = { text: string, tags?: MuscleGroup[] }
export const LONG_QUOTES: Q[] = [
  { text: "Form first. Then speed. Then load. Practice precision until it’s automatic—then let the engine roar when it counts.", tags:["quadriceps","posteriorChain","shoulders","core"] },
  { text: "Show up, stack small wins, and let consistency do the heavy lifting. Today’s effort is tomorrow’s edge.", tags:["legs","back"] },
  { text: "Brace, breathe, and be patient. Good positions print power; rushed reps print injuries.", tags:["core"] },
  { text: "Control the bar, control the breath, control the mind. That’s how heavy gets lighter.", tags:["shoulders","back"] },
  { text: "Power is posture plus patience—own the positions and the weight will follow.", tags:["posteriorChain","upperBack"] },
  { text: "Go hard with purpose, recover with intent. Intensity is fuel, but recovery is how you steer.", tags:["legs","arms","core"] },
  { text: "Perfect isn’t required—presence is. One honest rep at a time moves mountains.", tags:["chest","triceps","quadriceps"] },
  { text: "Hold the standard even when no one’s watching. Quality reps compound like interest.", tags:["grip","back","core"] },
  { text: "Lift with intent; condition with humility. The clock tests your mind; the bar tests your patience.", tags:["shoulders","posteriorChain"] },
  { text: "Earn speed with control. Earn volume with mechanics. Earn PRs with patience.", tags:["legs","back","shoulders"] },
  { text: "Smooth is fast. When the movement is clean, intensity finds its way.", tags:["core","shoulders","back"] }
]

export function pickQuoteForGroups(rng:()=>number, groups: Set<MuscleGroup>){
  const tagged = LONG_QUOTES.filter(q => (q.tags||[]).some(t => groups.has(t)))
  const pool = tagged.length ? tagged : LONG_QUOTES
  const i = Math.floor(rng()*pool.length)
  return pool[i].text
}
