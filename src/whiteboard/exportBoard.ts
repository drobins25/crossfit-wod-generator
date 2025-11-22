import html2canvas from 'html2canvas'

export async function exportBoardToPng(el: HTMLElement | null, filename='wod.png'){
  if (!el) return

  // Find all collapsible sections (warmup and cooldown)
  const collapsibles = el.querySelectorAll<HTMLElement>('[data-collapsible]')
  const originalStyles: { element: HTMLElement; gridTemplateRows: string; transition: string }[] = []

  // Temporarily expand all collapsible sections for the screenshot
  collapsibles.forEach((collapsible) => {
    const computedStyle = window.getComputedStyle(collapsible)
    originalStyles.push({
      element: collapsible,
      gridTemplateRows: computedStyle.gridTemplateRows,
      transition: computedStyle.transition,
    })
    // Disable transition and expand
    collapsible.style.transition = 'none'
    collapsible.style.gridTemplateRows = '1fr'
  })

  // Wait a moment for the layout to settle
  await new Promise(resolve => setTimeout(resolve, 50))

  const canvas = await html2canvas(el, { backgroundColor: null, scale: 2 })

  // Restore original styles
  originalStyles.forEach(({ element, gridTemplateRows, transition }) => {
    element.style.gridTemplateRows = gridTemplateRows
    element.style.transition = transition
  })

  // Try to use Web Share API (works on iOS and allows saving to Photos)
  if (navigator.share && navigator.canShare) {
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      })

      // Create a File object from the blob
      const file = new File([blob], filename, { type: 'image/png' })

      // Check if we can share files
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'WOD',
          text: 'My workout for today'
        })
        return
      }
    } catch (err) {
      // If share fails or is cancelled, fall through to download
      console.log('Share failed or cancelled:', err)
    }
  }

  // Fallback to download for desktop or if share fails
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

export default exportBoardToPng
