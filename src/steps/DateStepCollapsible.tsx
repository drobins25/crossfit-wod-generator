import React from 'react'

interface Props {
  date: string
  setDate: (date: string) => void
  collapsible?: boolean
}

export function DateStepCollapsible({ date, setDate, collapsible = false }: Props) {
  const [collapsed, setCollapsed] = React.useState(collapsible)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // --- Date helpers ---
  const toISO = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const da = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${da}`
  }

  const parseISO = (s: string) => {
    const [y, m, d] = s.split('-').map(Number)
    const out = new Date()
    out.setFullYear(y, (m ?? 1) - 1, d ?? 1)
    out.setHours(0, 0, 0, 0)
    return out
  }

  const fmt = React.useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    []
  )

  const move = (delta: number) => {
    const base = parseISO(date)
    base.setDate(base.getDate() + delta)
    setDate(toISO(base))
  }

  const openNative = () => {
    const el = inputRef.current
    if (!el) return
    el.value = date
    if (typeof el.showPicker === 'function') {
      el.showPicker()
    } else {
      el.focus()
      el.click()
    }
  }

  const label = React.useMemo(() => fmt.format(parseISO(date)), [date, fmt])
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  const sectionClass = collapsible
    ? `section collapsible ${collapsed ? 'collapsed' : ''}`
    : 'section'

  return (
    <section className={sectionClass}>
      <div
        className="section-header"
        onClick={() => collapsible && setCollapsed(!collapsed)}
        style={{ cursor: collapsible ? 'pointer' : 'default' }}
      >
        <h3>📅 Workout Date</h3>
        {collapsible && (
          <span className="collapse-icon" style={{ fontSize: '12px' }}>
            {collapsed ? '▾' : '▴'}
          </span>
        )}
      </div>

      {!collapsed && (
        <div className="segmented-wrap block-row" style={{ marginTop: 16 }} onClick={stop}>
          <h3 style={{ fontSize: 'xx-small', textAlign: 'center', marginBottom: 12 }}>
            Pick the day you want to train
          </h3>
          <div className="segmented-grid segmented-3 date-grid" role="group" aria-label="Session date">
            <button type="button" className="segmented-btn" onClick={() => move(-1)}>
              ← Prev
            </button>
            <button
              type="button"
              className="segmented-btn is-active"
              onClick={openNative}
              aria-haspopup="dialog"
              aria-label="Open calendar"
              title="Open calendar"
            >
              {label}
            </button>
            <button type="button" className="segmented-btn" onClick={() => move(1)}>
              Next →
            </button>
          </div>
          <input
            ref={inputRef}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              opacity: 0,
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />
        </div>
      )}
    </section>
  )
}
