import type { WodLifts, PrepLibrary } from '../types/WodMovements'

export const totalGym: WodLifts = {
  lifts: [
    // ---- CHEST / PUSH ----
    {
      id: 'tg_chestPress',
      name: 'Total Gym Chest Press',
      equipment: ['totalGym'],
      movementPattern: ['horizontalPress','bilateral'],
      usedMuscleGroups: ['chest','triceps','shoulders'],
      strainedMuscleGroups: ['chest','triceps'],
      difficulty: 2,
      emomOk: true,
      amrapSetReps: 10
    },
    {
      id: 'tg_inclineChestPress',
      name: 'Incline Chest Press',
      equipment: ['totalGym'],
      movementPattern: ['verticalPress','bilateral'],
      usedMuscleGroups: ['chest','shoulders','triceps'],
      strainedMuscleGroups: ['chest'],
      difficulty: 3,
      emomOk: true,
      amrapSetReps: 8
    },
    {
      id: 'tg_singleArmChestPress',
      name: 'Single-Arm Chest Press',
      equipment: ['totalGym'],
      movementPattern: ['horizontalPress','unilateral'],
      usedMuscleGroups: ['chest','triceps','shoulders','core'],
      strainedMuscleGroups: ['chest'],
      difficulty: 3,
      emomOk: true,
      amrapSetReps: 8
    },
    {
      id: 'tg_chestFly',
      name: 'Cable Chest Fly',
      equipment: ['totalGym'],
      movementPattern: ['horizontalPress','isolation'],
      usedMuscleGroups: ['chest','shoulders'],
      strainedMuscleGroups: ['chest'],
      difficulty: 2,
      amrapSetReps: 12
    },

    // ---- BACK / PULL ----
    {
      id: 'tg_seatedRow',
      name: 'Seated Cable Row',
      equipment: ['totalGym'],
      movementPattern: ['horizontalPull','bilateral'],
      usedMuscleGroups: ['back','biceps','shoulders','core'],
      strainedMuscleGroups: ['back','biceps'],
      difficulty: 2,
      emomOk: true,
      amrapSetReps: 10
    },
    {
      id: 'tg_highRow',
      name: 'High Row',
      equipment: ['totalGym'],
      movementPattern: ['horizontalPull','bilateral'],
      usedMuscleGroups: ['back','rearDelts','biceps'],
      strainedMuscleGroups: ['back','rearDelts'],
      difficulty: 3,
      emomOk: true,
      amrapSetReps: 10
    },
    {
      id: 'tg_lowRow',
      name: 'Low Row',
      equipment: ['totalGym'],
      movementPattern: ['horizontalPull','bilateral'],
      usedMuscleGroups: ['back','biceps','core'],
      strainedMuscleGroups: ['back'],
      difficulty: 2,
      amrapSetReps: 12
    },
    {
      id: 'tg_latPulldown',
      name: 'Lat Pulldown (on TG)',
      equipment: ['totalGym'],
      movementPattern: ['verticalPull','bilateral'],
      usedMuscleGroups: ['back','biceps','shoulders'],
      strainedMuscleGroups: ['back','biceps'],
      difficulty: 3,
      emomOk: true,
      amrapSetReps: 8
    },
    {
      id: 'tg_singleArmRow',
      name: 'Single-Arm Row',
      equipment: ['totalGym'],
      movementPattern: ['horizontalPull','unilateral'],
      usedMuscleGroups: ['back','biceps','core'],
      strainedMuscleGroups: ['back'],
      difficulty: 3,
      amrapSetReps: 10
    },
    {
      id: 'tg_rearDeltFly',
      name: 'Rear Delt Fly',
      equipment: ['totalGym'],
      movementPattern: ['horizontalPull','isolation'],
      usedMuscleGroups: ['upperBack','rearDelts'],
      strainedMuscleGroups: ['upperBack'],
      difficulty: 3,
      amrapSetReps: 12
    },

    // ---- SHOULDERS ----
    {
      id: 'tg_shoulderPress',
      name: 'Shoulder Press',
      equipment: ['totalGym'],
      movementPattern: ['verticalPress','bilateral'],
      usedMuscleGroups: ['shoulders','triceps','core'],
      strainedMuscleGroups: ['shoulders','triceps'],
      difficulty: 3,
      emomOk: true,
      amrapSetReps: 8
    },
    {
      id: 'tg_lateralRaise',
      name: 'Lateral Raise (on TG)',
      equipment: ['totalGym'],
      movementPattern: ['isolation'],
      usedMuscleGroups: ['shoulders','core'],
      strainedMuscleGroups: ['shoulders'],
      difficulty: 2,
      amrapSetReps: 12
    },
    {
      id: 'tg_frontRaise',
      name: 'Front Raise (on TG)',
      equipment: ['totalGym'],
      movementPattern: ['isolation'],
      usedMuscleGroups: ['shoulders'],
      strainedMuscleGroups: ['shoulders'],
      difficulty: 2,
      amrapSetReps: 12
    },

    // ---- ARMS ----
    {
      id: 'tg_bicepsCurl',
      name: 'Cable Biceps Curl',
      equipment: ['totalGym'],
      movementPattern: ['isolation'],
      usedMuscleGroups: ['biceps','forearms'],
      strainedMuscleGroups: ['biceps'],
      difficulty: 2,
      amrapSetReps: 12
    },
    {
      id: 'tg_hammerCurl',
      name: 'Hammer Curl (on TG)',
      equipment: ['totalGym'],
      movementPattern: ['isolation'],
      usedMuscleGroups: ['biceps','forearms'],
      strainedMuscleGroups: ['biceps'],
      difficulty: 2,
      amrapSetReps: 10
    },
    {
      id: 'tg_tricepsPressdown',
      name: 'Cable Triceps Pressdown',
      equipment: ['totalGym'],
      movementPattern: ['isolation'],
      usedMuscleGroups: ['triceps','shoulders'],
      strainedMuscleGroups: ['triceps'],
      difficulty: 2,
      amrapSetReps: 12
    },
    {
      id: 'tg_ohTricepsExt',
      name: 'Overhead Triceps Extension',
      equipment: ['totalGym'],
      movementPattern: ['isolation'],
      usedMuscleGroups: ['triceps','shoulders','core'],
      strainedMuscleGroups: ['triceps'],
      difficulty: 3,
      amrapSetReps: 10
    },

    // ---- LEGS ----
    {
      id: 'tg_squat',
      name: 'Squat Glide',
      equipment: ['totalGym'],
      movementPattern: ['squat','bilateral','kneeDominant'],
      usedMuscleGroups: ['quadriceps','glutes','hamstrings','calves','core'],
      strainedMuscleGroups: ['quadriceps','glutes'],
      difficulty: 2,
      emomOk: true,
      amrapSetReps: 12
    },
    {
      id: 'tg_singleLegSquat',
      name: 'Single-Leg Squat Glide',
      equipment: ['totalGym'],
      movementPattern: ['squat','unilateral','kneeDominant'],
      usedMuscleGroups: ['quadriceps','glutes','hamstrings','calves','core'],
      strainedMuscleGroups: ['quadriceps','glutes'],
      difficulty: 3,
      amrapSetReps: 10
    },
    {
      id: 'tg_calfRaise',
      name: 'Calf Raise (on TG)',
      equipment: ['totalGym'],
      movementPattern: ['isolation'],
      usedMuscleGroups: ['calves'],
      strainedMuscleGroups: ['calves'],
      difficulty: 2,
      amrapSetReps: 15
    },
    {
      id: 'tg_hamstringCurl',
      name: 'Hamstring Curl (on TG)',
      equipment: ['totalGym'],
      movementPattern: ['hinge','isolation'],
      usedMuscleGroups: ['hamstrings','glutes'],
      strainedMuscleGroups: ['hamstrings'],
      difficulty: 3,
      amrapSetReps: 10
    },
    {
      id: 'tg_hipBridge',
      name: 'Hip Bridge on Glideboard',
      equipment: ['totalGym'],
      movementPattern: ['hinge','bilateral','hipDominant'],
      usedMuscleGroups: ['glutes','hamstrings','core'],
      strainedMuscleGroups: ['glutes','hamstrings'],
      difficulty: 2,
      amrapSetReps: 12
    },

    // ---- CORE / ROTATION ----
    {
      id: 'tg_kneelingCrunch',
      name: 'Kneeling Cable Crunch',
      equipment: ['totalGym'],
      movementPattern: ['flexion','isolation'],
      usedMuscleGroups: ['core'],
      strainedMuscleGroups: ['core'],
      difficulty: 2,
      emomOk: true,
      amrapSetReps: 12
    },
    {
      id: 'tg_pallof',
      name: 'Pallof Press (Anti-Rotation)',
      equipment: ['totalGym'],
      movementPattern: ['antiRotation','isolation'],
      usedMuscleGroups: ['core'],
      strainedMuscleGroups: ['core'],
      difficulty: 3,
      amrapSetReps: 12
    },
    {
      id: 'tg_woodchopHighLow',
      name: 'Cable Woodchop (High→Low)',
      equipment: ['totalGym'],
      movementPattern: ['rotation','unilateral'],
      usedMuscleGroups: ['core','shoulders','back'],
      strainedMuscleGroups: ['core'],
      difficulty: 3,
      amrapSetReps: 10
    },
    {
      id: 'tg_woodchopLowHigh',
      name: 'Cable Lift (Low→High)',
      equipment: ['totalGym'],
      movementPattern: ['rotation','unilateral'],
      usedMuscleGroups: ['core','shoulders','back'],
      strainedMuscleGroups: ['core'],
      difficulty: 3,
      amrapSetReps: 10
    },
    {
      id: 'tg_jackknife',
      name: 'Glideboard Jackknife',
      equipment: ['totalGym'],
      movementPattern: ['flexion','bodyweight'],
      usedMuscleGroups: ['core','hipFlexors'],
      strainedMuscleGroups: ['core'],
      difficulty: 3,
      amrapSetReps: 12
    },
    {
      id: 'tg_plankToPike',
      name: 'Plank to Pike (Glideboard)',
      equipment: ['totalGym'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['core','shoulders'],
      strainedMuscleGroups: ['core'],
      difficulty: 3,
      amrapSetReps: 10
    },

    // ---- OPTIONAL “EXTRAS” USING COMMON GYM GEAR (respected by filters) ----
    {
      id: 'db_floorPress_tg',
      name: 'Dumbbell Floor Press (on TG)',
      equipment: ['dumbbell'],
      movementPattern: ['horizontalPress','bilateral'],
      usedMuscleGroups: ['chest','triceps','shoulders'],
      strainedMuscleGroups: ['chest'],
      difficulty: 3,
      amrapSetReps: 10
    },
    {
      id: 'band_row_tg',
      name: 'Band-Assisted Row (on TG)',
      equipment: ['resistanceBands'],
      movementPattern: ['horizontalPull','bilateral'],
      usedMuscleGroups: ['back','biceps'],
      strainedMuscleGroups: ['back'],
      difficulty: 2,
      amrapSetReps: 12
    }
  ],

  hiitMovements: [
    // ---- TG BODYWEIGHT / SPEED REPS ----
    {
      id: 'tg_mountainClimbers',
      name: 'Incline Mountain Climbers (Glideboard)',
      equipment: ['totalGym'],
      movementPattern: ['bodyweight','locomotion'],
      usedMuscleGroups: ['core','shoulders','quadriceps','hipFlexors'],
      strainedMuscleGroups: ['core'],
      emomOk: true,
      difficulty: 2
    },
    {
      id: 'tg_row_sprint',
      name: 'Cable Row Sprints',
      equipment: ['totalGym'],
      movementPattern: ['horizontalPull'],
      usedMuscleGroups: ['back','biceps','core'],
      emomOk: true,
      difficulty: 3
    },
    {
      id: 'tg_press_sprint',
      name: 'Chest Press Speed Reps',
      equipment: ['totalGym'],
      movementPattern: ['horizontalPress'],
      usedMuscleGroups: ['chest','triceps','shoulders'],
      emomOk: true,
      difficulty: 3
    },
    {
      id: 'tg_squat_jump',
      name: 'Squat Glide Jumps',
      equipment: ['totalGym'],
      movementPattern: ['squat','tripleExtension'],
      usedMuscleGroups: ['quadriceps','glutes','calves','core'],
      difficulty: 3,
      emomOk: true
    },
    {
      id: 'tg_kneeTucks',
      name: 'Glideboard Knee Tucks',
      equipment: ['totalGym'],
      movementPattern: ['flexion','bodyweight'],
      usedMuscleGroups: ['core','hipFlexors'],
      difficulty: 3,
      emomOk: true
    },
    {
      id: 'tg_bearCrawl',
      name: 'Incline Bear Crawl (Glideboard)',
      equipment: ['totalGym'],
      movementPattern: ['bodyweight','locomotion'],
      usedMuscleGroups: ['shoulders','core','quadriceps'],
      difficulty: 3,
      emomOk: true
    },
    {
      id: 'tg_reverseLungeSlide',
      name: 'Reverse Lunge Slide (Alternating)',
      equipment: ['totalGym'],
      movementPattern: ['lunge','unilateral'],
      usedMuscleGroups: ['quadriceps','glutes','hamstrings','core'],
      difficulty: 2,
      emomOk: true
    },

    // ---- SIMPLE CORE “GO-TOs” (great for A/B intervals) ----
    {
      id: 'tg_kneelingCrunch_hiit',
      name: 'Kneeling Cable Crunch',
      equipment: ['totalGym'],
      movementPattern: ['flexion'],
      usedMuscleGroups: ['core'],
      difficulty: 2,
      emomOk: true
    },
    {
      id: 'tg_pallof_hiit',
      name: 'Pallof Press (Anti-Rotation)',
      equipment: ['totalGym'],
      movementPattern: ['antiRotation'],
      usedMuscleGroups: ['core'],
      difficulty: 3,
      emomOk: true
    },

    // ---- “EXTRAS” RESPECTING EQUIPMENT FILTERS ----
    {
      id: 'bands_squat_jump',
      name: 'Band-Assisted Squat Jumps',
      equipment: ['resistanceBands'],
      movementPattern: ['squat','tripleExtension'],
      usedMuscleGroups: ['quadriceps','glutes','calves','core'],
      difficulty: 3,
      emomOk: true
    },
    {
      id: 'db_thruster_tg',
      name: 'DB Thruster (light)',
      equipment: ['dumbbell'],
      movementPattern: ['squat','verticalPress'],
      usedMuscleGroups: ['quadriceps','glutes','shoulders','core'],
      difficulty: 3,
      emomOk: true
    },

    // ---- CARDIO ENGINES (treadmill / bike) ----
    {
      id: 'treadmill_run_200m',
      name: 'Treadmill Run (200 m)',
      equipment: ['treadmill'],
      movementPattern: ['locomotion'],
      usedMuscleGroups: ['quadriceps','hamstrings','glutes','calves','core'],
      difficulty: 2,
      emomOk: true
    },
    {
      id: 'treadmill_inclineWalk',
      name: 'Treadmill Incline Walk (Hard Effort)',
      equipment: ['treadmill'],
      movementPattern: ['locomotion'],
      usedMuscleGroups: ['quadriceps','glutes','calves','core'],
      difficulty: 2,
      emomOk: true
    },
    {
      id: 'bike_calories',
      name: 'Stationary Bike (Calories)',
      equipment: ['stationaryBike'],
      movementPattern: ['locomotion'],
      usedMuscleGroups: ['quadriceps','glutes','calves'],
      difficulty: 2,
      emomOk: true
    },
    {
      id: 'bike_sprint_20s',
      name: 'Stationary Bike Sprint (20s)',
      equipment: ['stationaryBike'],
      movementPattern: ['locomotion'],
      usedMuscleGroups: ['quadriceps','glutes','calves','core'],
      difficulty: 3,
      emomOk: true
    }
  ]
}

export const prepLibrary: PrepLibrary = {
  warmups: [
    { name: 'Glideboard mobility 2:00', groups: ['core','back'] },
    { name: 'Light cable rows ×15', groups: ['back','biceps'] },
    { name: 'Squat glide pulses ×20', groups: ['quadriceps','glutes'] },
    { name: 'Shoulder circles + band pull-aparts ×15', groups: ['shoulders','upperBack'] },
    { name: 'Pallof press holds :20/side', groups: ['core'] }
  ],
  cooldowns: [
    { name: 'Seated forward fold 1:00', groups: ['hamstrings','calves'] },
    { name: 'Doorway pec stretch 1:00/side', groups: ['chest','shoulders'] },
    { name: 'Figure-4 glute stretch 1:00/side', groups: ['glutes'] },
    { name: 'Lat stretch on post 1:00/side', groups: ['back','upperBack'] }
  ]
}
