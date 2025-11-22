import React, { ReactNode } from 'react'
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
  return (
    <div className="wizard-content">
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
