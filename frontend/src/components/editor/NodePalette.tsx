import type { NodeType } from '../../types/workflow'
import { PALETTE_GROUPS } from '../nodes/nodeConfig'

interface Props {
  onAddNode: (type: NodeType) => void
}

export default function NodePalette({ onAddNode }: Props) {
  function onDragStart(e: React.DragEvent, type: NodeType) {
    e.dataTransfer.setData('reactflow/type', type)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white overflow-y-auto flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Nodes</p>
      </div>

      <div className="flex flex-col gap-4 px-3 pb-4">
        {PALETTE_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-1 text-[11px] font-medium text-gray-400">{group.label}</p>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.type)}
                  onClick={() => onAddNode(item.type)}
                  className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 py-2 cursor-grab active:cursor-grabbing hover:border-gray-300 hover:shadow-sm transition-all select-none"
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.colorClass}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{item.label}</p>
                    <p className="text-[10px] text-gray-400 truncate">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto px-4 py-3 border-t border-gray-100">
        <p className="text-[10px] text-gray-300 text-center">
          Clic ou glisser-déposer
        </p>
      </div>
    </aside>
  )
}
