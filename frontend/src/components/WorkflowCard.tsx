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

  const isDraft = workflow.status === 'DRAFT'
  const canDelete = workflow.status === 'VALIDATED' || workflow.status === 'CANCELLED'

  async function handleStatus(status: WorkflowStatus) {
    setLoading(true)
    try {
      await onStatusChange(workflow.id, status)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    setLoading(true)
    try {
      await onDelete(workflow.id)
    } finally {
      setLoading(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-1">
          {workflow.name}
        </h3>
        <StatusBadge status={workflow.status} />
      </div>

      {/* Description */}
      <p className="mb-5 flex-1 text-sm text-gray-400 line-clamp-2 leading-relaxed">
        {workflow.description || <span className="italic">Aucune description</span>}
      </p>

      {/* Actions */}
      {!confirmDelete ? (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/workflows/${workflow.id}`)}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Ouvrir
          </button>

          {isDraft && (
            <>
              <button
                onClick={() => handleStatus('VALIDATED')}
                disabled={loading}
                className="flex-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
              >
                Valider
              </button>
              <button
                onClick={() => handleStatus('CANCELLED')}
                disabled={loading}
                className="flex-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                Annuler
              </button>
            </>
          )}

          {canDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={loading}
              className="flex-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
            >
              Supprimer
            </button>
          )}
        </div>
      ) : (
        /* Confirmation suppression */
        <div className="rounded-xl bg-red-50 p-3">
          <p className="mb-3 text-sm text-red-700 font-medium">
            Supprimer « {workflow.name} » ? Cette action est irréversible.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
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
