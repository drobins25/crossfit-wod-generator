import React, { useEffect, useMemo } from 'react'
import { useWorkoutType } from '../workoutTypes/context'
import { getEquipmentForType, getSessionLabels } from '../workoutTypes/registry'
import { useBoard } from '../store'
import { HeroStep, QuickSetupStep } from '../steps'
import { WizardContainer } from './WizardContainer'
import { WizardStep } from './WizardStep'
import { WizardSettings } from './WizardSettings'
import { useWizard } from './WizardContext'
import Board from '../Board'
import type { Equipment } from '../types/WodMovements'

function WizardSteps() {
  const { currentStep } = useWizard()
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

  // Re-generate when inputs change
  useEffect(() => {
    generateAll()
  }, [date, equipSel, focusSel, workout, split])

  // Adjust container width based on step
  // Hero step can be wider, form steps at 800px, results at 900px
  const isResultsStep = currentStep === 2
  const isHeroStep = currentStep === 0
  const containerStyle = isResultsStep
    ? { maxWidth: 900, margin: '0 auto' }
    : isHeroStep
    ? { maxWidth: 1000, margin: '0 auto' }
    : { maxWidth: 800, margin: '0 auto' }

  return (
    <div style={containerStyle}>
      <WizardStep stepNumber={0} currentStep={currentStep}>
        <HeroStep />
      </WizardStep>

      <WizardStep stepNumber={1} currentStep={currentStep}>
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
          date={date}
          setDate={setDate}
        />
      </WizardStep>

      <WizardStep stepNumber={2} currentStep={currentStep}>
        <div style={{
          background: 'linear-gradient(135deg, var(--panel), var(--panel-2))',
          backgroundAttachment: 'fixed',
          margin: '-20px -20px 0 -20px',
          padding: '40px 20px 20px 20px',
          minHeight: 'calc(100vh - 60px)'
        }}>
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
      <WizardContainer totalSteps={3}>
        <WizardSteps />
      </WizardContainer>
    </>
  )
}
