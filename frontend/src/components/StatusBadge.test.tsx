import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from './StatusBadge'
import { STATUS_LABELS } from '../constants/workflowStatus'

describe('StatusBadge', () => {
  it('affiche le libelle "Brouillon" pour DRAFT', () => {
    render(<StatusBadge status="DRAFT" />)
    expect(screen.getByText(STATUS_LABELS.DRAFT)).toBeInTheDocument()
  })

  it('affiche le libelle "Validé" pour VALIDATED', () => {
    render(<StatusBadge status="VALIDATED" />)
    expect(screen.getByText('Validé')).toBeInTheDocument()
  })

  it('affiche le libelle "Annulé" pour CANCELLED', () => {
    render(<StatusBadge status="CANCELLED" />)
    expect(screen.getByText('Annulé')).toBeInTheDocument()
  })
})
