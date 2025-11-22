import React from 'react'

interface Props {
  cool: string[] | null
}

export function CooldownBlock({ cool }: Props) {
  return (
    <section className="mini-board cooldown-accent">
      <div className="board-head">
        <div className="marker head blue-soft">🔵 Cool-down</div>
      </div>
      {cool ? (
        cool.map((c, i) => (
          <div key={i} className="marker line list animate">
            • {c}
          </div>
        ))
      ) : (
        <div className="marker line">—</div>
      )}
    </section>
  )
}
