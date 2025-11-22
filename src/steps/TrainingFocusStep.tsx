import React from 'react'
import { ALL_MUSCLE_GROUPS, MuscleGroup, MUSCLE_LABEL } from '../types/WodMovements'

interface Props {
  focusSel: MuscleGroup[]
  setFocusSel: (focus: MuscleGroup[]) => void
  collapsible?: boolean
  defaultCollapsed?: boolean
  onExpandChange?: (expanded: boolean) => void
  overlayMode?: boolean
}

export function TrainingFocusStep({ focusSel, setFocusSel, collapsible = false, defaultCollapsed = false, onExpandChange, overlayMode = false }: Props) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  const toggleCollapsed = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    onExpandChange?.(!newCollapsed)
  }
  const [focusAllSticky, setFocusAllSticky] = React.useState(true)

  // Keep sticky button visually in sync if focusSel changes externally
  const allFocusSelected = focusSel.length === ALL_MUSCLE_GROUPS.length
  React.useEffect(() => {
    setFocusAllSticky(allFocusSelected)
  }, [allFocusSelected])

  const toggleAllFocusButtons = (checked: boolean) => {
    setFocusAllSticky(checked)
    setFocusSel(checked ? [...ALL_MUSCLE_GROUPS] : [])
  }

  // Stop header toggle when clicking controls in the header
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  const sectionClass = collapsible
    ? `section collapsible ${collapsed ? 'collapsed' : ''}`
    : 'section'

  const headerContent = collapsible ? (
    <div
      className="section-head"
      onClick={toggleCollapsed}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggleCollapsed()
        }
      }}
    >
      <div className="section-title">
        <span className="section-title-row">Training Focus</span>
      </div>

      <div className="section-actions" onClick={stop}>
        {/* Select all → segmented button (matches Equipment) */}
        <button
          type="button"
          className={`segmented-btn sm ${focusAllSticky ? 'is-active' : ''}`}
          aria-pressed={focusAllSticky}
          onClick={(e) => {
            e.stopPropagation()
            toggleAllFocusButtons(!focusAllSticky)
          }}
          title="Select all focus areas"
        >
          Select all
        </button>

        {!collapsed && (
          <button
            className="btn ghost sm"
            onClick={(e) => {
              e.stopPropagation()
              setCollapsed(true)
              onExpandChange?.(false)
            }}
          >
            Done
          </button>
        )}
        <span className="chev">▾</span>
      </div>
    </div>
  ) : (
    <div className="segmented-wrap block-row">
      <div className="segmented-title marker line center">Training Focus</div>
      <h3 style={{ fontSize: 'xx-small', textAlign: 'center' }}>
        Choose which muscle groups to target (checked) or avoid (unchecked).
      </h3>
      <div style={{ marginBottom: 12, textAlign: 'center' }}>
        <button
          type="button"
          className={`segmented-btn sm ${focusAllSticky ? 'is-active' : ''}`}
          aria-pressed={focusAllSticky}
          onClick={() => toggleAllFocusButtons(!focusAllSticky)}
          title="Select all focus areas"
        >
          Select all
        </button>
      </div>
    </div>
  )

  const bodyStyle = overlayMode && !collapsed ? {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1001,
    marginTop: '8px',
    background: 'var(--panel)',
    borderRadius: '12px',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.3)',
  } : overlayMode ? {
    display: 'none'
  } : undefined

  const sectionStyle = overlayMode ? {
    overflow: 'visible'
  } : undefined

  return (
    <section className={sectionClass} aria-expanded={!collapsed} aria-label="Focus Areas section" style={sectionStyle}>
      {headerContent}

      <div className={collapsible ? 'section-body padded' : ''} style={bodyStyle}>
        <div>
          {/* segmented button grid instead of checkboxes */}
          <div
            className="segmented-grid segmented-auto focus-grid"
            role="group"
            aria-label="Training focus"
            onClick={(e) => e.stopPropagation()}
          >
            {ALL_MUSCLE_GROUPS.map((mg) => {
              const active = focusSel.includes(mg)
              return (
                <button
                  key={mg}
                  type="button"
                  className={`segmented-btn ${active ? 'is-active' : ''}`}
                  aria-pressed={active}
                  title={MUSCLE_LABEL[mg]}
                  onClick={(e) => {
                    e.stopPropagation()
                    setFocusSel((s) => {
                      const next = active ? s.filter((x) => x !== mg) : [...s, mg]

                      // keep sticky state honest:
                      if (focusAllSticky && next.length !== ALL_MUSCLE_GROUPS.length) {
                        setFocusAllSticky(false)
                      } else if (!focusAllSticky && next.length === ALL_MUSCLE_GROUPS.length) {
                        setFocusAllSticky(true)
                      }
                      return next
                    })
                  }}
                >
                  {MUSCLE_LABEL[mg]}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
