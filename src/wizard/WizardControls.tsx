import React, { useEffect, useMemo, useRef } from 'react'
import { useWorkoutType } from '../workoutTypes/context'
import { getEquipmentForType, getSessionLabels } from '../workoutTypes/registry'
import { useBoard } from '../store'
import { HeroStep, QuickSetupStep } from '../steps'
import { TrainingFocusStep } from '../steps/TrainingFocusStep'
import { EquipmentStep } from '../steps/EquipmentStep'
import { WizardContainer } from './WizardContainer'
import { WizardStep } from './WizardStep'
import { WizardSettings } from './WizardSettings'
import { useWizard } from './WizardContext'
import Board from '../Board'
import type { Equipment } from '../types/WodMovements'

function WizardSteps() {
  const { currentStep, goNext, goToStep } = useWizard()
  const { workoutType, setWorkoutType } = useWorkoutType()
  const {
    date,
    setDate,
    equipSel,
    setEquipSel,
    focusSel,
    setFocusSel,
    workout,
    setWorkout,
    split,
    setSplit,
    lift,
    hiit,
    generateAll,
  } = useBoard()

  // Get labels for current workout type
  const labels = getSessionLabels(workoutType)

  // Allowed equipment for the current workout type
  const allowedEquip: Equipment[] = useMemo(() => {
    return getEquipmentForType(workoutType)
  }, [workoutType])

  // Save scroll position for step 1
  const step1ScrollPosition = useRef<number>(0)
  const previousStep = useRef<number>(currentStep)

  // Re-generate when inputs change
  useEffect(() => {
    generateAll()
  }, [date, equipSel, focusSel, workout, split])

  // Handle scroll position when step changes
  useEffect(() => {
    const prev = previousStep.current

    // Restore scroll position when returning to step 1 from steps 2 or 3
    if (currentStep === 1 && (prev === 2 || prev === 3)) {
      // Use a short timeout to ensure DOM is ready
      setTimeout(() => {
        window.scrollTo({ top: step1ScrollPosition.current, behavior: 'instant' })
      }, 0)
    } else {
      // Save scroll position when leaving step 1
      if (prev === 1 && (currentStep === 2 || currentStep === 3)) {
        step1ScrollPosition.current = window.scrollY || window.pageYOffset
      }
      // Scroll to top for all other step transitions
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    // Update previous step for next time
    previousStep.current = currentStep
  }, [currentStep])

  // Adjust container width based on step
  const getContainerStyle = () => {
    if (currentStep === 0) return { maxWidth: 1000, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column' as const } // Hero
    if (currentStep === 4) return { maxWidth: 900, margin: '0 auto' } // Results
    return { maxWidth: 800, margin: '0 auto' } // Quick Setup & Modal steps
  }
  const containerStyle = getContainerStyle()

  return (
    <div style={containerStyle}>
      {/* Hero (Step 0) */}
      {currentStep === 0 && (
        <HeroStep
          workoutType={workoutType}
          setWorkoutType={setWorkoutType}
          onNext={() => goToStep(1)}
        />
      )}

      {/* Quick Setup (Step 1) */}
      {currentStep === 1 && (
        <QuickSetupStep
          workoutType={workoutType}
          setWorkoutType={setWorkoutType}
          workout={workout}
          setWorkout={setWorkout}
          split={split}
          setSplit={setSplit}
          liftLabel={labels.liftLabel}
          hiitLabel={labels.hiitLabel}
          liftMinutes={lift?.minutes}
          hiitMinutes={hiit?.minutes}
          focusSel={focusSel}
          equipSel={equipSel}
          onOpenFocusModal={() => goToStep(2)}
          onOpenEquipmentModal={() => goToStep(3)}
          onWorkOut={() => goToStep(4)}
          onBack={() => goToStep(0)}
        />
      )}

      {/* Training Focus (Step 2) */}
      <WizardStep stepNumber={2} currentStep={currentStep}>
        <div style={{
          background: 'linear-gradient(135deg, var(--panel), var(--panel-2))',
          backgroundAttachment: 'fixed',
          margin: '-20px -20px -20px -20px',
          padding: '40px 20px 40px 20px',
          minHeight: 'calc(100vh - 60px)',
          overflowX: 'hidden',
        }}>
          <div style={{
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '0 16px'
          }}>
            {/* Back button */}
            <button
              type="button"
              onClick={() => goToStep(1)}
              style={{
                background: 'rgba(var(--bg-rgb), 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 16px',
                color: 'var(--text)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(var(--bg-rgb), 0.8)'
                e.currentTarget.style.transform = 'translateX(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(var(--bg-rgb), 0.6)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <span>←</span>
              <span>Back</span>
            </button>

            {/* Title */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              margin: 0,
              marginBottom: '20px',
              textAlign: 'center',
            }}>
              Training Focus
            </h2>

            {/* Training Focus Selection */}
            <div style={{
              background: 'rgba(var(--bg-rgb), 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderTop: '1px solid rgba(255, 255, 255, 0.35)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
              marginBottom: '20px',
            }}>
              <TrainingFocusStep
                focusSel={focusSel}
                setFocusSel={setFocusSel}
                collapsible={false}
                hideTitle={true}
              />
            </div>

            {/* Done Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <button
                type="button"
                onClick={() => goToStep(1)}
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
                  maxWidth: '280px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </WizardStep>

      {/* Equipment (Step 3) */}
      <WizardStep stepNumber={3} currentStep={currentStep}>
        <div style={{
          background: 'linear-gradient(135deg, var(--panel), var(--panel-2))',
          backgroundAttachment: 'fixed',
          margin: '-20px -20px -20px -20px',
          padding: '40px 20px 40px 20px',
          minHeight: 'calc(100vh - 60px)',
          overflowX: 'hidden',
        }}>
          <div style={{
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '0 16px'
          }}>
            {/* Back button */}
            <button
              type="button"
              onClick={() => goToStep(1)}
              style={{
                background: 'rgba(var(--bg-rgb), 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 16px',
                color: 'var(--text)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(var(--bg-rgb), 0.8)'
                e.currentTarget.style.transform = 'translateX(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(var(--bg-rgb), 0.6)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <span>←</span>
              <span>Back</span>
            </button>

            {/* Title */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              margin: 0,
              marginBottom: '20px',
              textAlign: 'center',
            }}>
              Equipment
            </h2>

            {/* Equipment Selection */}
            <div style={{
              background: 'rgba(var(--bg-rgb), 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderTop: '1px solid rgba(255, 255, 255, 0.35)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
              marginBottom: '20px',
            }}>
              <EquipmentStep
                equipSel={equipSel}
                setEquipSel={setEquipSel}
                allowedEquip={allowedEquip}
                collapsible={false}
                hideTitle={true}
              />
            </div>

            {/* Done Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <button
                type="button"
                onClick={() => goToStep(1)}
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
                  maxWidth: '280px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </WizardStep>

      {/* Workout Results (Step 4) */}
      <WizardStep stepNumber={4} currentStep={currentStep}>
        <div style={{
          background: 'linear-gradient(135deg, var(--panel), var(--panel-2))',
          backgroundAttachment: 'fixed',
          margin: '-20px -20px -20px -20px',
          padding: '40px 20px 40px 20px',
          minHeight: 'calc(100vh - 60px)',
          overflowX: 'hidden',
          overscrollBehavior: 'none',
          WebkitOverflowScrolling: 'auto',
        }}>
          {/* Back button */}
          <button
            type="button"
            onClick={() => goToStep(1)}
            style={{
              background: 'rgba(var(--bg-rgb), 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: 'var(--text)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(var(--bg-rgb), 0.8)'
              e.currentTarget.style.transform = 'translateX(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(var(--bg-rgb), 0.6)'
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            <span>←</span>
            <span>Back to Setup</span>
          </button>

          <Board layout="stacked" />
        </div>
      </WizardStep>
    </div>
  )
}

export default function WizardControls() {
  return (
    <>
      <WizardSettings />
      <WizardContainer totalSteps={5}>
        <WizardSteps />
      </WizardContainer>
    </>
  )
}
