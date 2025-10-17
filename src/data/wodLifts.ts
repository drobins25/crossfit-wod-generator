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
    { id:"thruster", name:"Thruster", equipment:["barbell","plates"], movementPattern:["frontSquatToPress","compound"], strainedMuscleGroups:["quadriceps","shoulders"], usedMuscleGroups:["quadriceps","glutes","shoulders","triceps","core"], emomOk:true, amrapSetReps:9, difficulty:5 }
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
    { id:"ringRow", name:"Ring Row", equipment:["gymnasticRings"], movementPattern:["bodyweight"], usedMuscleGroups:["back","arms","core"], emomOk:true, amrapSetReps:12, difficulty:2 }
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
