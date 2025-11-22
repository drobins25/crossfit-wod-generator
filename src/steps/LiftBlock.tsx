import React, { useRef, useState } from 'react'
import { MuscleGroup, MUSCLE_LABEL } from '../types/WodMovements'
import { MovementLink, extractMovementName } from './MovementLink'

interface LiftData {
  focus: MuscleGroup
  move: string
  scheme: string
  note?: string
  oddEven?: {
    odd: { name: string; reps: number }
    even: { name: string; reps: number }
  }
  movements?: string[]
  minutes: number
  difficulty: number
  groups: Set<MuscleGroup>
  strained: Set<MuscleGroup>
}

interface Props {
  lift: LiftData | null
  liftLabel: string
  workoutTypeLabel: string
  onRegenerate?: () => void
}

function Bullet({ text, workoutType }: { text: string; workoutType: string }) {
  const move = extractMovementName(text) ?? text
  return (
    <div className="marker line list">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          columnGap: 8,
          alignItems: 'baseline',
        }}
      >
        {/* bullet */}
        <div>•</div>

        {/* text: wraps */}
        <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{text}</div>

        {/* right column: fixed, no wrap */}
        {move && <MovementLink label={workoutType + ' ' + move} />}
      </div>
    </div>
  )
}

export function LiftBlock({ lift, liftLabel, workoutTypeLabel, onRegenerate }: Props) {
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [justShuffled, setJustShuffled] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const startX = useRef<number>(0)
  const containerRef = useRef<HTMLElement>(null)

  const dragThreshold = 100 // pixels to drag before shuffle triggers

  const handleDragStart = (clientX: number) => {
    if (!onRegenerate) return
    startX.current = clientX
    setIsDragging(true)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging || !onRegenerate) return
    const diff = clientX - startX.current
    // Only allow left drag (negative offset), up to -400px
    const offset = Math.max(-400, Math.min(diff, 0))
    setDragOffset(offset)
  }

  const handleDragEnd = () => {
    if (!onRegenerate) return
    // Only trigger shuffle if swiped left past threshold
    if (dragOffset < -dragThreshold) {
      setIsDragging(false)
      setIsAnimatingOut(true)

      // Animate out to the left completely
      setTimeout(() => {
        setIsAnimatingOut(false)
        setIsHidden(true)
        // Update content after card is fully hidden
        setTimeout(() => {
          onRegenerate()
          setIsHidden(false)
          setJustShuffled(true)
          setDragOffset(0)
          setTimeout(() => setJustShuffled(false), 1400)
        }, 50)
      }, 300)
    } else {
      setIsDragging(false)
      setDragOffset(0)
    }
  }

  // Calculate gradient overlay intensity based on drag distance
  const dragProgress = Math.min(Math.abs(dragOffset) / dragThreshold, 1)
  const redOverlayOpacity = isDragging ? dragProgress * 0.25 : 0

  return (
    <section
      ref={containerRef}
      className="mini-board lift-accent animate"
      style={{
        transform: isAnimatingOut ? 'translateX(-500px)' : `translateX(${dragOffset}px)`,
        opacity: isAnimatingOut || isHidden ? 0 : isDragging ? Math.max(0, 1 - Math.abs(dragOffset) / 300) : 1,
        transition: isAnimatingOut
          ? 'transform 0.3s ease-in, opacity 0.3s ease-in'
          : isDragging
          ? 'none'
          : justShuffled
          ? 'none'
          : 'transform 0.3s ease-out, opacity 0.3s ease-out',
        animation: justShuffled ? 'slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
        touchAction: 'pan-y',
        position: 'relative',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderTop: '1px solid rgba(255, 255, 255, 0.35)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
        borderRadius: '12px',
        padding: '16px',
      }}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => isDragging && handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={() => isDragging && handleDragEnd()}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
    >
      {/* Red gradient overlay when discarding */}
      {onRegenerate && redOverlayOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.4), rgba(239, 68, 68, 0.3))',
            opacity: redOverlayOpacity,
            pointerEvents: 'none',
            borderRadius: '12px',
            transition: 'opacity 0.1s ease',
          }}
        />
      )}

      {/* Green gradient overlay when new content appears */}
      {onRegenerate && justShuffled && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(74, 222, 128, 0.2))',
            opacity: 1,
            pointerEvents: 'none',
            borderRadius: '12px',
            animation: 'shuffle-flash 1.4s ease-out',
          }}
        />
      )}

      <div key={justShuffled ? 'shuffled' : 'normal'}>
        <div className="board-head">
          <div className="marker head blue" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>💪 {liftLabel} {lift ? `(${lift.minutes} min)` : ''}</span>
            {onRegenerate && (
              <button className="btn ghost sm" onClick={onRegenerate} style={{ fontSize: '12px' }}>
                Shuffle
              </button>
            )}
          </div>
        </div>
        {!lift ? (
          <div className="marker line">No lift today, eh?</div>
        ) : (
          <>
            <div className="marker line">{lift.scheme}</div>
            {lift.note && <div className="scheme-sub small" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{lift.note}</div>}
            {/* Bullet list */}
            <div className="marker line list">
              {lift.oddEven ? (
                <>
                  <Bullet
                    workoutType={workoutTypeLabel}
                    text={`Odd minutes — ${lift.oddEven.odd.name} × ${lift.oddEven.odd.reps}`}
                  />
                  <Bullet
                    workoutType={workoutTypeLabel}
                    text={`Even minutes — ${lift.oddEven.even.name} × ${lift.oddEven.even.reps}`}
                  />
                </>
              ) : lift.movements && lift.movements.length > 0 ? (
                <>
                  {lift.movements.map((m, idx) => (
                    <Bullet key={idx} workoutType={workoutTypeLabel} text={m} />
                  ))}
                </>
              ) : (
                <Bullet workoutType={workoutTypeLabel} text={lift.move} />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
