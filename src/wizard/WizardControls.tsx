import React, { useEffect, useMemo } from 'react'
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

  // Scroll to Quick Setup section
  const scrollToQuickSetup = () => {
    const quickSetup = document.getElementById('quick-setup')
    if (quickSetup) {
      const headerOffset = 60 // Height of sticky header
      const elementPosition = quickSetup.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // Re-generate when inputs change
  useEffect(() => {
    generateAll()
  }, [date, equipSel, focusSel, workout, split])

  // Auto-scroll when step changes
  useEffect(() => {
    if (currentStep === 1) {
      // Scroll to Quick Setup
      requestAnimationFrame(() => {
        const quickSetup = document.getElementById('quick-setup')
        if (quickSetup) {
          const headerOffset = 60
          const rect = quickSetup.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const quickSetupTop = rect.top + scrollTop
          window.scrollTo({ top: quickSetupTop - headerOffset, behavior: 'auto' })
        }
      })
    } else if (currentStep === 4) {
      // Scroll to top of page (workout board)
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
      })
    }
  }, [currentStep])

  // Adjust container width based on step
  // Hero step can be wider, form steps at 800px, results at 900px
  const isResultsStep = currentStep === 4
  const isHeroStep = currentStep === 0
  const containerStyle = isResultsStep
    ? { maxWidth: 900, margin: '0 auto' }
    : isHeroStep
    ? { maxWidth: 1000, margin: '0 auto' }
    : { maxWidth: 800, margin: '0 auto' }

  return (
    <div style={containerStyle}>
      {/* Combined Hero + Quick Setup (Steps 0-1) */}
      {(currentStep === 0 || currentStep === 1) && (
        <>
          <HeroStep workoutType={workoutType} setWorkoutType={setWorkoutType} />
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
          />
        </>
      )}

      {/* Training Focus (Step 2) */}
      <WizardStep stepNumber={2} currentStep={currentStep}>
        <div style={{
          background: 'linear-gradient(135deg, var(--panel), var(--panel-2))',
          backgroundAttachment: 'fixed',
          margin: '-20px -20px -20px -20px',
          padding: '40px 20px 40px 20px',
          height: 'calc(100vh - 60px)',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '0 16px'
          }}>
            {/* Title */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              margin: 0,
              marginBottom: '20px',
              textAlign: 'center',
              flexShrink: 0,
            }}>
              Training Focus
            </h2>

            {/* Training Focus Selection - Scrollable */}
            <div style={{
              background: 'rgba(var(--bg-rgb), 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderTop: '1px solid rgba(255, 255, 255, 0.35)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
              flex: 1,
              overflowY: 'auto',
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
                flexShrink: 0,
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
      </WizardStep>

      {/* Equipment (Step 3) */}
      <WizardStep stepNumber={3} currentStep={currentStep}>
        <div style={{
          background: 'linear-gradient(135deg, var(--panel), var(--panel-2))',
          backgroundAttachment: 'fixed',
          margin: '-20px -20px -20px -20px',
          padding: '40px 20px 40px 20px',
          height: 'calc(100vh - 60px)',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '0 16px'
          }}>
            {/* Title */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              margin: 0,
              marginBottom: '20px',
              textAlign: 'center',
              flexShrink: 0,
            }}>
              Equipment
            </h2>

            {/* Equipment Selection - Scrollable */}
            <div style={{
              background: 'rgba(var(--bg-rgb), 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderTop: '1px solid rgba(255, 255, 255, 0.35)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
              flex: 1,
              overflowY: 'auto',
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
                flexShrink: 0,
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
      </WizardStep>

      {/* Workout Results (Step 4) */}
      <WizardStep stepNumber={4} currentStep={currentStep}>
        <div style={{
          background: 'linear-gradient(135deg, var(--panel), var(--panel-2))',
          backgroundAttachment: 'fixed',
          margin: '-20px -20px 0 -20px',
          padding: '40px 20px 20px 20px',
          minHeight: 'calc(100vh - 60px)'
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
