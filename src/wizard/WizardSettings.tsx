import React, { useState } from 'react'
import { useWorkoutType } from '../workoutTypes/context'
import { getEquipmentForType } from '../workoutTypes/registry'
import { useBoard } from '../store'
import { DateStep, EquipmentStep, TrainingFocusStep } from '../steps'
import type { Equipment } from '../types/WodMovements'

export function WizardSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const { workoutType } = useWorkoutType()
  const { date, setDate, equipSel, setEquipSel, focusSel, setFocusSel } = useBoard()

  const allowedEquip: Equipment[] = React.useMemo(() => {
    return getEquipmentForType(workoutType)
  }, [workoutType])

  return (
    <>
      {/* Single persistent header */}
      <div className="wizard-header">
        {/* Branding */}
        <div style={{
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '0.3px',
        }}>
          WODSpark
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text)',
            fontSize: isOpen ? '28px' : '14px',
            padding: isOpen ? '4px 8px' : '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            transition: 'background 0.2s',
            fontWeight: isOpen ? 300 : 500,
            lineHeight: 1,
            minWidth: isOpen ? '36px' : 'auto',
            minHeight: isOpen ? '36px' : 'auto',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--panel-2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          title={isOpen ? "Close Settings" : "Workout Settings"}
        >
          {isOpen ? '✕' : 'Settings'}
        </button>
      </div>

      {/* Full Screen Settings Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
              animation: 'fadeIn 0.2s ease-out',
            }}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content (without duplicate header) */}
          <div
            style={{
              position: 'fixed',
              top: 'var(--wizard-header-height, 60px)',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(var(--bg-rgb, 255, 255, 255), 0.4)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              zIndex: 1000,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInFromBottom 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{
              flex: 1,
              padding: '20px',
              maxWidth: '600px',
              width: '100%',
              margin: '0 auto',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}>
                <div style={{
                  background: 'rgba(var(--bg-rgb, 255, 255, 255), 0.5)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.35)',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
                }}>
                  <DateStep date={date} setDate={setDate} />
                </div>

                <div style={{
                  background: 'rgba(var(--bg-rgb, 255, 255, 255), 0.5)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.35)',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
                }}>
                  <EquipmentStep
                    allowedEquip={allowedEquip}
                    equipSel={equipSel}
                    setEquipSel={setEquipSel}
                    collapsible={true}
                  />
                </div>

                <div style={{
                  background: 'rgba(var(--bg-rgb, 255, 255, 255), 0.5)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.35)',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
                }}>
                  <TrainingFocusStep
                    focusSel={focusSel}
                    setFocusSel={setFocusSel}
                    collapsible={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
