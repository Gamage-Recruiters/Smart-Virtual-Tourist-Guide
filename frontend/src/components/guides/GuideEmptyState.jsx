import { Compass, RefreshCw } from 'lucide-react'

export default function GuideEmptyState({ title, description, actionLabel, onAction }) {
  return (
    <section className="rounded-2xl border border-[#dfe8ef] bg-white px-6 py-14 text-center shadow-[0_4px_12px_rgba(0,0,0,0.05)]" aria-live="polite">
      <Compass aria-hidden="true" className="mx-auto h-10 w-10 text-[#3f82b5]" />
      <h2 className="mt-4 text-xl font-extrabold">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#627587]">{description}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#2e5c88] px-5 text-sm font-bold text-white hover:bg-[#244a6d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e5c88]">
          <RefreshCw aria-hidden="true" className="h-4 w-4" />{actionLabel}
        </button>
      )}
    </section>
  )
}
