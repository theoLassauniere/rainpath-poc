import { Handle, Position, type NodeProps } from '@xyflow/react'
import NodeIcon from './NodeIcon'

const HANDLE_STYLE: React.CSSProperties = { width: 14, height: 14, zIndex: 50, border: '2.5px solid white' }

export default function StartNode({ selected }: NodeProps) {
  return (
    <div
      style={{ width: 220 }}
      className={`rounded-xl border-2 overflow-visible bg-white shadow-sm transition-all ${
        selected ? 'border-emerald-400 shadow-emerald-100 shadow-md' : 'border-gray-200'
      }`}
    >
      <div className="bg-emerald-500 px-3 py-2 flex items-center gap-2 rounded-t-[10px]">
        <NodeIcon type="start" className="w-3.5 h-3.5 text-white shrink-0" />
        <span className="text-white text-xs font-bold tracking-widest uppercase">Départ</span>
      </div>
      <div className="px-3 py-2.5 text-sm text-gray-600 font-medium rounded-b-[10px]">
        Examen effectué
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ ...HANDLE_STYLE, backgroundColor: '#10b981' }}
      />
    </div>
  )
}
