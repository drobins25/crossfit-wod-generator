export type Equipment =
  | "barbell" | "plates" | "rack" | "kettlebell" | "dumbbell" | "bench"
  | "pullUpBar" | "gymnasticRings" | "wallTarget" | "medicineBall" | "jumpRope"
  | "plyoBox" | "rower" | "skiErg" | "airBike" | "sandbag" | "sled"

export const EQUIPMENT_LABEL: Record<Equipment,string> = {
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
  skiErg: "SkiErg",
  airBike: "Air Bike",
  sandbag: "Sandbag",
  sled: "Sled"
}

export const ALL_EQUIPMENT: Equipment[] = Object.keys(EQUIPMENT_LABEL) as Equipment[]

export type MovementPattern =
  | "squat" | "bilateral" | "kneeDominant" | "overhead" | "hinge" | "hipDominant"
  | "tripleExtension" | "hipHinge" | "pull" | "squatCatch" | "wideGripPull"
  | "overheadCatch" | "overheadSquatCatch" | "dipDrive" | "overheadLockout"
  | "splitStanceCatch" | "verticalPress" | "verticalPull" | "horizontalPress"
  | "horizontalPull" | "frontSquatToPress" | "compound" | "uprightPull"
  | "overheadSwing" | "eyeLevelSwing" | "singleArmOverhead" | "transition"
  | "hingeIsometric" | "overheadCatchPartial" | "dipDriveOptional" | "lunge"
  | "unilateralAlternating" | "squatToThrow" | "bodyweight"

export type MuscleGroup =
  | "quadriceps" | "glutes" | "hamstrings" | "core" | "calves" | "upperBack"
  | "shoulders" | "back" | "grip" | "posteriorChain" | "legs" | "arms"
  | "adductors" | "triceps" | "chest"

export const MUSCLE_LABEL: Record<MuscleGroup,string> = {
  quadriceps:"Quadriceps", glutes:"Glutes", hamstrings:"Hamstrings", core:"Core",
  calves:"Calves", upperBack:"Upper Back", shoulders:"Shoulders", back:"Back",
  grip:"Grip/Forearms", posteriorChain:"Posterior Chain", legs:"Legs", arms:"Arms",
  adductors:"Adductors", triceps:"Triceps", chest:"Chest"
}

export const ALL_MUSCLE_GROUPS: MuscleGroup[] = Object.keys(MUSCLE_LABEL) as MuscleGroup[]

export interface Movement {
  id: string
  name: string
  equipment: Equipment[]
  movementPattern: MovementPattern[]
  strainedMuscleGroups?: MuscleGroup[]
  usedMuscleGroups?: MuscleGroup[]
  emomOk?: boolean
  amrapSetReps?: number
  difficulty?: 1|2|3|4|5
}

export interface WodLifts { lifts: Movement[]; hiitMovements: Movement[] }
export interface MiniMovement { name: string; groups: MuscleGroup[] }
export interface PrepLibrary { warmups: MiniMovement[]; cooldowns: MiniMovement[] }
