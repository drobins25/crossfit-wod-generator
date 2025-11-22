import React from 'react'

interface Props {
  warm: string[] | null
}

export function WarmupBlock({ warm }: Props) {
  return (
    <section className="mini-board warmup-accent">
      <div className="board-head">
        <div className="marker head green">🟢 Warm-up</div>
      </div>
      {warm ? (
        warm.map((w, i) => (
          <div key={i} className="marker line list animate">
            • {w}
          </div>
        ))
      ) : (
        <div className="marker line list animate">—</div>
      )}
    </section>
  )
}
