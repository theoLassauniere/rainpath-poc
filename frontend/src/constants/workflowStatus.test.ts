import { describe, it, expect } from 'vitest'
import {
  STATUS_LABELS,
  STATUS_ORDER,
  canValidate,
  canCancel,
  canDelete,
} from './workflowStatus'

describe('workflowStatus — labels', () => {
  it('expose un libelle FR pour chaque statut', () => {
    expect(STATUS_LABELS.DRAFT).toBe('Brouillon')
    expect(STATUS_LABELS.VALIDATED).toBe('Validé')
    expect(STATUS_LABELS.CANCELLED).toBe('Annulé')
  })

  it('STATUS_ORDER couvre tous les statuts connus', () => {
    expect(STATUS_ORDER).toEqual(['DRAFT', 'VALIDATED', 'CANCELLED'])
  })
})

describe('workflowStatus — regles de transition', () => {
  it('seul un brouillon peut etre valide', () => {
    expect(canValidate('DRAFT')).toBe(true)
    expect(canValidate('VALIDATED')).toBe(false)
    expect(canValidate('CANCELLED')).toBe(false)
  })

  it('seul un workflow valide peut etre annule', () => {
    expect(canCancel('VALIDATED')).toBe(true)
    expect(canCancel('DRAFT')).toBe(false)
    expect(canCancel('CANCELLED')).toBe(false)
  })

  it('seuls un brouillon ou un annule peuvent etre supprimes', () => {
    expect(canDelete('DRAFT')).toBe(true)
    expect(canDelete('CANCELLED')).toBe(true)
    expect(canDelete('VALIDATED')).toBe(false)
  })
})
