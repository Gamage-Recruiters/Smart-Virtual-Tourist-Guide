import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import GuideLayout from '../../components/guides/GuideLayout'
import GuideEmptyState from '../../components/guides/GuideEmptyState'
import GuidePageSkeleton from '../../components/guides/GuidePageSkeleton'
import { guideService } from '../../services/guideService'

export default function GuideBidsAlias() {
  const navigate = useNavigate()
  const [state, setState] = useState({ request: undefined, error: '', errorStatus: 0, retry: 0 })
  useEffect(() => {
    let active = true
    guideService.getMostRecentRequest()
      .then((request) => { if (active) setState((current) => ({ ...current, request, error: '', errorStatus: 0 })) })
      .catch((error) => { if (active) setState((current) => ({ ...current, request: null, error: error.message || 'Guide requests could not be loaded.', errorStatus: error.status || 0 })) })
    return () => { active = false }
  }, [state.retry])
  if (state.request === undefined) return <GuideLayout><h1 className="mb-6 text-3xl font-extrabold">Available Guides</h1><GuidePageSkeleton /></GuideLayout>
  if (state.error) return <GuideLayout><h1 className="mb-6 text-3xl font-extrabold">Available Guides</h1><GuideEmptyState title={state.errorStatus === 401 ? 'Please sign in to view your guide requests' : 'We could not load your guide requests'} description={state.error} actionLabel={state.errorStatus === 401 ? 'Go to login' : 'Retry'} onAction={state.errorStatus === 401 ? () => navigate('/login', { state: { returnTo: '/guide-bids' } }) : () => setState((current) => ({ ...current, request: undefined, retry: current.retry + 1 }))} /></GuideLayout>
  return <Navigate replace to={state.request ? `/guides/requests/${state.request.id}/bids` : '/guides/request'} />
}
