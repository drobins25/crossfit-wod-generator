import React from 'react'
import { WorkoutType } from '../workoutTypes/context'
import { getWorkoutTypeOptions } from '../workoutTypes/registry'
import { DateStep } from './DateStep'

type CSSVars = React.CSSProperties & { ['--pct']?: string }

interface Props {
  workoutType: WorkoutType
  setWorkoutType: (type: WorkoutType) => void
  workout: number
  setWorkout: (minutes: number) => void
  split?: number
  setSplit?: (split: number) => void
  liftLabel?: string
  hiitLabel?: string
  liftMinutes?: number
  hiitMinutes?: number
  date: string
  setDate: (date: string) => void
}

export function QuickSetupStep({
  workoutType,
  setWorkoutType,
  workout,
  setWorkout,
  split,
  setSplit,
  liftLabel = 'Lift',
  hiitLabel = 'HIIT',
  liftMinutes,
  hiitMinutes,
  date,
  setDate,
}: Props) {
  const liftPct = split !== undefined ? Math.round(split * 100) : 50
  const sliderStyle: CSSVars = { ['--pct']: `${liftPct}%` }

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--panel), var(--panel-2))',
      backgroundAttachment: 'fixed',
      margin: '-20px -20px 0 -20px',
      padding: '40px 20px 40px 20px',
      minHeight: '100vh'
    }}>
      {/* Workout Type */}
      <div
        className="lift-accent"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(var(--bg-rgb), 0.5))',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderTop: '1px solid rgba(255, 255, 255, 0.35)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <div className="marker head" style={{ marginBottom: '8px', textAlign: 'center' }}>Workout Type</div>
        <h3 style={{ fontSize: 'xx-small', textAlign: 'center', opacity: 0.7, marginBottom: '16px' }}>
          Choose your training style and let's get after it!
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

      {/* Duration */}
      <div
        className="hiit-accent"
        style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(var(--bg-rgb), 0.5))',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderTop: '1px solid rgba(255, 255, 255, 0.35)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <div className="marker head" style={{ marginBottom: '8px', textAlign: 'center' }}>Workout Duration</div>
        <h3 style={{ fontSize: 'xx-small', textAlign: 'center', opacity: 0.7, marginBottom: '16px' }}>
          How much time do you have to work with today?
        </h3>
        <div className="segmented-grid segmented-3" role="radiogroup" aria-label="Workout duration">
          {([10, 20, 30, 40, 50, 60] as const).map((m) => {
            const active = workout === m
            return (
              <button
                key={m}
                type="button"
                className={`segmented-btn ${active ? 'is-active' : ''}`}
                aria-pressed={active}
                onClick={() => setWorkout(m)}
              >
                {m} min
              </button>
            )
          })}
        </div>

        {/* Split Slider */}
        {split !== undefined && setSplit && (
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ fontSize: 'xx-small', textAlign: 'center', opacity: 0.7, marginBottom: 12 }}>
              Drag to adjust split
            </h3>
            <div className="marker" aria-label="Workout split" style={{ textAlign: 'center', marginBottom: 12 }}>
              <span className="marker line blue">
                {liftLabel} {liftMinutes ? `(${liftMinutes} min)` : ''}
              </span>
              {' ~ '}
              <span className="red">
                {hiitLabel} {hiitMinutes ? `(${hiitMinutes} min)` : ''}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={split}
              onChange={(e) => setSplit(Number(e.target.value))}
              className="split-range"
              style={sliderStyle}
            />
          </div>
        )}
      </div>

      {/* Date */}
      <div
        className="warmup-accent"
        style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(var(--bg-rgb), 0.5))',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderTop: '1px solid rgba(255, 255, 255, 0.35)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <DateStep date={date} setDate={setDate} />
      </div>
    </div>
  )
}
