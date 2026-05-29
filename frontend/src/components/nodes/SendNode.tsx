import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { NodeType, NodeData } from '../../types/workflow'
import { PALETTE_CONFIG } from './nodeConfig'
import NodeIcon from './NodeIcon'

const HANDLE_STYLE: React.CSSProperties = { width: 14, height: 14, zIndex: 50, border: '2.5px solid white' }

export default function SendNode({ type, data, selected }: NodeProps) {
  const nodeType = type as NodeType
  const nodeData = data as unknown as NodeData
  const config = PALETTE_CONFIG[nodeType]

  return (
    <div
      style={{ width: 220 }}
      className={`rounded-xl border-2 overflow-visible bg-white shadow-sm transition-all ${
        selected ? `${config.borderClass} shadow-md` : 'border-gray-200'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ ...HANDLE_STYLE, backgroundColor: '#9ca3af' }}
      />

      <div className={`${config.colorClass} px-3 py-2 flex items-center gap-2 text-white rounded-t-[10px]`}>
        <NodeIcon type={nodeType} />
        <span className="text-xs font-bold tracking-widest uppercase">{config.label}</span>
      </div>

      <div className="px-3 py-2.5 rounded-b-[10px]">
        {nodeData.messageTemplate ? (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {nodeData.messageTemplate as string}
          </p>
        ) : (
          <p className="text-xs text-gray-300 italic">Aucun message configuré</p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ ...HANDLE_STYLE, backgroundColor: '#9ca3af' }}
      />
    </div>
  )
}
