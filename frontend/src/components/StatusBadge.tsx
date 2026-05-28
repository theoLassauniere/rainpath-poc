import type { WorkflowStatus } from '../types/workflow'

const config: Record<WorkflowStatus, { label: string; className: string }> = {
  DRAFT: {
    label: 'Brouillon',
    className: 'bg-gray-100 text-gray-500 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700',
  },
  VALIDATED: {
    label: 'Validé',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-800',
  },
  CANCELLED: {
    label: 'Annulé',
    className: 'bg-red-50 text-red-600 ring-red-200 dark:bg-red-950 dark:text-red-400 dark:ring-red-800',
  },
}

export default function StatusBadge({ status }: { status: WorkflowStatus }) {
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
      {label}
    </span>
  )
}
