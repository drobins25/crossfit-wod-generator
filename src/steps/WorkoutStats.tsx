import React from 'react'
import { MuscleGroup, MUSCLE_LABEL } from '../types/WodMovements'

interface LiftData {
  minutes: number
  difficulty?: number
  focus: MuscleGroup
  movements?: string[]
  move?: string
}

interface HiitData {
  minutes: number
  blocks: string[]
}

interface Props {
  lift: LiftData | null
  hiit: HiitData | null
}

export function WorkoutStats({ lift, hiit }: Props) {
  const totalMinutes = (lift?.minutes || 0) + (hiit?.minutes || 0)
  const movementCount =
    (lift?.movements?.length || (lift?.move ? 1 : 0)) +
    (hiit?.blocks.length || 0)

  const difficulty = lift?.difficulty || 3
  const focusArea = lift ? MUSCLE_LABEL[lift.focus] : 'Full Body'

  // Difficulty stars
  const difficultyStars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < difficulty ? 'var(--accent-color, #4a90e2)' : '#ddd' }}>
      ★
    </span>
  ))

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.08), rgba(226, 74, 144, 0.08))',
        border: '1px solid var(--border-color, #e0e0e0)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', flex: 1 }}>
        {/* Total Time */}
        <div>
          <div style={{ fontSize: '12px', opacity: 0.7, fontWeight: 500, marginBottom: 4 }}>
            TOTAL TIME
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-color, #4a90e2)' }}>
            {totalMinutes} min
          </div>
        </div>

        {/* Movement Count */}
        <div>
          <div style={{ fontSize: '12px', opacity: 0.7, fontWeight: 500, marginBottom: 4 }}>
            MOVEMENTS
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700 }}>{movementCount}</div>
        </div>

        {/* Focus Area */}
        <div>
          <div style={{ fontSize: '12px', opacity: 0.7, fontWeight: 500, marginBottom: 4 }}>
            FOCUS
          </div>
          <div style={{ fontSize: '18px', fontWeight: 600 }}>{focusArea}</div>
        </div>
      </div>

      {/* Difficulty */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '12px', opacity: 0.7, fontWeight: 500, marginBottom: 4 }}>
          DIFFICULTY
        </div>
        <div style={{ fontSize: '20px', letterSpacing: '2px' }}>{difficultyStars}</div>
      </div>
    </div>
  )
}
