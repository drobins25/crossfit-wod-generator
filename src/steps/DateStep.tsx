import React from 'react'

interface Props {
  date: string
  setDate: (date: string) => void
}

export function DateStep({ date, setDate }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  // --- local-safe ISO helpers (avoid TZ off-by-one) ---
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
    // keep in sync before opening
    el.value = date
    // Modern Chromium / Safari 16.4+
    if (typeof el.showPicker === 'function') {
      el.showPicker()
    } else {
      // Fallback
      el.focus()
      el.click()
    }
  }

  const label = React.useMemo(() => fmt.format(parseISO(date)), [date, fmt])

  return (
    <div>
      <div className="marker head" style={{ marginBottom: '8px', textAlign: 'center' }}>Workout Date</div>
      <h3 style={{ fontSize: 'xx-small', textAlign: 'center', opacity: 0.7, marginBottom: '16px' }}>
        Pick the day you want to train. Tap the center date to open the calendar.
      </h3>

      {/* The visible 3-button row */}
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

      {/* Hidden native date input the center button triggers */}
      <input
        ref={inputRef}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        // visually hidden but still interactive for showPicker()/click()
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
  )
}
