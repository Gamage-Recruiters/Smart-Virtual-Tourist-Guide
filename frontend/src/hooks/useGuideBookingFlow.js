import { useCallback, useEffect, useMemo, useState } from 'react'
import { guideService } from '../services/guideService'
import { defaultGuideFilters } from '../utils/guideFilters'

export const GUIDE_BIDS_PER_PAGE = 4

const sortMap = {
  recommended: 'recommended',
  lowest: 'price_asc',
  highest: 'price_desc',
  rating: 'rating_desc',
  experience: 'experience_desc',
  newest: 'newest',
}

export const buildBidQuery = (filters, sortBy, page) => ({
  search: filters.search.trim(),
  minPrice: filters.minPrice,
  maxPrice: filters.maxPrice,
  minRating: filters.rating,
  language: filters.language,
  minExperience: filters.experience,
  speciality: filters.speciality,
  availability: filters.availability,
  verified: filters.verifiedOnly ? true : '',
  sort: sortMap[sortBy] || 'recommended',
  page,
  limit: GUIDE_BIDS_PER_PAGE,
})

export default function useGuideBookingFlow(requestId) {
  const [request, setRequest] = useState(null)
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0, totalItems: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [errorStatus, setErrorStatus] = useState(0)
  const [filters, setFilters] = useState(defaultGuideFilters)
  const [sortBy, setSortBy] = useState('recommended')
  const [page, setPage] = useState(1)
  const [comparisonItems, setComparisonItems] = useState([])
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let active = true
    const timeout = window.setTimeout(async () => {
      setLoading(true)
      setError('')
      setErrorStatus(0)
      try {
        const result = await guideService.getBids(requestId, buildBidQuery(filters, sortBy, page))
        if (!active) return
        setRequest(result.request)
        setItems(result.bids.map((bid) => ({ bid, guide: bid.guide })))
        setPagination(result.pagination)
      } catch (loadError) {
        if (!active) return
        if (loadError.status === 404) {
          setRequest(null)
          setItems([])
        } else {
          setError(loadError.message || 'Guide bids could not be loaded.')
          setErrorStatus(loadError.status || 0)
        }
      } finally {
        if (active) setLoading(false)
      }
    }, import.meta.env.MODE === 'test' ? 0 : 250)
    return () => { active = false; window.clearTimeout(timeout) }
  }, [requestId, filters, sortBy, page, retryKey])

  const retry = useCallback(() => setRetryKey((value) => value + 1), [])
  const changeFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }))
    setPage(1)
  }
  const resetFilters = () => {
    setFilters(defaultGuideFilters)
    setSortBy('recommended')
    setPage(1)
  }
  const toggleComparison = (guideId) => {
    if (comparisonItems.some(({ guide }) => guide.id === guideId)) {
      setComparisonItems((selected) => selected.filter(({ guide }) => guide.id !== guideId))
      return { added: false }
    }
    if (comparisonItems.length >= 3) return { limitReached: true }
    const selected = items.find(({ guide }) => guide.id === guideId)
    if (!selected) return { added: false }
    setComparisonItems((current) => [...current, selected])
    return { added: true }
  }

  const comparisonIds = useMemo(() => comparisonItems.map(({ guide }) => guide.id), [comparisonItems])
  const hasActiveFilters = useMemo(() => Object.entries(filters).some(([key, value]) => key === 'verifiedOnly' ? value : String(value).trim()), [filters])
  return {
    request, items, visibleItems: items, filteredItems: items, totalItems: pagination.totalItems,
    loading, error, errorStatus, retry, filters, changeFilter, resetFilters, sortBy, setSortBy,
    page, setPage, totalPages: Math.max(1, pagination.totalPages || 1),
    comparisonIds, comparisonItems, toggleComparison, hasActiveFilters,
  }
}
