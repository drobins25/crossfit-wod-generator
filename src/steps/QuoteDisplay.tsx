import React from 'react'

interface Props {
  quote: string
  workoutTypeLabel: string
}

export function QuoteDisplay({ quote, workoutTypeLabel }: Props) {
  return (
    <div className="center">
      <div className="marker title">Your {workoutTypeLabel} Workout</div>
      <div key={quote} className="marker quote animate">
        {'"' + quote + '"'}
      </div>
    </div>
  )
}
