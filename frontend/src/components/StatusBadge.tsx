import type { WorkflowStatus } from '../types/workflow'

const config: Record<WorkflowStatus, { label: string; className: string }> = {
  DRAFT: {
    label: 'Brouillon',
    className: 'bg-gray-100 text-gray-500 ring-gray-200',
  },
  VALIDATED: {
    label: 'Validé',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  CANCELLED: {
    label: 'Annulé',
    className: 'bg-red-50 text-red-600 ring-red-200',
  },
}

export default function StatusBadge({ status }: { status: WorkflowStatus }) {
  const { label, className } = config[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {label}
    </span>
  )
}
