import { useNavigate } from 'react-router-dom'
import { useTheme, type Theme } from '../contexts/ThemeContext'

const THEME_OPTIONS: { value: Theme; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'light',
    label: 'Clair',
    description: 'Toujours en thème clair',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Sombre',
    description: 'Toujours en thème sombre',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
  },
  {
    value: 'system',
    label: 'Système',
    description: 'Suit les préférences de l\'appareil',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export default function SettingsPage() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
          <span className="text-gray-200 dark:text-gray-700">|</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600 dark:text-violet-400">RainPath</span>
            <span className="rounded-md bg-indigo-50 dark:bg-violet-950 px-2 py-0.5 text-xs font-medium text-indigo-500 dark:text-violet-400">POC</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Paramètres</h1>

        {/* Appearance section */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
            Apparence
          </h2>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Thème</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Choisissez l'apparence de l'interface
              </p>
            </div>
            <div className="p-5 grid grid-cols-3 gap-3">
              {THEME_OPTIONS.map((option) => {
                const isActive = theme === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`flex flex-col items-center gap-2.5 rounded-xl border-2 px-4 py-4 text-center transition-all ${
                      isActive
                        ? 'border-indigo-500 dark:border-violet-500 bg-indigo-50 dark:bg-violet-950'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className={isActive ? 'text-indigo-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'}>
                      {option.icon}
                    </span>
                    <div>
                      <p className={`text-sm font-semibold ${isActive ? 'text-indigo-600 dark:text-violet-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        {option.label}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">
                        {option.description}
                      </p>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-violet-500" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
