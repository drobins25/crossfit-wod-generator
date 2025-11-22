import React from 'react'
import { WorkoutType } from '../workoutTypes/context'
import { getWorkoutTypeOptions } from '../workoutTypes/registry'

interface Props {
  workoutType: WorkoutType
  setWorkoutType: (type: WorkoutType) => void
  onNext?: () => void
}

export function HeroStep({ workoutType, setWorkoutType, onNext }: Props) {
  // Hard-coded quote for consistent hero display
  const quote = {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--panel), var(--panel-2))',
      backgroundAttachment: 'fixed',
      margin: '-20px -20px -20px -20px',
      padding: '20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: '20px',
      boxSizing: 'border-box',
      overflow: 'auto',
      overflowX: 'hidden',
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
        padding: '32px 24px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <h1 style={{
          fontSize: 'clamp(36px, 10vw, 56px)',
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
          fontSize: 'clamp(16px, 4vw, 20px)',
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
        background: 'linear-gradient(135deg, rgba(var(--bg-rgb), 0.85), rgba(var(--bg-rgb), 0.7))',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderTop: '1px solid rgba(255, 255, 255, 0.35)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
        borderRadius: '12px',
        padding: '20px 24px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Decorative quote mark */}
        <div style={{
          position: 'absolute',
          top: '4px',
          left: '12px',
          fontSize: '48px',
          fontWeight: 700,
          opacity: 0.06,
          lineHeight: 1,
          fontFamily: 'Georgia, serif'
        }}>
          "
        </div>

        <p style={{
          fontSize: '16px',
          fontStyle: 'italic',
          fontWeight: 500,
          opacity: 0.95,
          margin: 0,
          lineHeight: 1.6,
          letterSpacing: '0.01em',
          position: 'relative',
          zIndex: 1
        }}>
          {quote.text}
        </p>
        {quote.author && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '12px'
          }}>
            <div style={{
              height: '1px',
              width: '32px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
            }} />
            <p style={{
              fontSize: '13px',
              opacity: 0.7,
              fontWeight: 600,
              margin: 0,
              letterSpacing: '0.05em'
            }}>
              {quote.author}
            </p>
            <div style={{
              height: '1px',
              width: '32px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
            }} />
          </div>
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
        {getWorkoutTypeOptions().map(({ id, label }) => {
          const isActive = id === workoutType
          return (
            <button
              key={id}
              type="button"
              onClick={() => setWorkoutType(id)}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(239, 68, 68, 0.4), rgba(34, 197, 94, 0.4))'
                  : 'rgba(var(--bg-rgb), 0.6)',
                backdropFilter: 'blur(10px)',
                border: isActive
                  ? '2px solid rgba(255, 255, 255, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '24px',
                padding: '8px 20px',
                fontSize: '14px',
                fontWeight: 600,
                opacity: isActive ? 1 : 0.9,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: 'inherit'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.opacity = '1'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.opacity = '0.9'
                  e.currentTarget.style.transform = 'scale(1)'
                }
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Let's Go! Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '16px',
        padding: '0 16px',
        width: '100%'
      }}>
        <button
          type="button"
          onClick={onNext}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #ef4444, #22c55e)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '32px',
            padding: '16px 32px',
            fontSize: '18px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            color: 'white',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            width: '100%',
            maxWidth: '280px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)'
          }}
        >
          Let's Go!
        </button>
      </div>
    </div>
  )
}
