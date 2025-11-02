import type { WodLifts, PrepLibrary } from '../types/WodMovements'

export const chairYoga: WodLifts = {
  lifts: [
    {
      id: 'cy_seatedCatCow',
      name: 'Seated Cat–Cow',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['spine','core','shoulders'],
      strainedMuscleGroups: ['spine'],
      difficulty: 1
    },
    {
      id: 'cy_seatedSideBend',
      name: 'Seated Side Bend',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['lats','shoulders','spine','core'],
      strainedMuscleGroups: ['lats','shoulders'],
      difficulty: 1
    },
    {
      id: 'cy_seatedTwist',
      name: 'Seated Spinal Twist',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['spine','back','core'],
      strainedMuscleGroups: ['spine'],
      difficulty: 1
    },
    {
      id: 'cy_figure4',
      name: 'Seated Figure-4 (Piriformis)',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['glutes','hips','core'],
      strainedMuscleGroups: ['glutes','hips'],
      difficulty: 1
    },
    {
      id: 'cy_hamFoldChair',
      name: 'Hamstring Fold (Foot on Chair)',
      equipment: ['chair','yogaMat'],
      movementPattern: ['hinge','bodyweight'],
      usedMuscleGroups: ['hamstrings','calves','spine'],
      strainedMuscleGroups: ['hamstrings'],
      difficulty: 1
    },
    {
      id: 'cy_hamFoldBlocks',
      name: 'Seated Forward Fold (Blocks / Strap)',
      equipment: ['chair','yogaMat','yogaBlocks','yogaStrap'],
      movementPattern: ['hinge','bodyweight'],
      usedMuscleGroups: ['hamstrings','spine','calves'],
      strainedMuscleGroups: ['hamstrings'],
      difficulty: 1
    },
    {
      id: 'cy_calfStretchChair',
      name: 'Calf Stretch at Chair',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['calves'],
      strainedMuscleGroups: ['calves'],
      difficulty: 1
    },
    {
      id: 'cy_chestOpenerChairBack',
      name: 'Chest Opener on Chair Back',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['chest','shoulders','upperBack'],
      strainedMuscleGroups: ['chest','shoulders'],
      difficulty: 1
    },
    {
      id: 'cy_wristFlexor',
      name: 'Wrist Flexor Stretch',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['forearms'],
      strainedMuscleGroups: ['forearms'],
      difficulty: 1
    },
    {
      id: 'cy_wristExtensor',
      name: 'Wrist Extensor Stretch',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['forearms'],
      strainedMuscleGroups: ['forearms'],
      difficulty: 1
    },
    {
      id: 'cy_thoracicOverChair',
      name: 'Thoracic Extension over Chair Back',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['upperBack','spine'],
      strainedMuscleGroups: ['upperBack'],
      difficulty: 1
    },
    {
      id: 'cy_neckSide',
      name: 'Seated Neck Side Bend',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['neck','shoulders'],
      strainedMuscleGroups: ['neck'],
      difficulty: 1
    },
    {
      id: 'cy_seatedHipFlexor',
      name: 'Seated Hip Flexor Stretch',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['hips','quadriceps'],
      strainedMuscleGroups: ['hips','quadriceps'],
      difficulty: 1
    },
    {
      id: 'cy_chairSquat',
      name: 'Chair Squats (to Stand)',
      equipment: ['chair','yogaMat'],
      movementPattern: ['squat','bodyweight'],
      usedMuscleGroups: ['quadriceps','glutes','core','hamstrings'],
      strainedMuscleGroups: ['quadriceps','glutes'],
      difficulty: 1
    },
    {
      id: 'cy_overheadReachStrap',
      name: 'Seated Overhead Reach (Strap Optional)',
      equipment: ['chair','yogaMat','yogaStrap'],
      movementPattern: ['verticalPress','bodyweight'],
      usedMuscleGroups: ['shoulders','upperBack','core'],
      strainedMuscleGroups: ['shoulders'],
      difficulty: 1
    }
  ],
  hiitMovements: [
    {
      id: 'cy_sunArms',
      name: 'Seated Sun-Arms',
      equipment: ['chair','yogaMat'],
      movementPattern: ['verticalPress','bodyweight'],
      usedMuscleGroups: ['shoulders','spine','core'],
      strainedMuscleGroups: ['shoulders'],
      emomOk: true,
      amrapSetReps: 6,
      difficulty: 1
    },
    {
      id: 'cy_swanDive',
      name: 'Swan-Dive to Fold (Seated)',
      equipment: ['chair','yogaMat'],
      movementPattern: ['hinge','bodyweight'],
      usedMuscleGroups: ['spine','hamstrings','core'],
      strainedMuscleGroups: ['hamstrings','spine'],
      emomOk: true,
      amrapSetReps: 6,
      difficulty: 1
    },
    {
      id: 'cy_halfLift',
      name: 'Half-Lift (Seated)',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['spine','upperBack','core'],
      strainedMuscleGroups: ['spine'],
      emomOk: true,
      amrapSetReps: 6,
      difficulty: 1
    },
    {
      id: 'cy_seatedMarch',
      name: 'Seated Marching',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['hips','legs','core'],
      strainedMuscleGroups: ['hips'],
      emomOk: true,
      amrapSetReps: 20,
      difficulty: 1
    },
    {
      id: 'cy_heelToe',
      name: 'Heel-Toe Raises',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['calves','legs'],
      strainedMuscleGroups: ['calves'],
      emomOk: true,
      amrapSetReps: 20,
      difficulty: 1
    },
    {
      id: 'cy_anklePumps',
      name: 'Ankle Pumps',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['calves','legs'],
      strainedMuscleGroups: ['calves'],
      emomOk: true,
      amrapSetReps: 30,
      difficulty: 1
    },
    {
      id: 'cy_twistFlow',
      name: 'Seated Twist Flow',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['spine','back','core'],
      strainedMuscleGroups: ['spine'],
      emomOk: true,
      amrapSetReps: 6,
      difficulty: 1
    },
    {
      id: 'cy_sideBendFlow',
      name: 'Side Bend Flow',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['lats','shoulders','spine'],
      strainedMuscleGroups: ['lats','shoulders'],
      emomOk: true,
      amrapSetReps: 6,
      difficulty: 1
    },
    {
      id: 'cy_catCowFlow',
      name: 'Cat–Cow Flow',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['spine','core','shoulders'],
      strainedMuscleGroups: ['spine'],
      emomOk: true,
      amrapSetReps: 8,
      difficulty: 1
    },
    {
      id: 'cy_supportedSLS',
      name: 'Supported Single-Leg Stand (Light Chair Contact)',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['calves','hips','core'],
      strainedMuscleGroups: ['calves','hips'],
      emomOk: true,
      amrapSetReps: 2,
      difficulty: 1
    },
    {
      id: 'cy_chairSunSal',
      name: 'Chair Sun Salutation Flow',
      equipment: ['chair','yogaMat'],
      movementPattern: ['bodyweight'],
      usedMuscleGroups: ['shoulders','back','core','legs'],
      strainedMuscleGroups: ['shoulders','spine'],
      emomOk: true,
      amrapSetReps: 4,
      difficulty: 1
    }
  ]
}

export const prepLibrary: PrepLibrary = {
  warmups: [
    { name: 'Neck Rolls 0:30 each direction', groups: ['neck','shoulders'] },
    { name: 'Cat–Cow (seated) x6 slow', groups: ['spine','core','shoulders'] },
    { name: 'Ankle Circles 0:30/side', groups: ['calves'] },
    { name: 'Sun-Arms x5 (easy range)', groups: ['shoulders','spine'] }
  ],
  cooldowns: [
    { name: 'Gentle Twist 0:45/side', groups: ['spine','back'] },
    { name: 'Hamstring Stretch on Chair 0:45/side', groups: ['hamstrings','calves'] },
    { name: 'Shoulder Stretch with Strap 1:00', groups: ['shoulders','chest'] },
    { name: 'Coherent Breathing 2:00 (5–6 breaths/min)', groups: ['core'] }
  ]
}
