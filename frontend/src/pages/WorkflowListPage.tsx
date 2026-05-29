import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { workflowsApi } from '../api/workflows'
import type { WorkflowSummary, WorkflowStatus } from '../types/workflow'
import WorkflowCard from '../components/WorkflowCard'
import CreateWorkflowModal from '../components/CreateWorkflowModal'
import { createDefaultNodes } from '../components/nodes/nodeConfig'

const TABS: { status: WorkflowStatus; label: string }[] = [
  { status: 'DRAFT', label: 'Brouillon' },
  { status: 'VALIDATED', label: 'Validé' },
  { status: 'CANCELLED', label: 'Annulé' },
]

const EMPTY_STATE: Record<WorkflowStatus, { title: string; description: string }> = {
  DRAFT: {
    title: 'Aucun brouillon',
    description: 'Les workflows en cours de création apparaîtront ici.',
  },
  VALIDATED: {
    title: 'Aucun workflow validé',
    description: 'Les workflows mis en production apparaîtront ici.',
  },
  CANCELLED: {
    title: 'Aucun workflow annulé',
    description: 'Les workflows désactivés apparaîtront ici.',
  },
}

const STORAGE_KEY = 'rainpath.workflowList.tab'

function GearIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export default function WorkflowListPage() {
  const navigate = useNavigate()
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<WorkflowStatus>(
    () => (localStorage.getItem(STORAGE_KEY) as WorkflowStatus | null) ?? 'DRAFT'
  )

  function switchTab(status: WorkflowStatus) {
    setActiveTab(status)
    localStorage.setItem(STORAGE_KEY, status)
  }

  const visibleWorkflows = workflows.filter((w) => w.status === activeTab)

  useEffect(() => {
    fetchWorkflows()
  }, [])

  async function fetchWorkflows() {
    setLoading(true)
    setError(null)
    try {
      const data = await workflowsApi.list()
      setWorkflows(data)
    } catch {
      setError('Impossible de charger les workflows.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(name: string, description: string) {
    setCreateLoading(true)
    try {
      const created = await workflowsApi.create({ name, description, nodes: createDefaultNodes(), edges: [] })
      setCreateOpen(false)
      navigate(`/workflows/${created.id}`)
    } catch {
      setError('Erreur lors de la création.')
    } finally {
      setCreateLoading(false)
    }
  }

  async function handleStatusChange(id: number, status: WorkflowStatus) {
    try {
      const updated = await workflowsApi.update(id, { status })
      setWorkflows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: updated.status } : w))
      )
    } catch {
      setError('Erreur lors de la mise à jour du statut.')
    }
  }

  async function handleDelete(id: number) {
    try {
      await workflowsApi.delete(id)
      setWorkflows((prev) => prev.filter((w) => w.id !== id))
    } catch {
      setError('Erreur lors de la suppression.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600 dark:text-violet-400">RainPath</span>
            <span className="rounded-md bg-indigo-50 dark:bg-violet-950 px-2 py-0.5 text-xs font-medium text-indigo-500 dark:text-violet-400">
              POC
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center justify-center rounded-lg p-1.5 text-gray-400 dark:text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300"
              title="Paramètres"
            >
              <GearIcon />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-violet-900 text-xs font-semibold text-indigo-700 dark:text-violet-300">
                TO
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">toto</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mes workflows</h1>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              {loading ? '…' : `${visibleWorkflows.length} workflow${visibleWorkflows.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 dark:bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 dark:hover:bg-violet-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau workflow
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-800">
          {TABS.map(({ status, label }) => {
            const count = workflows.filter((w) => w.status === status).length
            const isActive = activeTab === status
            return (
              <button
                key={status}
                onClick={() => switchTab(status)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  isActive
                    ? 'border-indigo-600 dark:border-violet-500 text-indigo-600 dark:text-violet-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {label}
                {!loading && (
                  <span className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[1.25rem] ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-violet-900 text-indigo-700 dark:text-violet-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0v-4.5a.75.75 0 00-1.5 0v4.5zm.75-7a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 dark:hover:text-red-300">✕</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        ) : visibleWorkflows.length === 0 ? (
          /* Empty state contextuel */
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 dark:bg-violet-950">
              <svg className="h-7 w-7 text-indigo-400 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
              </svg>
            </div>
            <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-gray-100">
              {EMPTY_STATE[activeTab].title}
            </h3>
            <p className="mb-6 text-sm text-gray-400 dark:text-gray-500">
              {EMPTY_STATE[activeTab].description}
            </p>
            {activeTab === 'DRAFT' && (
              <button
                onClick={() => setCreateOpen(true)}
                className="rounded-xl bg-indigo-600 dark:bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 dark:hover:bg-violet-700"
              >
                Créer un workflow
              </button>
            )}
          </div>
        ) : (
          /* Cards grid */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <CreateWorkflowModal
        open={createOpen}
        loading={createLoading}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}
