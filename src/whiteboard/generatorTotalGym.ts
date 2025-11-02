import { totalGym, prepLibrary } from '../data/totalGym';
import { Equipment, MuscleGroup, Movement } from '../types/WodMovements';

/* -------------------- RNG + helpers (standalone) -------------------- */
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6D2B79F5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashSeed(str: string) {
  let h = (2166136261 >>> 0) as number;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
  }
  return h >>> 0;
}
export function rngFromKey(key: string) {
  return mulberry32(hashSeed(key || 'tg'));
}
function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}
function shuffle<T>(rng: () => number, arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* -------------------- Equipment filter (TG assumed present) -------------------- */
function normEq(x: Equipment | string): string {
  return String(x).toLowerCase().replace(/\s|_/g, '');
}
function hasEquipmentTG(m: Movement, user: Set<Equipment>): boolean {
  const req = (m.equipment ?? []) as Equipment[];
  if (!req.length) return true;

  // Always assume Total Gym is present for TG workouts
  const userNorm = new Set(Array.from(user).map(normEq));
  userNorm.add('totalgym');

  return req.every((eq) => userNorm.has(normEq(eq)));
}

/* -------------------- Utility: groups / soreness -------------------- */
function groupsFromMovement(m: Movement): Set<MuscleGroup> {
  const used = (m.usedMuscleGroups ?? []) as MuscleGroup[];
  const strained = (m.strainedMuscleGroups ?? []) as MuscleGroup[];
  const gs = used.length ? used : strained.length ? strained : (['core'] as MuscleGroup[]);
  return new Set<MuscleGroup>(gs);
}
function strainedFromMovement(m: Movement): Set<MuscleGroup> {
  const strained = (m.strainedMuscleGroups ?? []) as MuscleGroup[];
  return new Set<MuscleGroup>(strained.length ? strained : (['core'] as MuscleGroup[]));
}
function avoidSore(m: Movement, sore: Set<MuscleGroup>) {
  const used = new Set<MuscleGroup>([
    ...((m.strainedMuscleGroups ?? []) as MuscleGroup[]),
    ...((m.usedMuscleGroups ?? []) as MuscleGroup[]),
  ]);
  for (const g of used) if (sore.has(g)) return false;
  return true;
}
function primaryGroupFromMovement(m: Movement, sore: Set<MuscleGroup>): MuscleGroup {
  const used = (m.usedMuscleGroups ?? []) as MuscleGroup[];
  const strained = (m.strainedMuscleGroups ?? []) as MuscleGroup[];
  const fromUsed = used.find((g) => !sore.has(g));
  if (fromUsed) return fromUsed;
  if (used.length) return used[0] as MuscleGroup;
  const fromStrained = strained.find((g) => !sore.has(g));
  if (fromStrained) return fromStrained;
  return ((strained[0] as MuscleGroup) || ('core' as MuscleGroup)) as MuscleGroup;
}
function primaryGroupFromPair(a: Movement, b: Movement, sore: Set<MuscleGroup>): MuscleGroup {
  const score = new Map<MuscleGroup, number>();
  const bump = (g: MuscleGroup, w = 1) => score.set(g, (score.get(g) || 0) + w);
  const preferList = (ms?: MuscleGroup[], weight = 2) => (ms ?? []).forEach((g) => bump(g as MuscleGroup, weight));

  const aUsed = a.usedMuscleGroups?.filter((g) => !sore.has(g as MuscleGroup));
  const bUsed = b.usedMuscleGroups?.filter((g) => !sore.has(g as MuscleGroup));
  const aStr = a.strainedMuscleGroups?.filter((g) => !sore.has(g as MuscleGroup));
  const bStr = b.strainedMuscleGroups?.filter((g) => !sore.has(g as MuscleGroup));

  preferList(aUsed as MuscleGroup[], 3);
  preferList(bUsed as MuscleGroup[], 3);
  preferList(aStr as MuscleGroup[], 1);
  preferList(bStr as MuscleGroup[], 1);

  if (score.size === 0) {
    preferList(a.usedMuscleGroups as MuscleGroup[], 2);
    preferList(b.usedMuscleGroups as MuscleGroup[], 2);
    preferList(a.strainedMuscleGroups as MuscleGroup[], 1);
    preferList(b.strainedMuscleGroups as MuscleGroup[], 1);
  }

  let best: MuscleGroup = 'core' as MuscleGroup;
  let bestVal = -1;
  for (const [g, v] of score) {
    if (v > bestVal) {
      best = g;
      bestVal = v;
    }
  }
  return best;
}

/* -------------------- Push / Pull classifier for TG -------------------- */
function isPushTG(m: Movement): boolean {
  const name = (m.name ?? '').toLowerCase();
  const p = (m.movementPattern ?? []) as string[];
  return (
      p.includes('horizontalPress') ||
      p.includes('verticalPress') ||
      /press|fly|push/.test(name)
  );
}
function isPullTG(m: Movement): boolean {
  const name = (m.name ?? '').toLowerCase();
  const p = (m.movementPattern ?? []) as string[];
  return p.includes('horizontalPull') || p.includes('verticalPull') || /row|pulldown|pull/.test(name);
}

/* -------------------- Reps & Incline helpers (no undefined) -------------------- */
function repsForTG(m: Movement, flavor: 'strength' | 'tempo' | 'cluster' | 'hiit'): number {
  const base = typeof m.amrapSetReps === 'number' && m.amrapSetReps > 0 ? m.amrapSetReps : 10;
  const hard = (m.difficulty ?? 3) >= 4;
  if (flavor === 'cluster') return hard ? Math.max(4, Math.floor(base * 0.6)) : Math.max(5, Math.floor(base * 0.7));
  if (flavor === 'tempo') return hard ? Math.max(8, Math.floor(base * 0.9)) : Math.max(10, Math.floor(base * 1.0));
  if (flavor === 'strength') return hard ? Math.max(6, Math.floor(base * 0.8)) : Math.max(8, Math.floor(base * 1.1));
  // hiit
  return hard ? Math.max(8, Math.floor(base * 0.9)) : Math.max(10, Math.floor(base * 1.0));
}
function chooseIncline(minutes: number, avgDiff: number, bias?: 'higher' | 'lower'): number {
  // Keep it between 3–8 always; bias by duration/difficulty
  let level: number;
  if (minutes <= 10) level = avgDiff >= 4 ? 7 : 6;
  else if (minutes <= 14) level = avgDiff >= 4 ? 6 : 5;
  else level = avgDiff >= 4 ? 6 : 4;
  if (bias === 'higher') level += 1;
  if (bias === 'lower') level -= 1;
  return Math.max(3, Math.min(8, level));
}

/* -------------------- Fallback builders (robustness) -------------------- */
function fallbackLift(minutes: number) {
  return {
    focus: 'core' as MuscleGroup,
    move: 'Squat Glide',
    scheme: `Every 2:00 for ${Math.max(3, Math.floor(minutes / 2))} sets: 15 reps @ incline L5`,
    minutes,
    difficulty: 2,
    groups: new Set<MuscleGroup>(['legs', 'glutes', 'core'] as MuscleGroup[]),
    strained: new Set<MuscleGroup>(['legs'] as MuscleGroup[]),
    note:
        'Goal: steady lower-body volume with clean positions. Cues: knees track over toes, ribs stacked, quiet return. Progress: raise incline if finishing early; lower if reps/positions slip.',
    movements: ['Squat Glide'],
  };
}
function fallbackHiit(minutes: number) {
  return {
    format: `AMRAP ${minutes} min`,
    minutes,
    blocks: ['Squat Glide × 12 @ L5', 'Cable Row × 10 @ L5', 'Cable Chest Press × 10 @ L5'],
    groups: new Set<MuscleGroup>(['legs', 'back', 'chest', 'core'] as MuscleGroup[]),
    note:
        'Goal: continuous conditioning. Pace steady, transitions quick, lockouts crisp. Scale by trimming reps or lowering incline to keep moving well.',
  };
}

/* ----------------------------------------------------------------------- */
/*                                generateLift                             */
/* ----------------------------------------------------------------------- */
export function generateLift({
                               key,
                               minutes,
                               sore,
                               equipment,
                             }: {
  key: string;
  minutes: number;
  sore: Set<MuscleGroup>;
  equipment: Set<Equipment>;
}) {
  const rng = rngFromKey(key);
  const all = (totalGym?.lifts ?? []).filter(Boolean) as Movement[];
  if (!all.length) return fallbackLift(minutes);

  // Equipment + soreness filtering (TG assumed present via hasEquipmentTG)
  let eqPool = all.filter((m) => hasEquipmentTG(m, equipment));
  if (!eqPool.length) eqPool = all.slice(); // fail-open if user deselects all extras
  const candidates = eqPool.filter((m) => avoidSore(m, sore));
  const pool = candidates.length ? candidates : eqPool;

  // Split by push/pull flavor
  const pushes = pool.filter(isPushTG);
  const pulls = pool.filter(isPullTG);

  // Average difficulty for incline pick
  const avgDiff = (pool.reduce((s, m) => s + (m.difficulty ?? 3), 0) / Math.max(pool.length, 1)) || 3;

  // Pattern weights by minutes (S1–S6)
  type Pattern = 'EMOM_AB' | 'E2MOM_AB' | 'BUILD' | 'TEMPO' | 'UNILAT_ALT' | 'CLUSTER';
  const weights: Array<[Pattern, number]> = [
    ['EMOM_AB', minutes >= 12 ? 0.28 : 0.18],
    ['E2MOM_AB', minutes >= 10 ? 0.24 : 0.16],
    ['BUILD', minutes >= 14 ? 0.18 : 0.10],
    ['TEMPO', 0.14],
    ['UNILAT_ALT', minutes >= 12 ? 0.10 : 0.06],
    ['CLUSTER', minutes >= 10 ? 0.06 : 0.04],
  ];
  const totalW = weights.reduce((s, [, w]) => s + w, 0);
  let r = rng() * totalW;
  let chosenPattern: Pattern = 'EMOM_AB';
  for (const [p, w] of weights) {
    r -= w;
    if (r <= 0) {
      chosenPattern = p;
      break;
    }
  }

  // Helper to ensure we always have a Movement
  const safePick = (arr: Movement[], alt?: Movement[]): Movement =>
      (arr.length ? arr[Math.floor(rng() * arr.length)] : (alt && alt.length ? alt[Math.floor(rng() * alt.length)] : pool[0]))!;

  // Unilateral helpers (name matches Single-Arm)
  const unilateralPulls = pool.filter((m) => /single[- ]?arm|unilateral/i.test(m.name) && isPullTG(m));
  const unilateralPushes = pool.filter((m) => /single[- ]?arm|unilateral/i.test(m.name) && isPushTG(m));

  if (chosenPattern === 'EMOM_AB' && (pushes.length || pulls.length)) {
    // S1: Push/Pull EMOM (odd/even)
    const push = safePick(pushes, pool);
    const pull = safePick(pulls, pool);
    const odd = pull; // convention: odd = pull
    const even = push;
    const repsOdd = repsForTG(odd, 'strength');
    const repsEven = repsForTG(even, 'strength');
    const inc = chooseIncline(minutes, avgDiff);

    const groups = new Set<MuscleGroup>([...groupsFromMovement(odd), ...groupsFromMovement(even)]);
    const strained = new Set<MuscleGroup>([...strainedFromMovement(odd), ...strainedFromMovement(even)]);

    return {
      focus: primaryGroupFromPair(even, odd, sore),
      move: `${even.name} / ${odd.name}`,
      scheme: `EMOM ${minutes} (odd/even) @ incline L${inc}`,
      minutes,
      difficulty: Math.max(odd.difficulty ?? 3, even.difficulty ?? 3),
      oddEven: { odd: { name: odd.name, reps: repsOdd }, even: { name: even.name, reps: repsEven } },
      groups,
      strained,
      note:
          'Goal: balanced push/pull volume with built-in recovery. Work 20–40s, breathe the rest. Shoulders packed on pulls; soft, full lockouts on presses.',
      movements: [even.name, odd.name],
    };
  }

  if (chosenPattern === 'E2MOM_AB') {
    // S2: E2MOM Superset (A/B)
    const A = safePick(pool);
    let B = safePick(pool);
    if (B === A && pool.length > 1) B = safePick(pool.filter((m) => m !== A));
    const sets = Math.max(3, Math.floor(minutes / 2));
    const repsA = repsForTG(A, 'strength');
    const repsB = repsForTG(B, 'strength');
    const inc = chooseIncline(minutes, avgDiff);

    const groups = new Set<MuscleGroup>([...groupsFromMovement(A), ...groupsFromMovement(B)]);
    const strained = new Set<MuscleGroup>([...strainedFromMovement(A), ...strainedFromMovement(B)]);

    return {
      focus: primaryGroupFromPair(A, B, sore),
      move: `${A.name} / ${B.name}`,
      scheme: `Every 2:00 for ${sets} sets: A × ${repsA}, then B × ${repsB} @ incline L${inc}`,
      minutes,
      difficulty: Math.max(A.difficulty ?? 3, B.difficulty ?? 3),
      groups,
      strained,
      note:
          'Goal: paired strength with short rest. Start each window with A then B; finish with ~20–30s to spare. Control the down; adjust incline or reps to keep quality.',
      movements: [A.name, B.name],
    };
  }

  if (chosenPattern === 'BUILD') {
    // S3: Progressive Incline Build (single movement)
    const main = safePick(pool);
    const groups = groupsFromMovement(main);
    const strained = strainedFromMovement(main);
    return {
      focus: primaryGroupFromMovement(main, sore),
      move: main.name,
      scheme: 'Build to a challenging incline (4–6 sets of 8–10 reps)',
      minutes,
      difficulty: main.difficulty ?? 3,
      groups,
      strained,
      note:
          'Goal: strength focus via incline. Add 1 level while reps and speed stay clean; last set ~RPE 8. Quiet return—no bounce.',
      movements: [main.name],
    };
  }

  if (chosenPattern === 'TEMPO') {
    // S4: Tempo Strength
    const main = safePick(pool);
    const reps = repsForTG(main, 'tempo');
    const inc = chooseIncline(minutes, avgDiff, 'lower');
    return {
      focus: primaryGroupFromMovement(main, sore),
      move: main.name,
      scheme: `3–1–3 tempo, 4×${reps} @ incline L${inc}`,
      minutes,
      difficulty: (main.difficulty ?? 3) + 1,
      groups: groupsFromMovement(main),
      strained: strainedFromMovement(main),
      note:
          'Goal: control & tendon time-under-tension. Own every count, breathe out on effort, neck neutral. Drop incline if tempo breaks.',
      movements: [main.name],
    };
  }

  if (chosenPattern === 'UNILAT_ALT' && (unilateralPulls.length || unilateralPushes.length)) {
    // S5: Unilateral Alternating (minute-by-minute per side)
    const uniPull = unilateralPulls.length ? safePick(unilateralPulls) : safePick(pulls.length ? pulls : pool);
    const uniPush = unilateralPushes.length ? safePick(unilateralPushes) : safePick(pushes.length ? pushes : pool);
    const inc = chooseIncline(minutes, avgDiff);
    const reps = Math.max(8, Math.floor(repsForTG(uniPull, 'strength') * 0.9));

    const groups = new Set<MuscleGroup>([...groupsFromMovement(uniPull), ...groupsFromMovement(uniPush)]);
    const strained = new Set<MuscleGroup>([...strainedFromMovement(uniPull), ...strainedFromMovement(uniPush)]);

    return {
      focus: primaryGroupFromPair(uniPush, uniPull, sore),
      move: `${uniPush.name} / ${uniPull.name} (Unilateral)`,
      scheme: `Alt. each minute — Left/Right (${reps}/side) @ incline L${inc}`,
      minutes,
      difficulty: Math.max(uniPull.difficulty ?? 3, uniPush.difficulty ?? 3),
      groups,
      strained,
      note:
          'Goal: even L/R strength and stability. Alternate sides; match reps per side. Square ribs/hips; avoid trunk rotation.',
      movements: [uniPush.name, uniPull.name],
    };
  }

  if (chosenPattern === 'CLUSTER') {
    // S6: Cluster Sets
    const main = safePick(pool);
    const reps = repsForTG(main, 'cluster');
    const inc = chooseIncline(minutes, avgDiff, 'higher');
    return {
      focus: primaryGroupFromMovement(main, sore),
      move: main.name,
      scheme: `4 clusters: (${reps}-${reps}-${reps}) @ incline L${inc}, :20 between minis, 2:00 between clusters`,
      minutes,
      difficulty: (main.difficulty ?? 3) + 1,
      groups: groupsFromMovement(main),
      strained: strainedFromMovement(main),
      note:
          'Goal: near-strength output with mini-rests. Explode up, control down; exact :20s between minis. Lower incline or reps if speed/positions fade.',
      movements: [main.name],
    };
  }

  // Fallback (should rarely hit)
  return fallbackLift(minutes);
}

/* ----------------------------------------------------------------------- */
/*                               generateHiit                              */
/* ----------------------------------------------------------------------- */
export function generateHiit({
                               key,
                               minutes,
                               equipment,
                             }: {
  key: string;
  minutes: number;
  equipment: Set<Equipment>;
}) {
  const rng = rngFromKey(key);
  const all = (totalGym?.hiitMovements ?? []).filter(Boolean) as Movement[];
  if (!all.length) return fallbackHiit(minutes);

  // Equipment filtering (TG assumed present)
  let pool = all.filter((m) => hasEquipmentTG(m, equipment));
  if (!pool.length) pool = all.slice(); // fail-open

  const diff = (m: Movement) => m.difficulty ?? 3;
  const hitsGrip = (m: Movement) => (m.usedMuscleGroups ?? []).includes('grip' as MuscleGroup);

  // Choose number of stations by duration
  const stations = minutes <= 5 ? 2 : minutes <= 10 ? 3 : Math.min(5, Math.round(minutes / 4));

  // Scheme weights (I1–I7)
  type Scheme = 'EMOM' | 'AMRAP' | 'FORTIME' | 'LADDER' | 'INTERVALS' | 'OT2' | 'CHIPPER';
  const weights: Array<[Scheme, number]> = [
    ['EMOM', minutes >= 10 ? 0.27 : 0.22],
    ['AMRAP', 0.24],
    ['FORTIME', minutes >= 10 ? 0.12 : 0.08],
    ['LADDER', minutes >= 14 ? 0.12 : 0.06],
    ['INTERVALS', minutes <= 12 ? 0.14 : 0.10],
    ['OT2', minutes >= 10 ? 0.07 : 0.05],
    ['CHIPPER', minutes >= 16 ? 0.04 : 0.03],
  ];
  const totalW = weights.reduce((s, [, w]) => s + w, 0);
  let r = rng() * totalW;
  let scheme: Scheme = 'EMOM';
  for (const [p, w] of weights) {
    r -= w;
    if (r <= 0) {
      scheme = p;
      break;
    }
  }

  // Difficulty-aware pick with grip spacing
  function pickBalanced(n: number) {
    const c = shuffle(rng, pool).slice();
    const out: Movement[] = [];
    let veryHard = 0;
    while (out.length < n && c.length) {
      const m = c.shift()!;
      const hard = diff(m) >= 5;
      const backToBackGrip = out.length && hitsGrip(out[out.length - 1]) && hitsGrip(m);
      const hardCap = scheme === 'EMOM' || scheme === 'OT2' ? 1 : 2;
      if (hard && veryHard >= hardCap) continue;
      if ((scheme === 'EMOM' || scheme === 'OT2') && backToBackGrip) continue;
      out.push(m);
      if (hard) veryHard++;
    }
    if (out.length < n) {
      const rest = pool.filter((x) => !out.includes(x)).slice().sort((a, b) => diff(a) - diff(b));
      out.push(...rest.slice(0, n - out.length));
    }
    return out.slice(0, n);
  }

  const chosen = pickBalanced(stations);
  const avgDiff = (chosen.reduce((s, m) => s + (m.difficulty ?? 3), 0) / Math.max(chosen.length, 1)) || 3;
  const inc = chooseIncline(minutes, avgDiff);

  // Build blocks by scheme
  let format = '';
  let blocks: string[] = [];
  let note = '';

  if (scheme === 'EMOM') {
    format = `EMOM ${minutes}`;
    blocks = chosen.map((m) => `${m.name} — ${repsForTG(m, 'hiit')} reps @ L${inc}`);
    note =
        'Goal: repeatable efforts. Finish work in 20–40s; adjust incline/reps to hold pace. Quiet board, crisp positions.';
  } else if (scheme === 'AMRAP') {
    format = `AMRAP ${minutes} min`;
    blocks = chosen.map((m) => `${m.name} × ${repsForTG(m, 'hiit')} @ L${inc}`);
    note =
        'Goal: steady work. Short transitions and clean reps. Trim 1–2 reps or lower incline to keep moving well.';
  } else if (scheme === 'FORTIME') {
    format = `For Time (${minutes} min cap)`;
    const scale = minutes <= 12 ? 3 : 4;
    blocks = chosen.map((m) => {
      const reps = Math.max(8, Math.round((repsForTG(m, 'hiit') * scale) / Math.max(1, chosen.length - 1)));
      return `${m.name} × ${reps} @ L${inc}`;
    });
    note =
        'Goal: complete work quickly, cleanly. Partition early; tighten transitions. Lower incline/rep targets if you hit the cap.';
  } else if (scheme === 'LADDER') {
    const ladder = minutes >= 18 && rng() < 0.5 ? '10-9-8-7-6-5-4-3-2-1' : '21-15-9';
    format = `For Time: ${ladder}`;
    blocks = chosen.map((m) => `${m.name} @ L${inc}`);
    note =
        'Goal: descend as fatigue rises. Pace early sets; clean positions, quiet return. Speed up once reps drop.';
  } else if (scheme === 'INTERVALS') {
    const opts =
        minutes <= 10 ? ([ [30, 30], [40, 20], [20, 10] ] as const) : ([ [40, 20], [45, 15], [30, 30] ] as const);
    const [work, rest] = opts[Math.floor(rng() * opts.length)];
    const rounds = Math.max(4, Math.floor((minutes * 60) / (work + rest)));
    format = `Intervals ${work}:${rest} × ${rounds} — A/B`;
    const aLines = chosen.map((m) => `A: ${m.name} @ L${inc}`);
    // pick a "go-to": simplest movement (lowest diff) in pool
    const goTo = pool.slice().sort((a, b) => (a.difficulty ?? 3) - (b.difficulty ?? 3))[0] || chosen[0];
    const bLine = `B: ${goTo.name} @ L${inc}`;
    blocks = [...aLines, bLine];
    note =
        'Goal: quality bursts with prescribed rest. Alternate A with simple B. If fading late, reduce A reps or incline.';
  } else if (scheme === 'OT2') {
    const period = minutes <= 10 ? 90 : 120;
    const rounds = Math.max(3, Math.floor((minutes * 60) / period));
    format = `On the ${period / 60 === 2 ? '2:00' : '1:30'} × ${rounds} rounds`;
    blocks = chosen.map((m) => `${m.name} × ${repsForTG(m, 'hiit')} @ L${inc}`);
    note =
        'Goal: consistent round times with earned rest. Aim to finish 20–30s early; adjust reps/incline if times drift.';
  } else {
    // CHIPPER
    format = `Chipper (${minutes} min cap)`;
    blocks = chosen.map((m, i) => {
      const mult = 6 - Math.min(i + 1, 5); // 5,4,3,2,1
      const reps = Math.max(12, repsForTG(m, 'hiit') * mult);
      return `${m.name} × ${reps} @ L${inc}`;
    });
    note =
        'Goal: finish each station before the next. Break big sets early; keep breathing rhythm. Short shake-outs over sloppy reps.';
  }

  const groups = new Set<MuscleGroup>(chosen.flatMap((m) => m.usedMuscleGroups || []));
  return { format, minutes, blocks, groups, note };
}

/* ----------------------------------------------------------------------- */
/*                                 buildPrep                               */
/* ----------------------------------------------------------------------- */
export function buildPrep({
                            lift,
                            hiit,
                          }: {
  lift:
      | {
    focus: MuscleGroup;
    move: string;
    scheme: string;
    minutes: number;
    difficulty: number;
    groups: Set<MuscleGroup>;
    strained: Set<MuscleGroup>;
    note?: string;
    oddEven?: { odd: { name: string; reps: number }; even: { name: string; reps: number } };
  }
      | null;
  hiit:
      | { format: string; minutes: number; blocks: string[]; groups: Set<MuscleGroup>; note?: string }
      | null;
}) {
  const primary = new Set<MuscleGroup>();
  const weighted = new Map<MuscleGroup, number>();

  if (lift) {
    lift.groups.forEach((g) => weighted.set(g, Math.max(weighted.get(g) || 0, 1)));
    lift.strained.forEach((g) => weighted.set(g, Math.max(weighted.get(g) || 0, 2)));
    lift.groups.forEach((g) => primary.add(g));
    lift.strained.forEach((g) => primary.add(g));
  } else if (hiit) {
    hiit.groups.forEach((g) => {
      primary.add(g);
      weighted.set(g, 1);
    });
  }

  const score = (gs: MuscleGroup[]) => gs.reduce((s, g) => s + (weighted.get(g) || 0), 0);

  const warm = [...(prepLibrary?.warmups ?? [])]
      .sort((a, b) => score(b.groups) - score(a.groups))
      .slice(0, 3)
      .map((x) => x.name);

  const cool = [...(prepLibrary?.cooldowns ?? [])]
      .sort((a, b) => score(b.groups) - score(a.groups))
      .slice(0, 2)
      .map((x) => x.name);

  return { warmup: warm, cooldown: cool, primary };
}
