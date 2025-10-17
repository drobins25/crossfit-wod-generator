import html2canvas from 'html2canvas'
export async function exportBoardToPng(el: HTMLElement | null, filename='wod.png'){
  if (!el) return
  const canvas = await html2canvas(el, { backgroundColor: null, scale: 2 })
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
}
export default exportBoardToPng
