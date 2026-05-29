import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import WorkflowCard from './WorkflowCard'
import type { WorkflowSummary, WorkflowStatus } from '../types/workflow'

const makeWorkflow = (status: WorkflowStatus): WorkflowSummary => ({
  id: 1,
  name: 'Relance patient',
  description: 'Une description',
  status,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
})

function renderCard(status: WorkflowStatus) {
  const onStatusChange = vi.fn().mockResolvedValue(undefined)
  const onDelete = vi.fn().mockResolvedValue(undefined)
  render(
    <MemoryRouter>
      <WorkflowCard
        workflow={makeWorkflow(status)}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
    </MemoryRouter>,
  )
  return { onStatusChange, onDelete }
}

describe('WorkflowCard — actions selon le statut', () => {
  it('un brouillon propose Valider et Supprimer, pas Annuler', () => {
    renderCard('DRAFT')
    expect(screen.getByRole('button', { name: 'Valider' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Annuler' })).not.toBeInTheDocument()
  })

  it('un workflow valide propose Annuler, pas Valider ni Supprimer', () => {
    renderCard('VALIDATED')
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Valider' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Supprimer' })).not.toBeInTheDocument()
  })
})

describe('WorkflowCard — interactions', () => {
  it('clic sur Valider declenche onStatusChange(id, "VALIDATED")', async () => {
    const user = userEvent.setup()
    const { onStatusChange } = renderCard('DRAFT')

    await user.click(screen.getByRole('button', { name: 'Valider' }))

    expect(onStatusChange).toHaveBeenCalledWith(1, 'VALIDATED')
  })

  it('la suppression demande confirmation avant d appeler onDelete', async () => {
    const user = userEvent.setup()
    const { onDelete } = renderCard('DRAFT')

    // 1er clic : ouvre la confirmation, n appelle pas encore onDelete
    await user.click(screen.getByRole('button', { name: 'Supprimer' }))
    expect(onDelete).not.toHaveBeenCalled()
    expect(screen.getByText(/irréversible/i)).toBeInTheDocument()

    // 2e clic : confirme la suppression
    await user.click(screen.getByRole('button', { name: 'Confirmer' }))
    expect(onDelete).toHaveBeenCalledWith(1)
  })
})
