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
  { text: "Smooth is fast. When the movement is clean, intensity finds its way.", tags:["core","shoulders","back"] },
  { text: "Strong starts in the setup—root the feet, brace the core, and let the bar path draw a straight line to better.", tags:["core","quadriceps","upperBack"] },
  { text: "Your lungs will negotiate; your standards won’t. Keep the rep honest.", tags:["core","legs"] },
  { text: "Heavy is a skill. Practice the light sets like they matter and the heavy ones will listen.", tags:["posteriorChain","glutes","hamstrings"] },
  { text: "Grip the ground, grip the bar, grip the moment. Everything else gets quieter.", tags:["grip","back","core"] },
  { text: "Don’t chase fatigue—chase precision under fatigue.", tags:["core","shoulders","legs"] },
  { text: "Range before load; balance before speed. Earn your next progression.", tags:["adductors","hamstrings","core"] },
  { text: "Move the bar like you mean it—violent hips, calm hands, quiet feet.", tags:["posteriorChain","glutes","quadriceps"] },
  { text: "Rest days aren’t retreats; they are recon. Return with a plan.", tags:["legs","back","shoulders"] },
  { text: "Breathe behind the shield. Let the core set the tempo.", tags:["core"] },
  { text: "If the bar drifts, the mind did first. Refocus and bring it home.", tags:["upperBack","back","shoulders"] },
  { text: "The standard is the standard. Hit depth, lock out, stand tall—every time.", tags:["quadriceps","glutes","triceps"] },
  { text: "Make the last reps look like the first—mechanics don’t get a timeout.", tags:["core","shoulders","legs"] },
  { text: "Intensity is a dial, not a switch. Turn it up with control.", tags:["core","chest","triceps"] },
  { text: "A strong back and a strong mind are rarely separate things.", tags:["back","upperBack","posteriorChain"] },
  { text: "The bar tells the truth. Listen to its path, not your excuses.", tags:["upperBack","core","shoulders"] },
  { text: "Collect clean reps; they spend like currency on the platform.", tags:["quadriceps","hamstrings","glutes"] },
  { text: "You don’t rise to the occasion—you fall to your training. Train the details.", tags:["core","shoulders","back"] },
  { text: "Own the negative, explode the positive. Control is power.", tags:["chest","triceps","posteriorChain"] },
  { text: "Build the base: hips strong, back set, core tight. Peaks come later.", tags:["glutes","hamstrings","core","back"] },
  { text: "Confidence is built in the warm-up sets—stack them with intention.", tags:["core","quadriceps"] },
  { text: "Be the metronome. Pace with purpose, finish with pride.", tags:["legs","core","shoulders"] },
  { text: "Sweat is a receipt. Make sure it buys you better movement.", tags:["core","legs","arms"] },
  { text: "Focus where the rep starts: your feet and your breath.", tags:["calves","core","quadriceps"] },
  { text: "Strong positions make heavy weights feel lighter. Chase positions, not plates.", tags:["upperBack","core","shoulders"] },
  { text: "Move well, then move often. Volume rewards virtue.", tags:["legs","back"] },
  { text: "Don’t count the reps—make the reps count. Quality is the shortcut.", tags:["core","shoulders","quadriceps"] },
  { text: "Finish the lockout like you mean it—strength loves full range.", tags:["triceps","shoulders","chest"] },
  { text: "Calm face, fierce legs. Let your posture do the shouting.", tags:["quadriceps","glutes","hamstrings"] },
  { text: "When the clock talks, answer with mechanics.", tags:["core","shoulders","back"] },
  { text: "Strength is patient. Keep showing up and stack bricks.", tags:["posteriorChain","legs","back"] }
]

export function pickQuoteForGroups(rng:()=>number, groups: Set<MuscleGroup>){
  const tagged = LONG_QUOTES.filter(q => (q.tags||[]).some(t => groups.has(t)))
  const pool = tagged.length ? tagged : LONG_QUOTES
  const i = Math.floor(rng()*pool.length)
  return pool[i]
}
