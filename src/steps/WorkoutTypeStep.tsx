import React from 'react'
import { WorkoutType } from '../workoutTypes/context'
import { getWorkoutTypeOptions } from '../workoutTypes/registry'

interface Props {
  workoutType: WorkoutType
  setWorkoutType: (type: WorkoutType) => void
}

export function WorkoutTypeStep({ workoutType, setWorkoutType }: Props) {
  return (
    <div className="segmented-wrap block-row">
      <div className="segmented-title marker line center">Workout type</div>
      <h3 style={{ fontSize: 'xx-small', textAlign: 'center' }}>
        Select a training style and we'll generate sessions that fit your space, gear, and style-specific formats.
      </h3>
      <div className="segmented-grid segmented-3" role="group" aria-label="Workout type">
        {getWorkoutTypeOptions().map(({ id, label }) => {
          const active = id === workoutType
          return (
            <button
              key={id}
              type="button"
              className={`segmented-btn ${active ? 'is-active' : ''}`}
              aria-pressed={active}
              onClick={() => setWorkoutType(id as WorkoutType)}
              title={label}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
