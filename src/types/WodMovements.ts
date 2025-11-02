// src/types/WodMovements.ts

export type Equipment =
    | "barbell" | "plates" | "rack" | "kettlebell" | "dumbbell" | "bench"
    | "pullUpBar" | "gymnasticRings" | "wallTarget" | "medicineBall" | "resistanceBands" | "jumpRope"
    | "plyoBox" | "rower" | "skiErg" | "airBike" | "sandbag" | "sled"
    | "squatStand" | "totalGym" | "dipBars"
    | "chair" | "yogaMat" | "yogaStrap" | "yogaBlocks"
    | "treadmill" | "stationaryBike"; // NEW

export const EQUIPMENT_LABEL: Record<Equipment, string> = {
  barbell: "Barbell",
  plates: "Plates",
  rack: "Squat Rack",
  kettlebell: "Kettlebell",
  dumbbell: "Dumbbell",
  bench: "Bench",
  pullUpBar: "Pull-up Bar",
  gymnasticRings: "Gymnastic Rings",
  wallTarget: "Wall Target",
  medicineBall: "Medicine Ball",
  jumpRope: "Jump Rope",
  plyoBox: "Plyo Box",
  rower: "Rower",
  skiErg: "Ski Erg",
  airBike: "Air Bike",
  sandbag: "Sandbag",
  sled: "Sled",
  squatStand: "Squat Stand",
  resistanceBands: "Resistance Bands",
  totalGym: "Total Gym",
  dipBars: "Dip Bars",
  chair: "Chair",
  yogaMat: "Yoga Mat",
  yogaStrap: "Yoga Strap",
  yogaBlocks: "Yoga Blocks",
  treadmill: "Treadmill",          // NEW
  stationaryBike: "Stationary Bike" // NEW
}

export const ALL_EQUIPMENT: Equipment[] = Object.keys(EQUIPMENT_LABEL) as Equipment[];

export type MovementPattern =
    | "squat" | "bilateral" | "kneeDominant" | "overhead" | "hinge" | "hipDominant"
    | "tripleExtension" | "hipHinge" | "pull" | "squatCatch" | "wideGripPull"
    | "overheadCatch" | "overheadSquatCatch" | "dipDrive" | "overheadLockout"
    | "splitStanceCatch" | "verticalPress" | "verticalPull" | "horizontalPress"
    | "horizontalPull" | "frontSquatToPress" | "compound" | "uprightPull"
    | "overheadSwing" | "eyeLevelSwing" | "singleArmOverhead" | "transition"
    | "hingeIsometric" | "overheadCatchPartial" | "dipDriveOptional" | "lunge"
    | "unilateralAlternating" | "squatToThrow" | "bodyweight"
    // NEW patterns used in Total Gym data/generators:
    | "unilateral" | "isolation" | "rotation" | "antiRotation" | "locomotion" | "flexion";

export type MuscleGroup =
    | "quadriceps" | "adductors" | "glutes" | "hamstrings" | "core" | "calves" | "upperBack"
    | "shoulders" | "back" | "grip" | "posteriorChain" | "legs" | "arms"
    | "biceps" | "triceps" | "chest" | "lats" | "forearms" | "hips" | "spine" | "neck"
    // NEW groups used in TG data:
    | "hipFlexors" | "rearDelts";

export const ALL_MUSCLE_GROUPS: MuscleGroup[] = [
  "quadriceps","adductors","glutes","hamstrings","core","calves","upperBack",
  "shoulders","back","grip","posteriorChain","legs","arms",
  "biceps","triceps","chest","lats","forearms","hips","spine","neck",
  // NEW
  "hipFlexors","rearDelts"
];

export const MUSCLE_LABEL: Record<MuscleGroup, string> = {
  adductors: "Adductors",
  quadriceps: "Quads",
  glutes: "Glutes",
  hamstrings: "Hamstrings",
  core: "Core",
  calves: "Calves",
  upperBack: "Upper Back",
  shoulders: "Shoulders",
  back: "Back",
  grip: "Grip",
  posteriorChain: "Posterior Chain",
  legs: "Legs",
  arms: "Arms",
  biceps: "Biceps",
  triceps: "Triceps",
  chest: "Chest",
  lats: "Lats",
  forearms: "Forearms",
  hips: "Hips",
  spine: "Spine",
  neck: "Neck",
  hipFlexors: "Hip Flexors", // NEW
  rearDelts: "Rear Delts"    // NEW
};

export type Movement = {
  id: string;
  name: string;
  equipment: Equipment[];
  movementPattern: MovementPattern[];
  usedMuscleGroups?: MuscleGroup[];
  strainedMuscleGroups?: MuscleGroup[];
  emomOk?: boolean;
  amrapSetReps?: number;
  difficulty?: number;
};

export type WodLifts = {
  lifts: Movement[];
  hiitMovements: Movement[];
};

export type PrepLibrary = {
  warmups: { name: string; groups: MuscleGroup[] }[];
  cooldowns: { name: string; groups: MuscleGroup[] }[];
};
