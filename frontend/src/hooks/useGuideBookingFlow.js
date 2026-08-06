import { useEffect, useMemo, useState } from 'react'
import { guideService } from '../services/guideService'
import { defaultGuideFilters } from '../utils/guideFilters'

export const GUIDE_BIDS_PER_PAGE = 4

export const filterAndSortBids = (items, filters, sortBy) => {
  const search = filters.search.trim().toLowerCase()
  const min = filters.minPrice === '' ? null : Number(filters.minPrice)
  const max = filters.maxPrice === '' ? null : Number(filters.maxPrice)
  const rating = filters.rating === '' ? null : Number(filters.rating)
  const experience = filters.experience === '' ? null : Number(filters.experience)

  const filtered = items.filter(({ guide, bid }) => {
    const languages = guide.languages.map((item) => item.name)
    return (!search || guide.name.toLowerCase().includes(search))
      && (min === null || bid.amount >= min)
      && (max === null || bid.amount <= max)
      && (rating === null || guide.rating >= rating)
      && (!filters.language || languages.includes(filters.language))
      && (experience === null || guide.experienceYears >= experience)
      && (!filters.speciality || guide.specialities.includes(filters.speciality))
      && (!filters.availability || guide.availability === filters.availability)
      && (!filters.verifiedOnly || guide.verified)
  })

  const sorters = {
    recommended: () => 0,
    lowest: (a, b) => a.bid.amount - b.bid.amount,
    highest: (a, b) => b.bid.amount - a.bid.amount,
    rating: (a, b) => b.guide.rating - a.guide.rating || b.guide.reviewCount - a.guide.reviewCount,
    experience: (a, b) => b.guide.experienceYears - a.guide.experienceYears,
    newest: (a, b) => new Date(b.bid.submittedAt) - new Date(a.bid.submittedAt),
  }
  return [...filtered].sort(sorters[sortBy] || sorters.recommended)
}

export default function useGuideBookingFlow(requestId) {
  const [request, setRequest] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(defaultGuideFilters)
  const [sortBy, setSortBy] = useState('recommended')
  const [page, setPage] = useState(1)
  const [comparisonIds, setComparisonIds] = useState([])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const requestResult = await guideService.getRequest(requestId)
      if (!requestResult) {
        setRequest(null)
        setItems([])
        return
      }
      const bids = await guideService.getBids(requestId)
      const guides = await Promise.all(bids.map((bid) => guideService.getGuide(bid.guideId)))
      setRequest(requestResult)
      setItems(bids.flatMap((bid, index) => guides[index] ? [{ bid, guide: guides[index] }] : []))
    } catch (loadError) {
      setError(loadError.message || 'Guide bids could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    const loadData = async () => {
      setLoading(true)
      setError('')
      try {
        const requestResult = await guideService.getRequest(requestId)
        if (!active) return
        if (!requestResult) {
          setRequest(null)
          setItems([])
          return
        }
        const bids = await guideService.getBids(requestId)
        const guides = await Promise.all(bids.map((bid) => guideService.getGuide(bid.guideId)))
        if (!active) return
        setRequest(requestResult)
        setItems(bids.flatMap((bid, index) => guides[index] ? [{ bid, guide: guides[index] }] : []))
      } catch (loadError) {
        if (active) setError(loadError.message || 'Guide bids could not be loaded.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadData()
    return () => { active = false }
  }, [requestId])

  const filteredItems = useMemo(() => filterAndSortBids(items, filters, sortBy), [items, filters, sortBy])
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / GUIDE_BIDS_PER_PAGE))
  const visibleItems = filteredItems.slice((page - 1) * GUIDE_BIDS_PER_PAGE, page * GUIDE_BIDS_PER_PAGE)
  const comparisonItems = items.filter(({ guide }) => comparisonIds.includes(guide.id))

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
    if (comparisonIds.includes(guideId)) {
      setComparisonIds((ids) => ids.filter((id) => id !== guideId))
      return { added: false }
    }
    if (comparisonIds.length >= 3) return { limitReached: true }
    setComparisonIds((ids) => [...ids, guideId])
    return { added: true }
  }

  return {
    request, items, visibleItems, filteredItems, loading, error, retry: load,
    filters, changeFilter, resetFilters, sortBy, setSortBy,
    page, setPage, totalPages, comparisonIds, comparisonItems, toggleComparison,
  }
}
