import React, { useMemo } from 'react'
import { pickQuoteForGroups } from '../whiteboard/quotes'

export function HeroStep() {
  // Generate a random quote for the hero
  const quote = useMemo(() => {
    const rng = () => Math.random()
    return pickQuoteForGroups(rng, new Set())
  }, [])

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--panel), var(--panel-2))',
      backgroundAttachment: 'fixed',
      margin: '0 -20px -20px -20px',
      padding: '20px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: '24px'
    }}>
      {/* Main Hero Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(239, 68, 68, 0.15), rgba(34, 197, 94, 0.15))',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderTop: '1px solid rgba(255, 255, 255, 0.35)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
        borderRadius: '16px',
        padding: '48px 32px',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: 900,
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #3b82f6, #ef4444, #22c55e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '16px'
        }}>
          Your Workout
          <br />
          in 30 Seconds
        </h1>

        <p style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: 0,
          lineHeight: 1.5,
          opacity: 0.9
        }}>
          Choose your style. Set your time. Train smarter.
        </p>
      </div>

      {/* Quote Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(var(--bg-rgb), 0.7), rgba(var(--bg-rgb), 0.5))',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderTop: '1px solid rgba(255, 255, 255, 0.35)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
        borderRadius: '12px',
        padding: '24px 32px',
        maxWidth: '560px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '16px',
          fontStyle: 'italic',
          opacity: 0.95,
          margin: 0,
          lineHeight: 1.7
        }}>
          "{quote.text}"
        </p>
        {quote.author && (
          <p style={{
            fontSize: '14px',
            opacity: 0.7,
            marginTop: '12px',
            fontWeight: 500
          }}>
            — {quote.author}
          </p>
        )}
      </div>

      {/* Workout Types */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '8px'
      }}>
        {['💪 CrossFit', '🏋️ Total Gym', '🧘 Chair Yoga'].map((type, i) => (
          <div key={i} style={{
            background: 'rgba(var(--bg-rgb), 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: 600,
            opacity: 0.9
          }}>
            {type}
          </div>
        ))}
      </div>
    </div>
  )
}
