import React, { useEffect, useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function OptionsModal({ isOpen, onClose, children }: Props) {
  const [modalTop, setModalTop] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Calculate position relative to Quick Setup section
      const quickSetup = document.getElementById('quick-setup')
      if (quickSetup) {
        const rect = quickSetup.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop

        // Position modal at 40% down the Quick Setup section
        // This centers it over the actual content area rather than the full container
        const quickSetupTop = rect.top + scrollTop
        const quickSetupHeight = rect.height
        const modalPosition = quickSetupTop + (quickSetupHeight * 0.4)

        setModalTop(modalPosition)
      } else {
        // Fallback to viewport center
        setModalTop(null)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const modalStyle = modalTop !== null
    ? {
        position: 'absolute' as const,
        top: modalTop,
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    : {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }

  return (
    <>
      {/* Glass backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        style={{
          ...modalStyle,
          zIndex: 1001,
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
          background: 'linear-gradient(135deg, rgba(var(--bg-rgb), 0.95), rgba(var(--bg-rgb), 0.9))',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderTop: '1px solid rgba(255, 255, 255, 0.35)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
          borderRadius: '16px',
          padding: '24px',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  )
}
