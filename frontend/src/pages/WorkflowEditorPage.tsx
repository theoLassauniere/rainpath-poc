import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ReactFlowProvider, useReactFlow } from '@xyflow/react'
import { workflowsApi } from '../api/workflows'
import { useWorkflowStore } from '../store/workflowStore'
import type { NodeType, WorkflowNode } from '../types/workflow'
import { getDefaultData } from '../components/nodes/nodeConfig'
import NodePalette from '../components/editor/NodePalette'
import WorkflowCanvas from '../components/editor/WorkflowCanvas'
import PropertiesPanel from '../components/editor/PropertiesPanel'
import StatusBadge from '../components/StatusBadge'
import ConfirmModal from '../components/ConfirmModal'

// Inner component — must be inside ReactFlowProvider to use useReactFlow
function EditorLayout() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { screenToFlowPosition } = useReactFlow()

  const { name, status, nodes, edges, isDirty, setWorkflow, addNode, markSaved, reset } =
    useWorkflowStore()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<'saved' | 'error' | null>(null)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  useEffect(() => {
    reset()
    if (!id) { setLoading(false); return }

    workflowsApi.get(Number(id)).then((wf) => {
      setWorkflow(wf.id, wf.name, wf.description ?? '', wf.nodes, wf.edges, wf.status)
    }).catch(() => navigate('/')).finally(() => setLoading(false))
  }, [id])

  function handleAddNode(type: NodeType, position?: { x: number; y: number }) {
    const pos = position ?? screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
    addNode({
      id: crypto.randomUUID(),
      type,
      position: pos,
      data: getDefaultData(type),
    })
  }

  async function handleSave() {
    if (!id) return
    setSaving(true)
    setSaveMsg(null)
    try {
      await workflowsApi.update(Number(id), { nodes, edges })
      markSaved(Number(id))
      setSaveMsg('saved')
      setTimeout(() => setSaveMsg(null), 2500)
    } catch {
      setSaveMsg('error')
    } finally {
      setSaving(false)
    }
  }

  function handleBack() {
    if (isDirty) {
      setShowLeaveConfirm(true)
    } else {
      navigate('/')
    }
  }

  const selectedNode = nodes.find((n) => n.selected) as WorkflowNode | undefined

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 flex items-center gap-3 h-14">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Workflows
        </button>

        <span className="text-gray-200 dark:text-gray-700">|</span>

        <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-xs">{name}</h1>

        {status && <StatusBadge status={status} />}

        <div className="ml-auto flex items-center gap-3">
          {isDirty && (
            <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              Non sauvegardé
            </span>
          )}
          {saveMsg === 'saved' && (
            <span className="text-xs text-emerald-600 font-medium">✓ Sauvegardé</span>
          )}
          {saveMsg === 'error' && (
            <span className="text-xs text-red-500 font-medium">Erreur lors de la sauvegarde</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="rounded-lg bg-indigo-600 dark:bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700 dark:hover:bg-violet-700 disabled:opacity-40"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </header>

      {/* 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        <NodePalette onAddNode={handleAddNode} />
        <WorkflowCanvas onAddNode={handleAddNode} />
        <PropertiesPanel node={selectedNode ?? null} />
      </div>

      <ConfirmModal
        open={showLeaveConfirm}
        title="Modifications non sauvegardées"
        message="Vous avez des modifications en cours. Quitter maintenant les supprimera définitivement."
        confirmLabel="Quitter sans sauvegarder"
        cancelLabel="Rester"
        variant="danger"
        onConfirm={() => navigate('/')}
        onCancel={() => setShowLeaveConfirm(false)}
      />
    </div>
  )
}

// Wrap with ReactFlowProvider so children can use useReactFlow()
export default function WorkflowEditorPage() {
  return (
    <ReactFlowProvider>
      <EditorLayout />
    </ReactFlowProvider>
  )
}
