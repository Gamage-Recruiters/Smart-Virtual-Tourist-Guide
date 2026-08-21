import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

const focusableSelector =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function ModalShell({ children, titleId, onClose, size = 'max-w-lg' }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = [...dialogRef.current.querySelectorAll(focusableSelector)]
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071b2d]/60 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl outline-none sm:p-8 ${size}`}
      >
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-[#647889] transition hover:bg-[#eff6fb] hover:text-[#173a55] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087bd3]"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
        {children}
      </section>
    </div>
  )
}
