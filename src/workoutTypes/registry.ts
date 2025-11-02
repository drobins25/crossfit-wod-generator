import type { Equipment, MuscleGroup } from '../types/WodMovements';

export type LiftLike = {
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
export type HiitLike = {
  format: string;
  minutes: number;
  blocks: string[];
  groups: Set<MuscleGroup>;
  note?: string;
}
export type PrepResultLike = { warmup: string[] | null; cooldown: string[] | null; primary: Set<MuscleGroup> }
export type GeneratorsApi = {
  generateLift: (args: { key: string; minutes: number; sore: Set<MuscleGroup>; equipment: Set<Equipment> }) => LiftLike;
  generateHiit: (args: { key: string; minutes: number; equipment: Set<Equipment> }) => HiitLike;
  buildPrep: (args: { lift: LiftLike | null; hiit: HiitLike | null }) => PrepResultLike;
}

import type { WorkoutType } from './context';

// CrossFit generators (existing)
import * as CrossfitGen from '../whiteboard/generatorCrossfit';

// Total Gym & Chair Yoga generators (new modules that mirror generator with different datasets)
import * as TGGen from '../whiteboard/generatorTotalGym';
import * as CYGen from '../whiteboard/generatorChairYoga';

// Equipment whitelists per type
// CrossFit uses ALL equipment from WodMovements via labels; we'll derive live in Controls.
// For Total Gym / Chair Yoga we define curated sets compatible with shared Equipment union.
export function getEquipmentForType(t: WorkoutType): Equipment[] {
  switch (t) {
    case 'totalGym':
      const TG: Equipment[] = [
        'totalGym',
        'dumbbell',
        'bench',
        'resistanceBands',
        'squatStand',
        'dipBars',
        'treadmill',
        'stationaryBike',
      ];
      return TG;
    case 'chair-yoga':
      return [
        'chair','yogaMat','yogaStrap','yogaBlocks','resistanceBands'
      ] as Equipment[];
    case 'crossfit':
      return [
        'barbell','plates','rack','kettlebell','dumbbell','bench',
        'pullUpBar','gymnasticRings','wallTarget','medicineBall','resistanceBands','jumpRope',
        'plyoBox','rower','skiErg','airBike','sandbag','sled','squatStand','dipBars'
      ] as Equipment[];
    default:
      // Controls will use ALL_EQUIPMENT for crossfit
      // Return empty array here to signal "use full list"
      return [] as Equipment[];
  }
}

export function getGeneratorsForType(t: WorkoutType): GeneratorsApi {
  switch (t) {
    case 'totalGym':
      return {
        generateLift: TGGen.generateLift as GeneratorsApi['generateLift'],
        generateHiit: TGGen.generateHiit as GeneratorsApi['generateHiit'],
        buildPrep: TGGen.buildPrep as GeneratorsApi['buildPrep'],
      }
    case 'chair-yoga':
      return {
        generateLift: CYGen.generateLift as GeneratorsApi['generateLift'],
        generateHiit: CYGen.generateHiit as GeneratorsApi['generateHiit'],
        buildPrep: CYGen.buildPrep as GeneratorsApi['buildPrep'],
      }
    case 'crossfit':
    default:
      return {
        generateLift: CrossfitGen.generateLift as GeneratorsApi['generateLift'],
        generateHiit: CrossfitGen.generateHiit as GeneratorsApi['generateHiit'],
        buildPrep: CrossfitGen.buildPrep as GeneratorsApi['buildPrep'],
      }
  }
}

const SESSION_LABELS: Record<
    WorkoutType,
    { typeLabel: string; liftLabel: string; hiitLabel: string }
> = {
  crossfit:   { typeLabel: 'CrossFit',   liftLabel: 'Lift',     hiitLabel: 'HIIT' },
  totalGym:   { typeLabel: 'Total Gym',  liftLabel: 'Strength', hiitLabel: 'Intervals' },
  'chair-yoga': { typeLabel: 'Chair Yoga', liftLabel: 'Mobility', hiitLabel: 'Flow' },
};

export function getSessionLabels(type: WorkoutType) {
  return SESSION_LABELS[type];
}

// ⬇️ add this so the Controls buttons come from the same source:
export function getWorkoutTypeOptions() {
  return (Object.keys(SESSION_LABELS) as WorkoutType[]).map((id) => ({
    id,
    label: SESSION_LABELS[id].typeLabel,
  }));
}
