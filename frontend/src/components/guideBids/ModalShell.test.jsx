import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import ModalShell from './ModalShell'

function ModalHarness({ onClose }) {
  const [open, setOpen] = useState(false)
  return <><button type="button" onClick={() => setOpen(true)}>Open comparison</button>{open && <ModalShell titleId="dialog-title" onClose={() => { onClose(); setOpen(false) }}><h2 id="dialog-title">Compare guides</h2><button type="button">First action</button><button type="button">Last action</button></ModalShell>}</>
}

describe('ModalShell accessibility', () => {
  it('closes with Escape and returns focus to the opener', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ModalHarness onClose={onClose} />)
    const opener = screen.getByRole('button', { name: 'Open comparison' })
    await user.click(opener)
    expect(screen.getByRole('dialog')).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(opener).toHaveFocus()
  })

  it('keeps Tab focus within the modal controls', async () => {
    const user = userEvent.setup()
    render(<ModalShell titleId="dialog-title" onClose={() => {}}><h2 id="dialog-title">Compare guides</h2><button type="button">First action</button><button type="button">Last action</button></ModalShell>)
    const close = screen.getByRole('button', { name: 'Close dialog' })
    close.focus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'First action' })).toHaveFocus()
  })
})
