import React from 'react'
import { OptionsModal } from './OptionsModal'
import { EquipmentStep } from './EquipmentStep'
import type { Equipment } from '../types/WodMovements'

interface Props {
  isOpen: boolean
  onClose: () => void
  equipSel: Equipment[]
  setEquipSel: (equip: Equipment[]) => void
  allowedEquip: Equipment[]
}

export function EquipmentModal({ isOpen, onClose, equipSel, setEquipSel, allowedEquip }: Props) {
  return (
    <OptionsModal isOpen={isOpen} onClose={onClose}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '70vh',
      }}>
        {/* Title */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          margin: 0,
          marginBottom: '20px',
          textAlign: 'center',
          flexShrink: 0,
        }}>
          Equipment
        </h2>

        {/* Equipment Selection - Scrollable */}
        <div style={{
          background: 'rgba(var(--bg-rgb), 0.5)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderTop: '1px solid rgba(255, 255, 255, 0.35)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
          flex: 1,
          overflowY: 'auto',
          marginBottom: '20px',
        }}>
          <EquipmentStep
            equipSel={equipSel}
            setEquipSel={setEquipSel}
            allowedEquip={allowedEquip}
            collapsible={false}
            hideTitle={true}
          />
        </div>

        {/* Done Button - Fixed at bottom */}
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #ef4444, #22c55e)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '32px',
            padding: '16px 48px',
            fontSize: '18px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            color: 'white',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            width: '100%',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)'
          }}
        >
          Done
        </button>
      </div>
    </OptionsModal>
  )
}
