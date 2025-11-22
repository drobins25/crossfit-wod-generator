import React, { createContext, useContext, useState, ReactNode } from 'react'

interface WizardContextType {
  currentStep: number
  totalSteps: number
  goNext: () => void
  goPrev: () => void
  goToStep: (step: number) => void
  canGoNext: boolean
  canGoPrev: boolean
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

interface WizardProviderProps {
  children: ReactNode
  totalSteps: number
  onComplete?: () => void
}

export function WizardProvider({ children, totalSteps, onComplete }: WizardProviderProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else if (onComplete) {
      onComplete()
    }
  }

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step)
    }
  }

  const canGoNext = currentStep < totalSteps - 1
  const canGoPrev = currentStep > 0

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        totalSteps,
        goNext,
        goPrev,
        goToStep,
        canGoNext,
        canGoPrev,
      }}
    >
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider')
  }
  return context
}
