import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GuideLayout from '../../components/guides/GuideLayout'
import GuideRequestForm from '../../components/guides/GuideRequestForm'
import GuideToast from '../../components/guides/GuideToast'
import ModalShell from '../../components/guideBids/ModalShell'
import { guideService } from '../../services/guideService'
import { initialGuideRequest, normalizeGuideRequest, validateGuideRequest } from '../../utils/guideValidation'

export default function RequestGuidePage() {
  const navigate = useNavigate()
  const [values, setValues] = useState(() => {
    const draft = guideService.getDraft()
    return { ...initialGuideRequest, ...(draft || {}), specialities: Array.isArray(draft?.specialities) ? draft.specialities : [] }
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)
  const [toast, setToast] = useState(guideService.getDraft() ? 'Saved draft restored.' : '')
  const skipNextAutosave = useRef(false)

  useEffect(() => {
    if (skipNextAutosave.current) {
      skipNextAutosave.current = false
      return undefined
    }
    const timeout = window.setTimeout(() => guideService.saveDraft(values), 300)
    return () => window.clearTimeout(timeout)
  }, [values])

  const changeValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (submitting) return
    const nextErrors = validateGuideRequest(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      window.requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus())
      setToast('Please correct the highlighted fields.')
      return
    }
    setSubmitting(true)
    try {
      const request = await guideService.createRequest(normalizeGuideRequest(values))
      navigate(`/guides/requests/${request.id}/bids`, { state: { notice: 'Your guide request was submitted successfully.' } })
    } catch (error) {
      setToast(error.message || 'The request could not be submitted.')
      setSubmitting(false)
    }
  }

  const saveDraft = async () => {
    await guideService.saveDraft(values)
    setToast('Draft saved on this device.')
  }

  const clearForm = () => {
    skipNextAutosave.current = true
    setValues(initialGuideRequest)
    setErrors({})
    guideService.clearDraft()
    setClearOpen(false)
    setToast('Form cleared.')
  }

  return <GuideLayout>
    <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2e5c88]">Plan your trip</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight">Request a Tour Guide</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#627587]">Tell us about your trip and verified guides can submit offers that match your requirements.</p></div>
    <GuideRequestForm values={values} errors={errors} onChange={changeValue} onSubmit={submit} onSaveDraft={saveDraft} onRequestClear={() => setClearOpen(true)} submitting={submitting} />
    {clearOpen && <ModalShell titleId="clear-guide-request-title" onClose={() => setClearOpen(false)}><h2 id="clear-guide-request-title" className="pr-8 text-xl font-extrabold">Clear this request?</h2><p className="mt-3 text-sm leading-6 text-[#627587]">All entered trip details and the saved draft on this device will be removed.</p><div className="mt-6 grid grid-cols-2 gap-3"><button type="button" onClick={() => setClearOpen(false)} className="guide-button-secondary">Keep editing</button><button type="button" onClick={clearForm} className="guide-button-primary">Clear form</button></div></ModalShell>}
    <GuideToast message={toast} tone={toast.includes('correct') || toast.includes('could not') ? 'error' : 'success'} onClose={() => setToast('')} />
  </GuideLayout>
}
