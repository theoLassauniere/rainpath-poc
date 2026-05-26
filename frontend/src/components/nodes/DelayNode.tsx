import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { NodeData } from '../../types/workflow'

const HANDLE_STYLE: React.CSSProperties = { width: 14, height: 14, zIndex: 50, border: '2.5px solid white' }

export default function DelayNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as NodeData
  const days = (nodeData.days as number) ?? 7

  return (
    <div
      style={{ width: 220 }}
      className={`rounded-xl border-2 overflow-visible bg-white shadow-sm transition-all ${
        selected ? 'border-amber-400 shadow-amber-100 shadow-md' : 'border-gray-200'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ ...HANDLE_STYLE, backgroundColor: '#9ca3af' }}
      />

      <div className="bg-amber-500 px-3 py-2 flex items-center gap-2 text-white rounded-t-[10px]">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-bold tracking-widest uppercase">Délai</span>
      </div>

      <div className="px-3 py-2.5 text-sm text-gray-700 font-medium rounded-b-[10px]">
        Attendre{' '}
        <span className="text-amber-600 font-bold">{days}</span>{' '}
        jour{days > 1 ? 's' : ''}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ ...HANDLE_STYLE, backgroundColor: '#f59e0b' }}
      />
    </div>
  )
}
