import { create } from 'zustand'
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react'
import type { WorkflowNode, WorkflowEdge, WorkflowStatus } from '../types/workflow'

interface WorkflowState {
  workflowId: number | null
  name: string
  description: string
  status: WorkflowStatus | null
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  isDirty: boolean

  setMeta: (name: string, description: string) => void
  setWorkflow: (
    id: number | null,
    name: string,
    description: string,
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    status?: WorkflowStatus,
  ) => void
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void
  onEdgesChange: (changes: EdgeChange<WorkflowEdge>[]) => void
  onConnect: (connection: Connection) => void
  updateNodeData: (id: string, data: Partial<WorkflowNode['data']>) => void
  addNode: (node: WorkflowNode) => void
  markSaved: (id: number) => void
  reset: () => void
}

const initialState = {
  workflowId: null,
  name: 'Nouveau workflow',
  description: '',
  status: null as WorkflowStatus | null,
  nodes: [] as WorkflowNode[],
  edges: [] as WorkflowEdge[],
  isDirty: false,
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  ...initialState,

  setMeta: (name, description) =>
    set({ name, description, isDirty: true }),

  setWorkflow: (id, name, description, nodes, edges, status = 'DRAFT') =>
    set({ workflowId: id, name, description, status, nodes, edges, isDirty: false }),

  onNodesChange: (changes) =>
    set((s) => ({
      nodes: applyNodeChanges(changes, s.nodes) as WorkflowNode[],
      isDirty: true,
    })),

  onEdgesChange: (changes) =>
    set((s) => ({
      edges: applyEdgeChanges(changes, s.edges) as WorkflowEdge[],
      isDirty: true,
    })),

  onConnect: (connection) =>
    set((s) => ({
      edges: addEdge(connection, s.edges) as WorkflowEdge[],
      isDirty: true,
    })),

  updateNodeData: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
      isDirty: true,
    })),

  addNode: (node) =>
    set((s) => ({ nodes: [...s.nodes, node], isDirty: true })),

  markSaved: (id) =>
    set({ workflowId: id, isDirty: false }),

  reset: () => set(initialState),
}))
