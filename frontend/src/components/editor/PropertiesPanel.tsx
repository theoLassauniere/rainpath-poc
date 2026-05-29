import { useWorkflowStore } from '../../store/workflowStore'
import type { NodeType, WorkflowNode } from '../../types/workflow'
import { PALETTE_CONFIG } from '../nodes/nodeConfig'
import NodeIcon from '../nodes/NodeIcon'

interface Props {
  node: WorkflowNode | null
}

const AVAILABILITY_FIELDS = [
  { value: 'email',    label: 'Email du patient' },
  { value: 'phone',    label: 'Numéro de téléphone' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'address',  label: 'Adresse postale' },
]

const RESULT_FIELDS = [
  { value: 'email_delivered', label: 'Email délivré' },
  { value: 'email_opened',    label: 'Email ouvert' },
  { value: 'email_rejected',  label: 'Email rejeté' },
  { value: 'sms_delivered',   label: 'SMS délivré' },
]

export default function PropertiesPanel({ node }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData)
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange)

  function update(field: string, value: unknown) {
    if (!node) return
    updateNodeData(node.id, { [field]: value })
  }

  function deleteNode() {
    if (!node) return
    onNodesChange([{ type: 'remove', id: node.id }])
  }

  if (!node) {
    return (
      <aside className="w-72 shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-center">
        <p className="text-xs text-gray-300 dark:text-gray-600 text-center px-6">
          Sélectionne un node pour éditer ses propriétés
        </p>
      </aside>
    )
  }

  const { type, data } = node

  return (
    <aside className="w-72 shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto flex flex-col">
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Propriétés</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white ${PALETTE_CONFIG[type as NodeType].colorClass}`}>
            <NodeIcon type={type as NodeType} className="w-4 h-4" />
          </span>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{data.label as string}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-4 flex-1">

        {/* START */}
        {type === 'start' && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Point d'entrée du workflow. Déclenché à la réception des résultats de l'examen.
          </p>
        )}

        {/* END */}
        {type === 'end' && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Fin du workflow de relance.
          </p>
        )}

        {/* SEND NODES */}
        {(type === 'send_email' || type === 'send_sms' || type === 'send_whatsapp' || type === 'send_postal') && (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Contenu du message
            </label>
            <textarea
              rows={5}
              value={(data.messageTemplate as string) ?? ''}
              onChange={(e) => update('messageTemplate', e.target.value)}
              placeholder="Bonjour {{nom}}, votre examen du {{date}}..."
              className="w-full resize-none rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 outline-none focus:border-indigo-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-violet-900 transition"
            />
            <p className="mt-1 text-[10px] text-gray-300 dark:text-gray-600">
              Variables disponibles : {`{{nom}}`}, {`{{date}}`}, {`{{montant}}`}
            </p>
          </div>
        )}

        {/* DELAY */}
        {type === 'delay' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Durée d'attente (jours)
            </label>
            <input
              type="number"
              min={1}
              max={365}
              value={(data.days as number) ?? 7}
              onChange={(e) => update('days', parseInt(e.target.value, 10))}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-indigo-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-violet-900 transition"
            />
          </div>
        )}

        {/* CONDITION */}
        {type === 'condition' && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Type de condition
              </label>
              <select
                value={(data.conditionType as string) ?? 'data_availability'}
                onChange={(e) => {
                  const ct = e.target.value
                  const defaultField = ct === 'data_availability' ? 'email' : 'email_delivered'
                  const defaultOp = ct === 'data_availability' ? 'is_known' : 'is_true'
                  update('conditionType', ct)
                  update('conditionField', defaultField)
                  update('conditionOperator', defaultOp)
                }}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-indigo-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-violet-900 transition"
              >
                <option value="data_availability">Disponibilité</option>
                <option value="action_result">Résultat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Champ
              </label>
              <select
                value={(data.conditionField as string) ?? ''}
                onChange={(e) => update('conditionField', e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-indigo-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-violet-900 transition"
              >
                {(data.conditionType === 'action_result' ? RESULT_FIELDS : AVAILABILITY_FIELDS).map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Opérateur
              </label>
              <select
                value={(data.conditionOperator as string) ?? 'is_known'}
                onChange={(e) => update('conditionOperator', e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-indigo-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-violet-900 transition"
              >
                {data.conditionType === 'action_result' ? (
                  <>
                    <option value="is_true">Est vrai</option>
                    <option value="is_false">Est faux</option>
                  </>
                ) : (
                  <>
                    <option value="is_known">Est connu</option>
                    <option value="is_unknown">Est inconnu</option>
                  </>
                )}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Delete button — not for start node */}
      {type !== 'start' && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={deleteNode}
            className="w-full rounded-lg border border-red-200 dark:border-red-900 px-3 py-2 text-sm font-medium text-red-500 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-950"
          >
            Supprimer ce node
          </button>
        </div>
      )}
    </aside>
  )
}
