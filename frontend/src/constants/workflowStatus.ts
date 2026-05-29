import type { WorkflowStatus } from '../types/workflow'

/** Libellés FR affichés pour chaque statut de workflow. */
export const STATUS_LABELS: Record<WorkflowStatus, string> = {
  DRAFT: 'Brouillon',
  VALIDATED: 'Validé',
  CANCELLED: 'Annulé',
}

/** Classes Tailwind du badge de statut (clair + sombre). */
export const STATUS_BADGE_CLASS: Record<WorkflowStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-500 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700',
  VALIDATED: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-800',
  CANCELLED: 'bg-red-50 text-red-600 ring-red-200 dark:bg-red-950 dark:text-red-400 dark:ring-red-800',
}

/** Ordre d'affichage des statuts (onglets de la liste, etc.). */
export const STATUS_ORDER: WorkflowStatus[] = ['DRAFT', 'VALIDATED', 'CANCELLED']

/**
 * Règles de transition de statut, alignées sur la validation du backend :
 * - un brouillon peut être validé ;
 * - un workflow validé peut être annulé ;
 * - seuls un brouillon ou un workflow annulé peuvent être supprimés.
 */
export const canValidate = (status: WorkflowStatus): boolean => status === 'DRAFT'
export const canCancel = (status: WorkflowStatus): boolean => status === 'VALIDATED'
export const canDelete = (status: WorkflowStatus): boolean =>
  status === 'DRAFT' || status === 'CANCELLED'
