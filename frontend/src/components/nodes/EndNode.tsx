import { Handle, Position, type NodeProps } from '@xyflow/react'
import NodeIcon from './NodeIcon'

const HANDLE_STYLE: React.CSSProperties = { width: 14, height: 14, zIndex: 50, border: '2.5px solid white' }

export default function EndNode({ selected }: NodeProps) {
  return (
    <div
      style={{ width: 220 }}
      className={`rounded-xl border-2 overflow-visible bg-white shadow-sm transition-all ${
        selected ? 'border-slate-500 shadow-slate-100 shadow-md' : 'border-gray-200'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ ...HANDLE_STYLE, backgroundColor: '#9ca3af' }}
      />

      <div className="bg-slate-600 px-3 py-2 flex items-center gap-2 text-white rounded-t-[10px]">
        <NodeIcon type="end" />
        <span className="text-xs font-bold tracking-widest uppercase">Fin</span>
      </div>

      <div className="px-3 py-2.5 text-sm text-gray-500 rounded-b-[10px]">
        Fin du workflow
      </div>
    </div>
  )
}
