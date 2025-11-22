import React from 'react'

type CSSVars = React.CSSProperties & { ['--pct']?: string }

interface Props {
  split: number
  setSplit: (split: number) => void
  liftLabel: string
  hiitLabel: string
  liftMinutes?: number
  hiitMinutes?: number
  onExport?: () => void
}

export function SplitSliderControl({
  split,
  setSplit,
  liftLabel,
  hiitLabel,
  liftMinutes,
  hiitMinutes,
  onExport,
}: Props) {
  const liftPct = Math.round(split * 100)
  const sliderStyle: CSSVars = { ['--pct']: `${liftPct}%` }

  return (
    <div className="header-tools">
      {/* left spacer (empty) */}
      <div />

      {/* centered slider block */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div className="marker" aria-label="Workout split">
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

      {/* right-aligned button */}
      {onExport && (
        <button className="btn ghost export" onClick={onExport}>
          Export WOD
        </button>
      )}
    </div>
  )
}
