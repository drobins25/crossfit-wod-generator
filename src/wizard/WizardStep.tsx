import React, { ReactNode, useEffect, useState } from 'react'

interface WizardStepProps {
  children: ReactNode
  stepNumber: number
  currentStep: number
}

export function WizardStep({ children, stepNumber, currentStep }: WizardStepProps) {
  const [prevStep, setPrevStep] = useState(currentStep)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  useEffect(() => {
    if (currentStep !== prevStep) {
      setDirection(currentStep > prevStep ? 'forward' : 'backward')
      setPrevStep(currentStep)
    }
  }, [currentStep, prevStep])

  if (stepNumber !== currentStep) {
    return null
  }

  return (
    <div className={`wizard-step wizard-step-${direction}`} key={stepNumber}>
      {children}
    </div>
  )
}
