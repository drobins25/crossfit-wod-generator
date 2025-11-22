import React, { useEffect } from 'react'
import { useWorkoutType } from './workoutTypes/context'
import { getSessionLabels } from './workoutTypes/registry'
import { useBoard } from './store'
import { DateStep, DurationStep, WorkoutTypeStep } from './steps'

export default function Controls() {
  const { workoutType, setWorkoutType } = useWorkoutType()
  const {
    date,
    setDate,
    equipSel,
    focusSel,
    workout,
    setWorkout,
    split,
    setSplit,
    lift,
    hiit,
    generateAll,
  } = useBoard()

  // Get labels for current workout type
  const labels = getSessionLabels(workoutType)

  // Re-generate when inputs change
  useEffect(() => {
    generateAll()
  }, [date, equipSel, focusSel, workout, split])

  return (
    <div>
      {/* Workout Date */}
      <div className="section">
        <DateStep date={date} setDate={setDate} />
      </div>
      <br />

      {/* Total workout time (segmented buttons) */}
      <div className="section">
        <DurationStep
          workout={workout}
          setWorkout={setWorkout}
          split={split}
          setSplit={setSplit}
          liftLabel={labels.liftLabel}
          hiitLabel={labels.hiitLabel}
          liftMinutes={lift?.minutes}
          hiitMinutes={hiit?.minutes}
        />
      </div>
      <br />

      {/* Workout Type */}
      <div className="section">
        <WorkoutTypeStep workoutType={workoutType} setWorkoutType={setWorkoutType} />
      </div>
    </div>
  )
}
