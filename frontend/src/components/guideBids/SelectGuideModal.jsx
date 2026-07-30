import { CheckCircle2 } from 'lucide-react'
import ModalShell from './ModalShell'

const formatBid = (amount) => `LKR ${amount.toLocaleString('en-US')}`

export default function SelectGuideModal({ guide, onCancel, onConfirm }) {
  const titleId = `select-${guide.id}-title`

  return (
    <ModalShell titleId={titleId} onClose={onCancel} size="max-w-md">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e5f5ff] text-[#0787f6]">
        <CheckCircle2 aria-hidden="true" className="h-7 w-7" />
      </div>
      <div className="mt-5 text-center">
        <h2 id={titleId} className="text-2xl font-extrabold text-[#102538]">
          Select {guide.name}?
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#63788a]">
          You are selecting this guide for the Colombo to Sigiriya trip at a total bid of{' '}
          <strong className="text-[#23669e]">{formatBid(guide.bid)}</strong>.
        </p>
        <p className="mt-2 text-xs text-[#8293a2]">
          This is a temporary frontend selection and does not create a booking.
        </p>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-[#b8c9d7] bg-white px-4 py-3 text-sm font-bold text-[#486275] transition hover:bg-[#f3f7fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onConfirm(guide)}
          className="rounded-full bg-[#0787f6] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#006dcc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
        >
          Confirm
        </button>
      </div>
    </ModalShell>
  )
}
