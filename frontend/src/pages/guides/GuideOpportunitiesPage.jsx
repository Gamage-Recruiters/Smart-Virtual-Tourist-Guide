import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Languages, MapPin, Search, Users } from 'lucide-react'
import GuideBidSubmissionForm from '../../components/guides/GuideBidSubmissionForm'
import GuideEmptyState from '../../components/guides/GuideEmptyState'
import GuideLayout from '../../components/guides/GuideLayout'
import GuidePageSkeleton from '../../components/guides/GuidePageSkeleton'
import GuideStatusBadge from '../../components/guides/GuideStatusBadge'
import { useAuth } from '../../context/AuthContext'
import { guideService } from '../../services/guideService'
import { formatCurrency, formatDateRange } from '../../utils/guideFormatters'

const fieldClass = 'min-h-11 w-full rounded-lg border border-[#cbd9e4] bg-white px-3 text-sm outline-none focus:border-[#2e5c88] focus:ring-2 focus:ring-[#cde6fa]'
const splitList = (value) => [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))]

function ProfileSetup({ defaultName, submitting, onSubmit }) {
  const [values, setValues] = useState({ displayName: defaultName, location: '', experienceYears: '', languages: 'English', specialities: '', bio: '' })
  const set = (name) => (event) => setValues((current) => ({ ...current, [name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    onSubmit({
      displayName: values.displayName,
      location: values.location,
      experienceYears: values.experienceYears === '' ? undefined : Number(values.experienceYears),
      languages: splitList(values.languages).map((name) => ({ name, proficiency: 'Professional' })),
      specialities: splitList(values.specialities),
      bio: values.bio,
      availability: 'Available',
    })
  }
  return <section className="guide-card border-[#efd7a7]" aria-labelledby="profile-setup-title"><h2 id="profile-setup-title" className="text-xl font-extrabold">Complete your guide profile</h2><p className="mt-2 text-sm leading-6 text-[#627587]">An active guide profile is required before you can submit offers.</p><form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">Display name<input required value={values.displayName} onChange={set('displayName')} className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold">Location<input value={values.location} onChange={set('location')} className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold">Experience years<input type="number" min="0" max="80" value={values.experienceYears} onChange={set('experienceYears')} className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold">Languages<input required value={values.languages} onChange={set('languages')} placeholder="English, Sinhala" className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold sm:col-span-2">Specialities<input value={values.specialities} onChange={set('specialities')} placeholder="Historical tours, Photography" className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold sm:col-span-2">Short bio<textarea rows="3" value={values.bio} onChange={set('bio')} className={`${fieldClass} mt-1 py-3`} /></label><button type="submit" disabled={submitting} className="guide-button-primary sm:col-span-2 sm:justify-self-end">{submitting ? 'Creating profile…' : 'Create guide profile'}</button></form></section>
}

export default function GuideOpportunitiesPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(undefined)
  const [profileSubmitting, setProfileSubmitting] = useState(false)
  const [filters, setFilters] = useState({ destination: '', language: '' })
  const [page, setPage] = useState(1)
  const [state, setState] = useState({ loading: true, requests: [], pagination: { totalItems: 0, totalPages: 0 }, error: '', retry: 0 })
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [bidSubmitting, setBidSubmitting] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    guideService.getOwnGuideProfile().then((result) => { if (active) setProfile(result) }).catch((error) => { if (active) setNotice(error.message || 'Guide profile could not be loaded.') })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    const timeout = window.setTimeout(() => {
      setState((current) => ({ ...current, loading: true, error: '' }))
      guideService.listOpportunities({ ...filters, page, limit: 6 }).then((result) => {
        if (active) setState((current) => ({ ...current, loading: false, requests: result.requests, pagination: result.pagination, error: '' }))
      }).catch((error) => {
        if (active) setState((current) => ({ ...current, loading: false, requests: [], error: error.message || 'Guide opportunities could not be loaded.' }))
      })
    }, import.meta.env.MODE === 'test' ? 0 : 250)
    return () => { active = false; window.clearTimeout(timeout) }
  }, [filters, page, state.retry])

  const changeFilter = (name, value) => { setFilters((current) => ({ ...current, [name]: value })); setPage(1) }
  const createProfile = async (input) => {
    setProfileSubmitting(true); setNotice('')
    try { const created = await guideService.createGuideProfile(input); setProfile(created); setNotice('Your guide profile is ready. You can now submit bids.') }
    catch (error) { setNotice(error.message || 'Guide profile could not be created.') }
    finally { setProfileSubmitting(false) }
  }
  const submitBid = async (input) => {
    setBidSubmitting(true); setNotice('')
    try {
      const result = await guideService.submitBid(selectedRequest.id, input)
      setNotice(result.updatedExisting ? 'Your existing bid was updated.' : 'Your bid was submitted successfully.')
      setSelectedRequest(null)
    } catch (error) { setNotice(error.message || 'Your bid could not be submitted.') }
    finally { setBidSubmitting(false) }
  }

  return <GuideLayout>
    <header><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2e5c88]">Guide provider</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight">Guide Opportunities</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#627587]">Review open tourist requests and submit a real offer using your authenticated guide profile.</p></header>
    {notice && <div role="status" className="mt-5 rounded-xl border border-[#c9ddeb] bg-[#edf7ff] p-4 text-sm font-semibold text-[#31546c]">{notice}</div>}
    {profile === null && <div className="mt-6"><ProfileSetup defaultName={user?.fullName || user?.username || ''} submitting={profileSubmitting} onSubmit={createProfile} /></div>}
    {profile && <section className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#bde2cf] bg-[#f0fbf5] p-4"><div><strong>{profile.displayName}</strong><p className="mt-1 text-xs text-[#4e6f5e]">Active profile · {profile.availability}</p></div><GuideStatusBadge status={profile.availability} /></section>}

    <section className="mt-6" aria-labelledby="opportunity-results"><div className="grid gap-3 rounded-2xl border border-[#dfe8ef] bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_220px_auto]"><label className="text-xs font-bold">Destination<span className="relative mt-1 block"><Search aria-hidden="true" className="absolute left-3 top-3.5 h-4 w-4 text-[#7990a2]" /><input type="search" value={filters.destination} onChange={(event) => changeFilter('destination', event.target.value)} placeholder="Search destination" className={`${fieldClass} pl-9`} /></span></label><label className="text-xs font-bold">Language<select value={filters.language} onChange={(event) => changeFilter('language', event.target.value)} className={`${fieldClass} mt-1`}><option value="">Any language</option><option>English</option><option>Sinhala</option><option>Tamil</option><option>French</option><option>German</option></select></label><button type="button" onClick={() => { setFilters({ destination: '', language: '' }); setPage(1) }} className="guide-button-secondary self-end">Reset</button></div>
      <div className="mt-5 flex items-end justify-between gap-3"><div><h2 id="opportunity-results" className="text-xl font-extrabold">Open requests</h2><p className="text-sm text-[#627587]">{state.pagination.totalItems} opportunities found</p></div></div>
      {state.loading ? <div className="mt-4"><GuidePageSkeleton cards={3} /></div> : state.error ? <div className="mt-4"><GuideEmptyState title="We could not load opportunities" description={state.error} actionLabel="Retry" onAction={() => setState((current) => ({ ...current, retry: current.retry + 1 }))} /></div> : state.requests.length ? <div className="mt-4 space-y-4">{state.requests.map((request) => <article key={request.id} className="guide-card"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="break-words text-lg font-extrabold">{request.startLocation} to {request.destination}</h3><GuideStatusBadge status={request.status} /></div><p className="mt-2 text-sm font-semibold text-[#48677f]">{formatDateRange(request.startDate, request.endDate)}</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#627587]"><span className="inline-flex items-center gap-1"><Users aria-hidden="true" className="h-4 w-4" />{request.adults} adults · {request.children} children</span><span className="inline-flex items-center gap-1"><Languages aria-hidden="true" className="h-4 w-4" />{request.languages?.join(', ') || 'Any language'}</span><span className="inline-flex items-center gap-1"><MapPin aria-hidden="true" className="h-4 w-4" />{request.stops?.join(', ') || 'Direct route'}</span></div></div><div className="shrink-0 sm:text-right"><p className="text-xs font-bold uppercase tracking-wide text-[#718396]">Traveller budget</p><p className="mt-1 text-xl font-extrabold text-[#23669e]">Up to {formatCurrency(request.maxBudget, request.currency)}</p></div></div>{request.description && <p className="mt-4 text-sm leading-6 text-[#586f82]">{request.description}</p>}{request.specialities?.length > 0 && <ul className="mt-4 flex flex-wrap gap-2">{request.specialities.map((item) => <li key={item} className="rounded-full bg-[#edf7ff] px-3 py-1 text-xs font-bold text-[#2779b8]">{item}</li>)}</ul>}<button type="button" disabled={!profile} onClick={() => setSelectedRequest((current) => current?.id === request.id ? null : request)} className="guide-button-primary mt-5">{profile ? selectedRequest?.id === request.id ? 'Close bid form' : 'Submit or update bid' : 'Create profile to bid'}</button>{selectedRequest?.id === request.id && <GuideBidSubmissionForm key={request.id} request={request} submitting={bidSubmitting} onSubmit={submitBid} onCancel={() => setSelectedRequest(null)} />}</article>)}</div> : <div className="mt-4"><GuideEmptyState title="No open requests" description="New tourist requests that match your search will appear here." /></div>}
      {state.pagination.totalPages > 1 && <nav className="mt-7 flex items-center justify-center gap-3" aria-label="Opportunity pages"><button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="guide-page-button"><ChevronLeft aria-hidden="true" className="h-4 w-4" /></button><span className="text-sm font-bold">Page {page} of {state.pagination.totalPages}</span><button type="button" aria-label="Next page" disabled={page === state.pagination.totalPages} onClick={() => setPage((value) => Math.min(state.pagination.totalPages, value + 1))} className="guide-page-button"><ChevronRight aria-hidden="true" className="h-4 w-4" /></button></nav>}
    </section>
  </GuideLayout>
}
