import type { WorkflowStatus } from '../types/workflow'
import { STATUS_LABELS, STATUS_BADGE_CLASS } from '../constants/workflowStatus'

export default function StatusBadge({ status }: { status: WorkflowStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_BADGE_CLASS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
