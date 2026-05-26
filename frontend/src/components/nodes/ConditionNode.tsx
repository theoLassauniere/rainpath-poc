import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { NodeData } from '../../types/workflow'

const FIELD_LABELS: Record<string, string> = {
  email:           'Email connu ?',
  phone:           'Téléphone connu ?',
  whatsapp:        'WhatsApp disponible ?',
  address:         'Adresse connue ?',
  email_delivered: 'Email délivré ?',
  email_opened:    'Email ouvert ?',
  email_rejected:  'Email rejeté ?',
  sms_delivered:   'SMS délivré ?',
}

export default function ConditionNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as NodeData
  const field = nodeData.conditionField as string | undefined
  const condLabel = field ? FIELD_LABELS[field] : 'Condition non configurée'
  const typeLabel = nodeData.conditionType === 'action_result' ? 'Résultat' : 'Disponibilité'

  // Node height: header 36px + row-oui 40px + row-non 40px = 116px
  // Oui handle: center of row 1 → top = (36 + 20) / 116 ≈ 48%
  // Non handle: center of row 2 → top = (36 + 40 + 20) / 116 ≈ 83%

  return (
    <div
      style={{ width: 240 }}
      className={`rounded-xl border-2 overflow-visible bg-white shadow-sm transition-all ${
        selected ? 'border-sky-400 shadow-sky-100 shadow-md' : 'border-gray-200'
      }`}
    >
      {/* Target — left */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 14, height: 14, zIndex: 50, border: '2.5px solid white', backgroundColor: '#9ca3af' }}
      />

      {/* Header */}
      <div className="bg-sky-500 px-3 py-2 flex items-center gap-2 text-white rounded-t-[10px]">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-bold tracking-widest uppercase">Condition</span>
        <span className="ml-auto text-[10px] bg-white/20 rounded px-1.5 py-0.5 font-medium shrink-0">
          {typeLabel}
        </span>
      </div>

      {/* Oui row */}
      <div className="relative h-10 flex items-center px-3 border-b border-gray-100">
        <p className="text-sm text-gray-700 font-medium truncate pr-12">{condLabel}</p>
        <span className="absolute right-5 text-[10px] font-bold text-emerald-500">Oui</span>
        <Handle
          type="source"
          position={Position.Right}
          id="yes"
          style={{ width: 14, height: 14, zIndex: 50, border: '2.5px solid white', backgroundColor: '#10b981', top: '48%' }}
        />
      </div>

      {/* Non row */}
      <div className="relative h-10 flex items-center px-3 rounded-b-[10px]">
        <span className="absolute right-5 text-[10px] font-bold text-red-400">Non</span>
        <Handle
          type="source"
          position={Position.Right}
          id="no"
          style={{ width: 14, height: 14, zIndex: 50, border: '2.5px solid white', backgroundColor: '#f87171', top: '83%' }}
        />
      </div>
    </div>
  )
}
