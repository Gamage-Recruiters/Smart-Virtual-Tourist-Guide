import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'

const icons = { success: CheckCircle2, error: CircleAlert, info: Info }

export default function GuideToast({ message, tone = 'info', onClose }) {
  if (!message) return null
  const Icon = icons[tone] || Info
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      className="fixed bottom-5 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl bg-[#103d5d] px-4 py-3 text-sm font-semibold text-white shadow-xl"
    >
      <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#71d8aa]" />
      <span className="min-w-0 flex-1">{message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss notification" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white">
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  )
}
