export type WorkflowStatus = 'DRAFT' | 'VALIDATED' | 'CANCELLED'

export type NodeType =
  | 'start'
  | 'send_email'
  | 'send_sms'
  | 'send_whatsapp'
  | 'send_postal'
  | 'delay'
  | 'condition'
  | 'end'

export interface NodeData {
  label: string
  // delay node
  days?: number
  // send nodes
  messageTemplate?: string
  // condition node
  conditionType?: 'data_availability' | 'action_result'
  conditionField?: string
  conditionOperator?: 'is_known' | 'is_unknown' | 'is_true' | 'is_false'
  // condition edge label
  edgeLabel?: string
  [key: string]: unknown
}

export interface WorkflowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: NodeData
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  label?: string
}

export interface Workflow {
  id: number
  name: string
  description?: string
  status: WorkflowStatus
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt: string
  updatedAt: string
}

export type WorkflowSummary = Pick<Workflow, 'id' | 'name' | 'description' | 'status' | 'createdAt' | 'updatedAt'>

export interface CreateWorkflowDto {
  name: string
  description?: string
  status?: WorkflowStatus
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export interface UpdateWorkflowDto {
  name?: string
  description?: string
  status?: WorkflowStatus
  nodes?: WorkflowNode[]
  edges?: WorkflowEdge[]
}
