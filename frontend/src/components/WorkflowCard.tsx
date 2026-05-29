import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { WorkflowSummary, WorkflowStatus } from '../types/workflow'
import StatusBadge from './StatusBadge'

interface Props {
  workflow: WorkflowSummary
  onStatusChange: (id: number, status: WorkflowStatus) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export default function WorkflowCard({ workflow, onStatusChange, onDelete }: Props) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const canValidate = workflow.status === 'DRAFT'
  const canCancel = workflow.status === 'DRAFT' || workflow.status === 'VALIDATED'
  const canDelete = workflow.status === 'DRAFT' || workflow.status === 'CANCELLED'

  async function handleStatus(status: WorkflowStatus) {
    setLoading(true)
    try { await onStatusChange(workflow.id, status) }
    finally { setLoading(false) }
  }

  async function handleDelete() {
    setLoading(true)
    try { await onDelete(workflow.id) }
    finally { setLoading(false); setConfirmDelete(false) }
  }

  return (
    <div
      onClick={() => navigate(`/workflows/${workflow.id}`)}
      className="group relative flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-1">
          {workflow.name}
        </h3>
        <StatusBadge status={workflow.status} />
      </div>

      {/* Description */}
      <p className="mb-5 flex-1 text-sm text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed">
        {workflow.description || <span className="italic">Aucune description</span>}
      </p>

      {/* Actions */}
      {!confirmDelete ? (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/workflows/${workflow.id}`) }}
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Ouvrir
          </button>

          {canValidate && (
            <button
              onClick={(e) => { e.stopPropagation(); handleStatus('VALIDATED') }}
              disabled={loading}
              className="flex-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
            >
              Valider
            </button>
          )}

          {canCancel && (
            <button
              onClick={(e) => { e.stopPropagation(); handleStatus('CANCELLED') }}
              disabled={loading}
              className="flex-1 rounded-lg bg-red-50 dark:bg-red-950 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 transition hover:bg-red-100 dark:hover:bg-red-900 disabled:opacity-50"
            >
              Annuler
            </button>
          )}

          {canDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
              disabled={loading}
              className="flex-1 rounded-lg border border-red-200 dark:border-red-900 px-3 py-1.5 text-sm font-medium text-red-500 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50"
            >
              Supprimer
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-red-50 dark:bg-red-950 p-3" onClick={(e) => e.stopPropagation()}>
          <p className="mb-3 text-sm text-red-700 dark:text-red-300 font-medium">
            Supprimer « {workflow.name} » ? Cette action est irréversible.
          </p>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(false) }}
              className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Annuler
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete() }}
              disabled={loading}
              className="flex-1 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              Confirmer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
