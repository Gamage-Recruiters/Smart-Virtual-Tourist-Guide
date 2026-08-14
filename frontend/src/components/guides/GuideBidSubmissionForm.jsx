import { useMemo, useState } from 'react'
import { formatDateRange } from '../../utils/guideFormatters'

const fieldClass = 'mt-1 min-h-11 w-full rounded-lg border border-[#cbd9e4] bg-white px-3 text-sm outline-none focus:border-[#2e5c88] focus:ring-2 focus:ring-[#cde6fa]'

const localDateTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

const suggestedExpiry = (request) => {
  const deadline = new Date(request.expiresAt || request.startDate)
  const oneDayBefore = new Date(deadline.getTime() - 86400000)
  const minimum = new Date(Date.now() + 3600000)
  return localDateTime(oneDayBefore > minimum ? oneDayBefore : new Date((Date.now() + deadline.getTime()) / 2))
}

const listValue = (value) => [...new Set(value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean))]

export default function GuideBidSubmissionForm({ request, submitting, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => ({
    amount: '',
    proposedItinerary: '',
    includedServices: 'Private guide service\nItinerary planning',
    excludedServices: 'Entrance tickets\nMeals\nTransport',
    message: '',
    cancellationPolicy: 'Free cancellation up to 72 hours before the tour.',
    expiresAt: suggestedExpiry(request),
  }))
  const [error, setError] = useState('')
  const [minimumExpiry] = useState(() => localDateTime(new Date(Date.now() + 60000)))
  const maximumExpiry = useMemo(() => localDateTime(request.expiresAt || request.startDate), [request])

  const change = (name) => (event) => setValues((current) => ({ ...current, [name]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    const amount = Number(values.amount)
    const expiresAt = new Date(values.expiresAt)
    if (!Number.isFinite(amount) || amount <= 0) return setError('Enter a bid amount greater than zero.')
    if (!values.proposedItinerary.trim()) return setError('Add a proposed itinerary.')
    if (!values.cancellationPolicy.trim()) return setError('Add a cancellation policy.')
    if (Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date() || expiresAt > new Date(request.expiresAt)) return setError('Choose a future bid expiry no later than the request deadline.')
    setError('')
    await onSubmit({
      amount,
      currency: request.currency,
      proposedItinerary: values.proposedItinerary,
      includedServices: listValue(values.includedServices),
      excludedServices: listValue(values.excludedServices),
      message: values.message,
      cancellationPolicy: values.cancellationPolicy,
      expiresAt: expiresAt.toISOString(),
    })
  }

  return <form onSubmit={submit} className="mt-5 rounded-xl border border-[#c9ddeb] bg-[#f7fbff] p-4" aria-label={`Bid for ${request.destination}`}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-extrabold">Submit or update your bid</h3><p className="mt-1 text-xs text-[#627587]">{request.startLocation} to {request.destination} · {formatDateRange(request.startDate, request.endDate)}</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#31546c]">{request.currency}</span></div>
    {error && <div role="alert" className="mt-4 rounded-lg border border-[#f0bbb6] bg-[#fff0ef] p-3 text-sm font-semibold text-[#9e281f]">{error}</div>}
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-bold">Bid amount<input type="number" min="0.01" step="0.01" required value={values.amount} onChange={change('amount')} className={fieldClass} /></label>
      <label className="text-sm font-bold">Bid expires<input type="datetime-local" required min={minimumExpiry} max={maximumExpiry} value={values.expiresAt} onChange={change('expiresAt')} className={fieldClass} /></label>
      <label className="text-sm font-bold sm:col-span-2">Proposed itinerary<textarea required rows="4" value={values.proposedItinerary} onChange={change('proposedItinerary')} className={`${fieldClass} py-3`} /></label>
      <label className="text-sm font-bold">Included services<textarea rows="4" value={values.includedServices} onChange={change('includedServices')} className={`${fieldClass} py-3`} /><span className="mt-1 block text-xs font-normal text-[#718396]">One per line or comma separated</span></label>
      <label className="text-sm font-bold">Excluded services<textarea rows="4" value={values.excludedServices} onChange={change('excludedServices')} className={`${fieldClass} py-3`} /><span className="mt-1 block text-xs font-normal text-[#718396]">One per line or comma separated</span></label>
      <label className="text-sm font-bold sm:col-span-2">Message to traveller<textarea rows="3" value={values.message} onChange={change('message')} className={`${fieldClass} py-3`} /></label>
      <label className="text-sm font-bold sm:col-span-2">Cancellation policy<textarea required rows="3" value={values.cancellationPolicy} onChange={change('cancellationPolicy')} className={`${fieldClass} py-3`} /></label>
    </div>
    <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onCancel} className="guide-button-secondary">Cancel</button><button type="submit" disabled={submitting} className="guide-button-primary">{submitting ? 'Saving bid…' : 'Submit bid'}</button></div>
  </form>
}
