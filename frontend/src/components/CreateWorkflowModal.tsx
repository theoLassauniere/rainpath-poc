import { useEffect, useRef, useState } from 'react'

interface Props {
  open: boolean
  loading: boolean
  onClose: () => void
  onCreate: (name: string, description: string) => Promise<void>
}

export default function CreateWorkflowModal({ open, loading, onClose, onCreate }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setName('')
      setDescription('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await onCreate(name.trim(), description.trim())
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 shadow-xl">
        <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">Nouveau workflow</h2>
        <p className="mb-5 text-sm text-gray-400 dark:text-gray-500">
          Décrivez brièvement la séquence de relance que vous souhaitez configurer.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom <span className="text-red-400">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Relance standard J+7"
              maxLength={80}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 outline-none transition focus:border-indigo-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-violet-900"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description courte
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex : Email à J+7, SMS si inconnu, courrier à J+30..."
              rows={3}
              maxLength={200}
              className="w-full resize-none rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 outline-none transition focus:border-indigo-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-violet-900"
            />
          </div>

          <div className="mt-1 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Fermer
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="flex-1 rounded-lg bg-indigo-600 dark:bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 dark:hover:bg-violet-700 disabled:opacity-40"
            >
              {loading ? 'Création...' : 'Créer le workflow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
