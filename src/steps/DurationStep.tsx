import React from 'react'

type CSSVars = React.CSSProperties & { ['--pct']?: string }

interface Props {
  workout: number
  setWorkout: (minutes: number) => void
  split?: number
  setSplit?: (split: number) => void
  liftLabel?: string
  hiitLabel?: string
  liftMinutes?: number
  hiitMinutes?: number
}

export function DurationStep({
  workout,
  setWorkout,
  split,
  setSplit,
  liftLabel = 'Lift',
  hiitLabel = 'HIIT',
  liftMinutes,
  hiitMinutes,
}: Props) {
  const liftPct = split !== undefined ? Math.round(split * 100) : 50
  const sliderStyle: CSSVars = { ['--pct']: `${liftPct}%` }

  return (
    <div className="segmented-wrap block-row">
      <div className="segmented-title marker line center">Workout Duration</div>
      <h3 style={{ fontSize: 'xx-small', textAlign: 'center' }}>
        Pick your total workout time—you'll split it between {liftLabel} and {hiitLabel}.
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
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: 'xx-small', textAlign: 'center', opacity: 0.7, marginBottom: 8 }}>
            Drag to adjust
          </h3>
          <div className="marker" aria-label="Workout split" style={{ textAlign: 'center', marginBottom: 8 }}>
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
  )
}
