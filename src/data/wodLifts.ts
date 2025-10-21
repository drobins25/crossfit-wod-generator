import type { WodLifts, PrepLibrary } from '../types/WodMovements'

export const wodLifts: WodLifts = {
  lifts: [
    { id:"backSquat", name:"Back Squat", equipment:["barbell","plates","rack"], movementPattern:["squat","bilateral","kneeDominant"], strainedMuscleGroups:["quadriceps","glutes"], usedMuscleGroups:["quadriceps","glutes","hamstrings","core","calves"], emomOk:false, amrapSetReps:5, difficulty:4 },
    { id:"frontSquat", name:"Front Squat", equipment:["barbell","plates","rack"], movementPattern:["squat","bilateral","kneeDominant"], strainedMuscleGroups:["quadriceps"], usedMuscleGroups:["quadriceps","glutes","hamstrings","core","upperBack"], emomOk:false, amrapSetReps:5, difficulty:4 },
    { id:"deadlift", name:"Deadlift", equipment:["barbell","plates"], movementPattern:["hinge","bilateral","hipDominant"], strainedMuscleGroups:["posteriorChain","glutes","hamstrings"], usedMuscleGroups:["posteriorChain","glutes","hamstrings","back","grip","core"], emomOk:true, amrapSetReps:5, difficulty:4 },
    { id:"strictPress", name:"Strict Press", equipment:["barbell","plates"], movementPattern:["verticalPress","overhead"], strainedMuscleGroups:["shoulders","triceps"], usedMuscleGroups:["shoulders","triceps","upperBack","core"], emomOk:true, amrapSetReps:5, difficulty:3 },
    { id:"benchPress", name:"Bench Press", equipment:["barbell","plates","bench"], movementPattern:["horizontalPress"], strainedMuscleGroups:["chest","triceps"], usedMuscleGroups:["chest","shoulders","triceps","back","core"], emomOk:true, amrapSetReps:8, difficulty:3 },
    { id:"barbellRow", name:"Barbell Row", equipment:["barbell","plates"], movementPattern:["horizontalPull","hingeIsometric"], strainedMuscleGroups:["back","arms"], usedMuscleGroups:["back","arms","core"], emomOk:true, amrapSetReps:8, difficulty:3 },
    { id:"kettlebellSwingAmerican", name:"Kettlebell Swing (American)", equipment:["kettlebell"], movementPattern:["hinge","overheadSwing"], strainedMuscleGroups:["posteriorChain"], usedMuscleGroups:["posteriorChain","shoulders","back","core","grip"], emomOk:true, amrapSetReps:15, difficulty:3 },
    { id:"shoulderToOverhead", name:"Shoulder to Overhead", equipment:["barbell","plates"], movementPattern:["verticalPress","dipDriveOptional"], strainedMuscleGroups:["shoulders","triceps"], usedMuscleGroups:["shoulders","triceps","upperBack","core"], emomOk:true, amrapSetReps:6, difficulty:4 },
    { id:"thruster", name:"Thruster", equipment:["barbell","plates"], movementPattern:["frontSquatToPress","compound"], strainedMuscleGroups:["quadriceps","shoulders"], usedMuscleGroups:["quadriceps","glutes","shoulders","triceps","core"], emomOk:true, amrapSetReps:9, difficulty:5 },
    // --- Add below your existing lifts ---
    { id:"powerClean", name:"Power Clean",
      equipment:["barbell","plates"], movementPattern:["tripleExtension","hipHinge","pull"],
      strainedMuscleGroups:["posteriorChain","quadriceps"],
      usedMuscleGroups:["posteriorChain","quadriceps","back","arms","core"],
      emomOk:true, amrapSetReps:3, difficulty:4
    },
    { id:"squatClean", name:"Squat Clean",
      equipment:["barbell","plates"], movementPattern:["tripleExtension","squatCatch","pull"],
      strainedMuscleGroups:["quadriceps","posteriorChain"],
      usedMuscleGroups:["posteriorChain","quadriceps","back","shoulders","arms","core"],
      emomOk:true, amrapSetReps:3, difficulty:5
    },
    { id:"powerSnatch", name:"Power Snatch",
      equipment:["barbell","plates"], movementPattern:["tripleExtension","wideGripPull","overheadCatchPartial"],
      strainedMuscleGroups:["shoulders","posteriorChain"],
      usedMuscleGroups:["posteriorChain","shoulders","back","core","grip"],
      emomOk:true, amrapSetReps:3, difficulty:5
    },
    { id:"squatSnatch", name:"Squat Snatch",
      equipment:["barbell","plates"], movementPattern:["tripleExtension","wideGripPull","overheadSquatCatch"],
      strainedMuscleGroups:["shoulders","quadriceps"],
      usedMuscleGroups:["posteriorChain","quadriceps","shoulders","upperBack","core"],
      emomOk:true, amrapSetReps:2, difficulty:5
    },
    { id:"pushPress", name:"Push Press",
      equipment:["barbell","plates"], movementPattern:["verticalPress","dipDriveOptional"],
      strainedMuscleGroups:["shoulders","triceps"],
      usedMuscleGroups:["shoulders","triceps","upperBack","core"],
      emomOk:true, amrapSetReps:6, difficulty:3
    },
    { id:"pushJerk", name:"Push Jerk",
      equipment:["barbell","plates"], movementPattern:["verticalPress","dipDrive","overheadLockout"],
      strainedMuscleGroups:["shoulders","triceps"],
      usedMuscleGroups:["shoulders","triceps","upperBack","core","legs"],
      emomOk:true, amrapSetReps:5, difficulty:4
    },
    { id:"splitJerk", name:"Split Jerk",
      equipment:["barbell","plates"], movementPattern:["verticalPress","dipDrive","overheadLockout","splitStanceCatch"],
      strainedMuscleGroups:["shoulders","triceps"],
      usedMuscleGroups:["shoulders","triceps","core","legs"],
      emomOk:true, amrapSetReps:3, difficulty:5
    },
    { id:"overheadSquat", name:"Overhead Squat",
      equipment:["barbell","plates"], movementPattern:["squat","overhead","bilateral"],
      strainedMuscleGroups:["shoulders","core"],
      usedMuscleGroups:["quadriceps","glutes","shoulders","upperBack","core"],
      emomOk:true, amrapSetReps:5, difficulty:4
    },
    { id:"frontRackLunge", name:"Front-Rack Lunge",
      equipment:["barbell","plates"], movementPattern:["lunge","unilateralAlternating"],
      strainedMuscleGroups:["quadriceps","glutes"],
      usedMuscleGroups:["quadriceps","glutes","hamstrings","core"],
      emomOk:true, amrapSetReps:8, difficulty:3
    },
    { id:"romanianDeadlift", name:"Romanian Deadlift",
      equipment:["barbell","plates"], movementPattern:["hinge","hipDominant"],
      strainedMuscleGroups:["hamstrings","posteriorChain"],
      usedMuscleGroups:["hamstrings","glutes","back","core","grip"],
      emomOk:true, amrapSetReps:8, difficulty:3
    },
    { id:"hipThrust", name:"Barbell Hip Thrust",
      equipment:["barbell","plates","bench"], movementPattern:["hinge","hipDominant"],
      strainedMuscleGroups:["glutes","hamstrings"],
      usedMuscleGroups:["glutes","hamstrings","core"],
      emomOk:true, amrapSetReps:10, difficulty:3
    },
    { id:"goodMorning", name:"Good Morning",
      equipment:["barbell","plates"], movementPattern:["hinge","hipDominant"],
      strainedMuscleGroups:["posteriorChain","hamstrings"],
      usedMuscleGroups:["posteriorChain","hamstrings","back","core"],
      emomOk:true, amrapSetReps:8, difficulty:3
    },
    { id:"pendlayRow", name:"Pendlay Row",
      equipment:["barbell","plates"], movementPattern:["horizontalPull","hingeIsometric"],
      strainedMuscleGroups:["back","arms"],
      usedMuscleGroups:["back","arms","core","grip"],
      emomOk:true, amrapSetReps:6, difficulty:3
    },
    { id:"weightedPullUp", name:"Weighted Pull-Up",
      equipment:["pullUpBar"], movementPattern:["verticalPull","bodyweight"],
      strainedMuscleGroups:["back","arms"],
      usedMuscleGroups:["back","arms","core","grip"],
      emomOk:true, amrapSetReps:5, difficulty:4
    },
    { id:"closeGripBench", name:"Close-Grip Bench Press",
      equipment:["barbell","plates","bench"], movementPattern:["horizontalPress"],
      strainedMuscleGroups:["triceps","chest"],
      usedMuscleGroups:["chest","triceps","shoulders","core"],
      emomOk:true, amrapSetReps:6, difficulty:3
    },
    { id:"zPress", name:"Z Press",
      equipment:["barbell","plates"], movementPattern:["verticalPress","overhead"],
      strainedMuscleGroups:["shoulders"],
      usedMuscleGroups:["shoulders","triceps","core"],
      emomOk:true, amrapSetReps:5, difficulty:4
    },
    { id:"cleanPull", name:"Clean Pull",
      equipment:["barbell","plates"], movementPattern:["tripleExtension","pull"],
      strainedMuscleGroups:["posteriorChain","back"],
      usedMuscleGroups:["posteriorChain","back","legs","core","grip"],
      emomOk:true, amrapSetReps:3, difficulty:3
    }
  ],
  hiitMovements: [
    { id:"burpee", name:"Burpee", equipment:[], movementPattern:["compound","bodyweight"], usedMuscleGroups:["quadriceps","glutes","chest","shoulders","triceps","core"], emomOk:true, amrapSetReps:12, difficulty:4 },
    { id:"airSquat", name:"Air Squat", equipment:[], movementPattern:["squat","bodyweight"], usedMuscleGroups:["quadriceps","glutes","hamstrings","core","calves"], emomOk:true, amrapSetReps:20, difficulty:2 },
    { id:"boxJump", name:"Box Jump", equipment:["plyoBox"], movementPattern:["bodyweight"], usedMuscleGroups:["quadriceps","glutes","hamstrings","calves","core"], emomOk:true, amrapSetReps:12, difficulty:3 },
    { id:"doubleUnder", name:"Double-Under", equipment:["jumpRope"], movementPattern:["bodyweight"], usedMuscleGroups:["calves","core","arms","shoulders"], emomOk:true, amrapSetReps:50, difficulty:3 },
    { id:"kettlebellSwingRussian", name:"Kettlebell Swing (Russian)", equipment:["kettlebell"], movementPattern:["hinge","eyeLevelSwing"], usedMuscleGroups:["posteriorChain","back","core","grip"], emomOk:true, amrapSetReps:20, difficulty:3 },
    { id:"dumbbellSnatch", name:"Dumbbell Snatch", equipment:["dumbbell"], movementPattern:["hinge","singleArmOverhead"], usedMuscleGroups:["posteriorChain","shoulders","back","legs","core","grip"], emomOk:true, amrapSetReps:12, difficulty:3 },
    { id:"rowCalories", name:"Row (Calories)", equipment:["rower"], movementPattern:["bodyweight"], usedMuscleGroups:["legs","glutes","back","arms","core"], emomOk:true, amrapSetReps:12, difficulty:3 },
    { id:"airBikeCalories", name:"Air Bike (Calories)", equipment:["airBike"], movementPattern:["bodyweight"], usedMuscleGroups:["legs","glutes","arms","shoulders","core"], emomOk:true, amrapSetReps:12, difficulty:3 },
    { id:"toesToBar", name:"Toes-to-Bar", equipment:["pullUpBar"], movementPattern:["bodyweight"], usedMuscleGroups:["core","back","grip"], emomOk:true, amrapSetReps:10, difficulty:4 },
    { id:"ringRow", name:"Ring Row", equipment:["gymnasticRings"], movementPattern:["bodyweight"], usedMuscleGroups:["back","arms","core"], emomOk:true, amrapSetReps:12, difficulty:2 },
    { id:"sitUp", name:"Sit-Up", equipment:[], movementPattern:["bodyweight"], usedMuscleGroups:["core"], emomOk:true, amrapSetReps:20, difficulty:2 },
    { id:"mountainClimber", name:"Mountain Climber", equipment:[], movementPattern:["bodyweight"], usedMuscleGroups:["core","shoulders","legs"], emomOk:true, amrapSetReps:40, difficulty:2 },
    { id:"russianTwist", name:"Russian Twist", equipment:[], movementPattern:["bodyweight"], usedMuscleGroups:["core"], emomOk:true, amrapSetReps:30, difficulty:2 },
    { id:"plankShoulderTap", name:"Plank Shoulder Tap", equipment:[], movementPattern:["bodyweight"], usedMuscleGroups:["core","shoulders"], emomOk:true, amrapSetReps:30, difficulty:2 },
    { id:"boxStepOver", name:"Box Step-Over", equipment:["plyoBox"], movementPattern:["bodyweight"], usedMuscleGroups:["quadriceps","glutes","hamstrings","core"], emomOk:true, amrapSetReps:20, difficulty:2 },
    { id:"wallSit", name:"Wall Sit (seconds)", equipment:[], movementPattern:["bodyweight"], usedMuscleGroups:["quadriceps","glutes","core"], emomOk:true, amrapSetReps:40, difficulty:2 },
    { id:"altDbSnatch", name:"Alternating DB Snatch", equipment:["dumbbell"], movementPattern:["hinge","singleArmOverhead"], usedMuscleGroups:["posteriorChain","shoulders","core"], emomOk:true, amrapSetReps:14, difficulty:3 },
    { id:"dbHangClean", name:"DB Hang Clean", equipment:["dumbbell"], movementPattern:["hinge","pull"], usedMuscleGroups:["posteriorChain","back","arms","core"], emomOk:true, amrapSetReps:16, difficulty:3 },
    { id:"kbGobletSquat", name:"KB Goblet Squat", equipment:["kettlebell"], movementPattern:["squat"], usedMuscleGroups:["quadriceps","glutes","core"], emomOk:true, amrapSetReps:16, difficulty:2 },
    { id:"medBallClean", name:"Med-Ball Clean", equipment:["medicineBall"], movementPattern:["hinge","pull","squat"], usedMuscleGroups:["posteriorChain","quadriceps","core","shoulders"], emomOk:true, amrapSetReps:14, difficulty:3 },
    { id:"burpeeOverDb", name:"Burpee Over DB", equipment:["dumbbell"], movementPattern:["compound","bodyweight"], usedMuscleGroups:["legs","chest","shoulders","core"], emomOk:true, amrapSetReps:10, difficulty:4 },
    { id:"slamBall", name:"Slam Ball", equipment:["medicineBall"], movementPattern:["hinge","verticalPress"], usedMuscleGroups:["posteriorChain","shoulders","core"], emomOk:true, amrapSetReps:20, difficulty:3 },
    { id:"sledDrag", name:"Sled Drag (meters)", equipment:["sled"], movementPattern:["bodyweight"], usedMuscleGroups:["legs","glutes","core"], emomOk:true, amrapSetReps:50, difficulty:3 },
    { id:"sandbagOverShoulder", name:"Sandbag Over Shoulder", equipment:["sandbag"], movementPattern:["hinge","pull"], usedMuscleGroups:["posteriorChain","back","core","glutes"], emomOk:true, amrapSetReps:10, difficulty:4 },
    {
      id: "bandPullApart",
      name: "Band Pull-Apart",
      equipment: ["resistanceBands"],
      movementPattern: ["horizontalPull", "bodyweight"],
      usedMuscleGroups: ["upperBack", "shoulders", "arms", "core"]
    },
    {
      id: "bandFacePull",
      name: "Band Face Pull",
      equipment: ["resistanceBands"],
      movementPattern: ["horizontalPull", "bodyweight"],
      usedMuscleGroups: ["upperBack", "shoulders", "arms", "core"]
    },
    {
      id: "bandGoodMorning",
      name: "Band Good Morning",
      equipment: ["resistanceBands"],
      movementPattern: ["hinge", "hipDominant"],
      strainedMuscleGroups: ["posteriorChain", "hamstrings"],
      usedMuscleGroups: ["posteriorChain", "glutes", "hamstrings", "core"]
    },
    {
      id: "bandRow",
      name: "Band Row",
      equipment: ["resistanceBands"],
      movementPattern: ["horizontalPull"],
      usedMuscleGroups: ["back", "arms", "core"]
    },
    {
      id: "bandOverheadPress",
      name: "Band Overhead Press",
      equipment: ["resistanceBands"],
      movementPattern: ["verticalPress", "overhead"],
      strainedMuscleGroups: ["shoulders", "triceps"],
      usedMuscleGroups: ["shoulders", "triceps", "upperBack", "core"]
    },
    {
      id: "bandThruster",
      name: "Band Thruster",
      equipment: ["resistanceBands"],
      movementPattern: ["frontSquatToPress", "compound"],
      usedMuscleGroups: ["quadriceps", "glutes", "shoulders", "triceps", "core"]
    },
    {
      id: "bandBicepsCurl",
      name: "Band Biceps Curl",
      equipment: ["resistanceBands"],
      movementPattern: ["bodyweight"], // simple accessory pattern
      usedMuscleGroups: ["arms", "shoulders", "core"]
    },
    {
      id: "bandTricepsPushdown",
      name: "Band Triceps Pushdown",
      equipment: ["resistanceBands"],
      movementPattern: ["verticalPress"], // accessory press path works within your set
      usedMuscleGroups: ["triceps", "shoulders", "core"]
    },
    {
      id: "bandMonsterWalk",
      name: "Band Monster Walk",
      equipment: ["resistanceBands"],
      movementPattern: ["lunge", "unilateralAlternating", "bodyweight"], // locomotion + tension
      usedMuscleGroups: ["glutes", "quadriceps", "adductors", "core"]
    }
  ]
}

export const prepLibrary: PrepLibrary = {
  warmups: [
    { name:"Easy bike/row 2:00", groups:["legs","glutes","back","core"] },
    { name:"PVC pass-throughs x 15", groups:["shoulders","upperBack","chest"] as any },
    { name:"Hip openers x 10/side", groups:["glutes","quadriceps","hamstrings"] },
    { name:"Ankle rocks x 20", groups:["calves"] },
    { name:"Scap pull-ups x 10", groups:["back","shoulders"] },
    { name:"Glute bridges x 15", groups:["glutes","hamstrings","core"] }
  ],
  cooldowns: [
    { name:"Couch stretch 1:00/side", groups:["quadriceps","glutes"] },
    { name:"Pigeon pose 1:00/side", groups:["glutes"] },
    { name:"Child’s pose 1:30", groups:["back","shoulders","core"] },
    { name:"Hamstring floss 1:00/side", groups:["hamstrings","calves"] },
    { name:"Doorway pec stretch 1:00/side", groups:["chest","shoulders"] }
  ]
}
