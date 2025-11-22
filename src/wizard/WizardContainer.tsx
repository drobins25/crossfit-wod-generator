import React, { ReactNode, useRef, useState, useEffect } from 'react'
import { WizardProvider, useWizard } from './WizardContext'

interface WizardContainerProps {
  children: ReactNode
  totalSteps: number
  onComplete?: () => void
}

function WizardNavigation() {
  const { currentStep, totalSteps, goNext, goPrev, canGoNext, canGoPrev } = useWizard()

  return (
    <div className="wizard-nav">
      {/* Progress indicator */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 'small', opacity: 0.7 }}>
          Step {currentStep + 1} of {totalSteps}
        </div>
        {/* Progress bar */}
        <div
          style={{
            height: 4,
            backgroundColor: 'var(--border)',
            borderRadius: 2,
            marginTop: 8,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--blue)',
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
        <button
          type="button"
          className="btn ghost wizard-btn"
          onClick={goPrev}
          disabled={!canGoPrev}
          style={{ opacity: canGoPrev ? 1 : 0.4, flex: 1 }}
        >
          ← Back
        </button>
        <button type="button" className="btn wizard-btn" onClick={goNext} style={{ flex: 1 }}>
          {currentStep === 0 ? "Let's Go →" : currentStep === totalSteps - 1 ? 'View Workout' : 'Next →'}
        </button>
      </div>
    </div>
  )
}

function WizardContent({ children }: { children: ReactNode }) {
  const { goNext, goPrev, canGoNext, canGoPrev, currentStep, totalSteps } = useWizard()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const startX = useRef<number>(0)

  const minSwipeDistance = 50 // minimum swipe distance in pixels
  const isLastStep = currentStep === totalSteps - 1 // Disable swipe on board view

  // Check if target is an interactive element
  const isInteractiveElement = (target: EventTarget | null): boolean => {
    if (!target || !(target instanceof HTMLElement)) return false
    const tagName = target.tagName.toLowerCase()
    return ['button', 'input', 'select', 'textarea', 'a'].includes(tagName) || target.isContentEditable
  }

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLastStep || isInteractiveElement(e.target)) return
    startX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isLastStep || !isDragging) return
    const currentX = e.touches[0].clientX
    const diff = currentX - startX.current

    // Add resistance at boundaries
    let offset = diff
    if ((diff > 0 && !canGoPrev) || (diff < 0 && !canGoNext)) {
      offset = diff * 0.3 // reduced movement at boundaries
    }
    setDragOffset(offset)
  }

  const handleTouchEnd = () => {
    if (isLastStep) return
    const swipeDistance = -dragOffset

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0 && canGoNext) {
        goNext()
      } else if (swipeDistance < 0 && canGoPrev) {
        goPrev()
      }
    }

    setIsDragging(false)
    setDragOffset(0)
  }

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLastStep || isInteractiveElement(e.target)) return
    startX.current = e.clientX
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isLastStep || !isDragging) return
    const currentX = e.clientX
    const diff = currentX - startX.current

    // Add resistance at boundaries
    let offset = diff
    if ((diff > 0 && !canGoPrev) || (diff < 0 && !canGoNext)) {
      offset = diff * 0.3
    }
    setDragOffset(offset)
  }

  const handleMouseUp = () => {
    if (isLastStep || !isDragging) return

    const swipeDistance = -dragOffset

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0 && canGoNext) {
        goNext()
      } else if (swipeDistance < 0 && canGoPrev) {
        goPrev()
      }
    }

    setIsDragging(false)
    setDragOffset(0)
  }

  const handleMouseLeave = () => {
    if (isLastStep) return
    if (isDragging) {
      handleMouseUp()
    }
  }

  return (
    <div
      ref={containerRef}
      className="wizard-content"
      style={{
        transform: `translateX(${dragOffset}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        cursor: isLastStep ? 'default' : isDragging ? 'grabbing' : 'grab',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

function WizardFooter() {
  const { currentStep } = useWizard()

  // Hide footer on all steps (no longer needed with back button)
  // Step 0-1: Combined Hero + Quick Setup
  // Step 2: Workout board (has back button instead)
  return null
}

export function WizardContainer({ children, totalSteps, onComplete }: WizardContainerProps) {
  return (
    <WizardProvider totalSteps={totalSteps} onComplete={onComplete}>
      <div className="wizard-container">
        <WizardContent>{children}</WizardContent>
        <WizardFooter />
      </div>
    </WizardProvider>
  )
}
