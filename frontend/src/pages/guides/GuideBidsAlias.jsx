import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import GuideLayout from '../../components/guides/GuideLayout'
import GuidePageSkeleton from '../../components/guides/GuidePageSkeleton'
import { guideService } from '../../services/guideService'

export default function GuideBidsAlias() {
  const [request, setRequest] = useState(undefined)
  useEffect(() => { let active = true; guideService.getMostRecentRequest().then((result) => { if (active) setRequest(result) }); return () => { active = false } }, [])
  if (request === undefined) return <GuideLayout><h1 className="mb-6 text-3xl font-extrabold">Available Guides</h1><GuidePageSkeleton /></GuideLayout>
  return <Navigate replace to={request ? `/guides/requests/${request.id}/bids` : '/guides/request'} />
}
