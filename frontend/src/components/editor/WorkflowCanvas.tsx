import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  type Connection,
} from '@xyflow/react'
import { useWorkflowStore } from '../../store/workflowStore'
import { nodeTypes } from '../nodes'
import type { NodeType, WorkflowNode } from '../../types/workflow'
import { getDefaultData } from '../nodes/nodeConfig'

interface Props {
  onAddNode: (type: NodeType, position?: { x: number; y: number }) => void
}

export default function WorkflowCanvas({ onAddNode }: Props) {
  const nodes = useWorkflowStore((s) => s.nodes)
  const edges = useWorkflowStore((s) => s.edges)
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange)
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange)
  const onConnect = useWorkflowStore((s) => s.onConnect)
  const { screenToFlowPosition } = useReactFlow()

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const type = e.dataTransfer.getData('reactflow/type') as NodeType
      if (!type) return
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      onAddNode(type, position)
    },
    [screenToFlowPosition, onAddNode]
  )

  const isValidConnection = useCallback(
    (connection: Connection) => {
      // Prevent self-loops
      return connection.source !== connection.target
    },
    []
  )

  const selectedNode = nodes.find((n) => n.selected) as WorkflowNode | undefined

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onDragOver={onDragOver}
      onDrop={onDrop}
      isValidConnection={isValidConnection}
      deleteKeyCode={['Backspace', 'Delete']}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      className="bg-gray-50"
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
      <Controls className="!shadow-sm !border !border-gray-200 !rounded-xl overflow-hidden" />
      <MiniMap
        nodeColor={(node) => {
          const type = node.type as NodeType
          const colors: Record<NodeType, string> = {
            start: '#10b981', send_email: '#3b82f6', send_sms: '#8b5cf6',
            send_whatsapp: '#22c55e', send_postal: '#f97316',
            delay: '#f59e0b', condition: '#0ea5e9', end: '#475569',
          }
          return colors[type] ?? '#e5e7eb'
        }}
        className="!border !border-gray-200 !rounded-xl overflow-hidden !shadow-sm"
      />
    </ReactFlow>
  )
}
