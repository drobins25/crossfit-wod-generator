import React from 'react'
import { useBoard } from '../store'

export function WizardSettings() {
  const { date, setDate } = useBoard()

  return (
    <div className="wizard-header">
      {/* Branding */}
      <div style={{
        fontSize: '18px',
        fontWeight: 700,
        letterSpacing: '0.3px',
      }}>
        WODSpark
      </div>

      {/* Date picker */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{
          background: 'rgba(var(--bg-rgb), 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          padding: '6px 10px',
          color: 'var(--text)',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      />
    </div>
  )
}
