import axios from 'axios'
import type {
  Workflow,
  WorkflowSummary,
  CreateWorkflowDto,
  UpdateWorkflowDto,
} from '../types/workflow'

const api = axios.create({ baseURL: '/api' })

export const workflowsApi = {
  list: () => api.get<WorkflowSummary[]>('/workflows').then((r) => r.data),

  get: (id: number) =>
    api.get<Workflow>(`/workflows/${id}`).then((r) => r.data),

  create: (dto: CreateWorkflowDto) =>
    api.post<Workflow>('/workflows', dto).then((r) => r.data),

  update: (id: number, dto: UpdateWorkflowDto) =>
    api.patch<Workflow>(`/workflows/${id}`, dto).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/workflows/${id}`).then((r) => r.data),
}
