import React from 'react'

const howToUrl = (label: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(label + ' exercise how to')}`

export const extractMovementName = (line: string): string | null => {
  let t = (line ?? '').trim()

  // skip obvious headers
  if (/^round\s+\d+/i.test(t)) return null

  // drop leading bullet chars
  t = t.replace(/^[•\-\u2022]\s*/, '')

  // strip labels like "A:", "B:", "Step 2:", "R1:", "Round 2:"
  t = t.replace(/^(?:A|B|Step|R(?:ound)?\s*\d*):\s*/i, '')

  // remove odd/even prefixes
  t = t.replace(/^(?:odd|even)\s+minutes?\s*[-—:]\s*/i, '')

  // prefer the left side before an em dash (often "name — details")
  t = t.split('—')[0].trim()

  // stop at reps/load/tempo markers: " × 10×2s", " x 12", " @ 60%"
  t = t.replace(/\s*(?:×|x|@)\s*.*$/i, '')

  // strip trailing parentheticals (e.g., "(meters)", "(alt)", "(each)")
  while (/\([^)]*\)\s*$/.test(t)) t = t.replace(/\s*\([^)]*\)\s*$/, '')

  // small normalization
  t = t.replace(/\bL\/R\b/gi, 'Left/Right') // nicer search term
  t = t.replace(/\s{2,}/g, ' ').trim()

  if (!t || /^round\s+\d+/i.test(t)) return null
  return t
}

interface Props {
  label: string
  className?: string
  style?: React.CSSProperties
}

export function MovementLink({ label, className = 'small', style }: Props) {
  return (
    <a
      href={howToUrl(label)}
      target="_blank"
      rel="noreferrer"
      className={className}
      aria-label={`How to: ${label}`}
      title={`How to: ${label}`}
      style={{
        whiteSpace: 'nowrap',
        marginRight: 20,
        marginLeft: 6,
        opacity: 0.8,
        textDecoration: 'none',
        ...style,
      }}
    >
      🔍
    </a>
  )
}
