import React, { useEffect, useRef } from 'react'
import { Equipment, EQUIPMENT_LABEL } from '../types/WodMovements'

interface Props {
  allowedEquip: Equipment[]
  equipSel: Equipment[]
  setEquipSel: (equip: Equipment[]) => void
  collapsible?: boolean
  onExpandChange?: (expanded: boolean) => void
  overlayMode?: boolean
  hideTitle?: boolean
}

export function EquipmentStep({ allowedEquip, equipSel, setEquipSel, collapsible = false, onExpandChange, overlayMode = false, hideTitle = false }: Props) {
  const [collapsed, setCollapsed] = React.useState(collapsible)

  const toggleCollapsed = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    onExpandChange?.(!newCollapsed)
  }
  const [equipAllSticky, setEquipAllSticky] = React.useState(false)
  const allBoxRef = useRef<HTMLInputElement>(null)

  // On mount, read sticky flag from localStorage
  useEffect(() => {
    const sticky = localStorage.getItem('equipAllSticky') === '1'
    setEquipAllSticky(sticky)
  }, [])

  // Promote to sticky ONLY when user manually selects everything for this type
  useEffect(() => {
    const allForType = allowedEquip.length > 0 && allowedEquip.every((eq) => equipSel.includes(eq))
    if (allForType && !equipAllSticky) {
      setEquipAllSticky(true)
      localStorage.setItem('equipAllSticky', '1')
    }
  }, [equipSel, allowedEquip, equipAllSticky])

  // Show indeterminate state when partially selected (and not sticky)
  useEffect(() => {
    if (!allBoxRef.current) return
    const allForType = allowedEquip.length > 0 && allowedEquip.every((eq) => equipSel.includes(eq))
    const none = equipSel.length === 0
    allBoxRef.current.indeterminate = !allForType && !none && !equipAllSticky
  }, [equipSel, allowedEquip, equipAllSticky])

  // Equipment "Select all" — controlled by equipAllSticky; acts on allowedEquip for current type
  const toggleAllEquip = (checked: boolean) => {
    setEquipAllSticky(checked)
    localStorage.setItem('equipAllSticky', checked ? '1' : '0')
    setEquipSel(checked ? [...allowedEquip] : [])
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
      <div className="section-title">Equipment</div>

      <div className="section-actions" onClick={stop}>
        {/* Select all → button, reusing segmented styles */}
        <button
          type="button"
          className={`segmented-btn sm ${equipAllSticky ? 'is-active' : ''}`}
          aria-pressed={equipAllSticky}
          onClick={(e) => {
            e.stopPropagation()
            toggleAllEquip(!equipAllSticky)
          }}
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
      {!hideTitle && <div className="segmented-title marker line center">Equipment</div>}
      <h3 style={{ fontSize: 'xx-small', textAlign: 'center' }}>
        Select the gear you have available. We'll only use movements you can actually do.
      </h3>
      <div style={{ marginBottom: 12, textAlign: 'center' }}>
        <button
          type="button"
          className={`segmented-btn sm ${equipAllSticky ? 'is-active' : ''}`}
          aria-pressed={equipAllSticky}
          onClick={() => toggleAllEquip(!equipAllSticky)}
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
    <section className={sectionClass} aria-expanded={!collapsed} aria-label="Equipment section" style={sectionStyle}>
      {headerContent}

      <div className={collapsible ? 'section-body padded' : ''} style={bodyStyle}>
        <div>
          {/* segmented button grid instead of checkboxes */}
          <div
            className="segmented-grid segmented-auto equip-grid"
            role="group"
            aria-label="Equipment"
            onClick={(e) => e.stopPropagation()}
          >
            {allowedEquip.map((eq) => {
              const active = equipSel.includes(eq)
              return (
                <button
                  key={eq}
                  type="button"
                  className={`segmented-btn ${active ? 'is-active' : ''}`}
                  aria-pressed={active}
                  title={EQUIPMENT_LABEL[eq]}
                  onClick={(e) => {
                    e.stopPropagation()
                    setEquipSel((s) => {
                      const next = active ? s.filter((x) => x !== eq) : [...s, eq]
                      // if "Select all" was sticky and user toggles any chip off, unstick it
                      if (equipAllSticky && next.length !== allowedEquip.length) {
                        setEquipAllSticky(false)
                      }
                      return next
                    })
                  }}
                >
                  {EQUIPMENT_LABEL[eq]}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
