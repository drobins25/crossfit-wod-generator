import React, { useMemo, useRef } from 'react'
import { useBoard } from './store'
import { exportBoardToPng } from './whiteboard/exportBoard'
import { getSessionLabels, getEquipmentForType } from './workoutTypes/registry'
import { useWorkoutType } from './workoutTypes/context'
import { WorkoutStats, LiftBlock, HiitBlock, WarmupBlock, CooldownBlock, EquipmentStep, TrainingFocusStep } from './steps'
import type { Equipment } from './types/WodMovements'

interface BoardProps {
  layout?: 'grid' | 'stacked'
}

export default function Board({ layout = 'grid' }: BoardProps) {
  const { workoutType } = useWorkoutType()
  const labels = getSessionLabels(workoutType)
  const { date, split, workout, lift, hiit, warm, cool, primary, regenLift, regenHiit, equipSel, setEquipSel, focusSel, setFocusSel } = useBoard()
  const boardRef = useRef<HTMLDivElement>(null)

  const allowedEquip: Equipment[] = useMemo(() => {
    return getEquipmentForType(workoutType)
  }, [workoutType])

  const [warmupExpanded, setWarmupExpanded] = React.useState(false)
  const [cooldownExpanded, setCooldownExpanded] = React.useState(false)
  const [equipmentExpanded, setEquipmentExpanded] = React.useState(false)
  const [focusExpanded, setFocusExpanded] = React.useState(false)

  const overlayActive = layout === 'grid' && (equipmentExpanded || focusExpanded)

  return (
    <div style={{
      padding: layout === 'stacked' ? 0 : 16,
      overflow: 'hidden',
      position: 'relative',
      overscrollBehavior: 'none'
    }}>
      {/* Overlay backdrop */}
      {overlayActive && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 999,
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => {
            setEquipmentExpanded(false)
            setFocusExpanded(false)
          }}
        />
      )}

      <div ref={boardRef}>
        {/* Workout Stats Summary */}
        <WorkoutStats lift={lift} hiit={hiit} />

        <div className="divider" />

        {/* Equipment and Training Focus - side by side in grid layout */}
        {layout === 'grid' && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginTop: '16px',
              position: 'relative',
              zIndex: overlayActive ? 1000 : 'auto',
              marginBottom: overlayActive ? 0 : undefined
            }}>
              <div style={{ position: 'relative' }}>
                <EquipmentStep
                  allowedEquip={allowedEquip}
                  equipSel={equipSel}
                  setEquipSel={setEquipSel}
                  collapsible={true}
                  onExpandChange={setEquipmentExpanded}
                  overlayMode={true}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <TrainingFocusStep
                  focusSel={focusSel}
                  setFocusSel={setFocusSel}
                  collapsible={true}
                  defaultCollapsed={true}
                  onExpandChange={setFocusExpanded}
                  overlayMode={true}
                />
              </div>
            </div>
            <div className="divider" />
          </>
        )}

        {/* Warm-up dropdown - ABOVE workout sections */}
        <section
          className="mini-board warmup-accent animate"
          style={{
            marginTop: 16,
            marginBottom: 16,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderTop: '1px solid rgba(255, 255, 255, 0.35)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <div
            className="board-head"
            onClick={() => setWarmupExpanded(!warmupExpanded)}
            style={{ cursor: 'pointer', userSelect: 'none', marginBottom: warmupExpanded ? '10px' : '0' }}
          >
            <div
              className="marker head green"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>🟢 Warm-up</span>
              <span
                style={{
                  fontSize: '16px',
                  transition: 'transform 0.2s ease',
                  transform: warmupExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                ▾
              </span>
            </div>
          </div>

          <div
            data-collapsible="warmup"
            style={{
              display: 'grid',
              gridTemplateRows: warmupExpanded ? '1fr' : '0fr',
              transition: 'grid-template-rows 0.3s ease-out',
            }}
          >
            <div style={{
              overflow: 'hidden',
              opacity: warmupExpanded ? 1 : 0,
              transition: 'opacity 0.3s ease-out',
            }}>
              {warm ? (
                warm.map((w, i) => (
                  <div key={i} className="marker line list animate">
                    • {w}
                  </div>
                ))
              ) : (
                <div className="marker line list animate">—</div>
              )}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* Main Workout Sections */}
        <div
          className={layout === 'stacked' ? 'animate' : 'board-grid animate'}
          style={
            layout === 'stacked'
              ? { display: 'flex', flexDirection: 'column', gap: '16px' }
              : undefined
          }
        >
          <LiftBlock
            lift={lift}
            liftLabel={labels.liftLabel}
            workoutTypeLabel={labels.typeLabel}
            onRegenerate={regenLift}
          />
          <HiitBlock hiit={hiit} hiitLabel={labels.hiitLabel} onRegenerate={regenHiit} />
        </div>

        <div className="divider" />

        {/* Cool-down dropdown - BELOW workout sections */}
        <section
          className="mini-board cooldown-accent animate"
          style={{
            marginTop: 16,
            marginBottom: 16,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderTop: '1px solid rgba(255, 255, 255, 0.35)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <div
            className="board-head"
            onClick={() => setCooldownExpanded(!cooldownExpanded)}
            style={{ cursor: 'pointer', userSelect: 'none', marginBottom: cooldownExpanded ? '10px' : '0' }}
          >
            <div
              className="marker head blue-soft"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>🔵 Cool-down</span>
              <span
                style={{
                  fontSize: '16px',
                  transition: 'transform 0.2s ease',
                  transform: cooldownExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                ▾
              </span>
            </div>
          </div>

          <div
            data-collapsible="cooldown"
            style={{
              display: 'grid',
              gridTemplateRows: cooldownExpanded ? '1fr' : '0fr',
              transition: 'grid-template-rows 0.3s ease-out',
            }}
          >
            <div style={{
              overflow: 'hidden',
              opacity: cooldownExpanded ? 1 : 0,
              transition: 'opacity 0.3s ease-out',
            }}>
              {cool ? (
                cool.map((c, i) => (
                  <div key={i} className="marker line list animate">
                    • {c}
                  </div>
                ))
              ) : (
                <div className="marker line">—</div>
              )}
            </div>
          </div>
        </section>

        <div className="divider" />
      </div>

      {/* Export button moved to bottom */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, padding: '0 16px' }}>
        <button
          onClick={() => exportBoardToPng(boardRef.current!, 'wod.png')}
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
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)'
          }}
        >
          📥 Export WOD
        </button>
      </div>
    </div>
  )
}
