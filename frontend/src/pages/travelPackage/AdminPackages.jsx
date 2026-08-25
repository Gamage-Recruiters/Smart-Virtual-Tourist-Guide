import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/travelPackage/Header.jsx'
import Footer from '../../components/travelPackage/Footer.jsx'
import ImageLightbox from '../../components/travelPackage/ImageLightbox.jsx'
import tagIcon from '../../assets/travelPackage/tag.png'
import locationIcon from '../../assets/travelPackage/location.png'

const categoryOptions = [
  { label: 'Adventure Tours', value: 'adventure' },
  { label: 'Cultural Heritage', value: 'cultural' },
  { label: 'Relaxation', value: 'relaxation' },
  { label: 'Food & Dining', value: 'food' },
  { label: 'Nature & Eco', value: 'nature' },
  { label: 'Nightlife', value: 'nightlife' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Photography', value: 'photography' },
  { label: 'Historical Sites', value: 'historical' },
  { label: 'Beach Holidays', value: 'beach' },
]

const getPromotionExpiryTime = (basicInformation) => {
  const expiryDate = new Date(basicInformation?.promotionExpiryDate)
  return Number.isFinite(expiryDate.getTime())
    ? Date.UTC(expiryDate.getUTCFullYear(), expiryDate.getUTCMonth(), expiryDate.getUTCDate()) - (5 * 60 + 30) * 60 * 1000
    : NaN
}

const hasActivePromotion = (basicInformation) => {
  const promotionPrice = Number(basicInformation?.promotionPrice)
  const expiryTime = getPromotionExpiryTime(basicInformation)
  return Number.isFinite(promotionPrice) && promotionPrice >= 0
    && Number.isFinite(expiryTime) && expiryTime > Date.now()
}

function OfferPrice({ basicInformation }) {
  const [now, setNow] = React.useState(Date.now())
  const expiryTime = getPromotionExpiryTime(basicInformation)
  const promotionPrice = Number(basicInformation?.promotionPrice)
  const isActive = Number.isFinite(promotionPrice) && promotionPrice >= 0
    && Number.isFinite(expiryTime) && expiryTime > now

  React.useEffect(() => {
    if (!isActive) return undefined
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [isActive])

  return (
    <div style={{ position: 'absolute', bottom: '82px', right: '24px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
      {isActive && (
        <span style={{ fontSize: '16px', color: '#9CA3AF', textDecoration: 'line-through' }}>
          ${basicInformation?.price}
        </span>
      )}
      <span style={{ fontSize: '28px', fontWeight: 700, color: '#000000' }}>
        ${isActive ? basicInformation.promotionPrice : basicInformation?.price}
      </span>
      <span style={{ fontSize: '12px', color: '#6B7280' }}>per person</span>
    </div>
  )
}

function OfferCountdown({ basicInformation }) {
  const [now, setNow] = React.useState(Date.now())
  const expiryTime = getPromotionExpiryTime(basicInformation)
  const promotionPrice = Number(basicInformation?.promotionPrice)
  const isActive = Number.isFinite(promotionPrice) && promotionPrice >= 0
    && Number.isFinite(expiryTime) && expiryTime > now
  const remaining = Math.max(0, expiryTime - now)
  const totalMinutes = Math.floor(remaining / 60000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60

  React.useEffect(() => {
    if (!isActive) return undefined
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [isActive])

  if (!isActive) return null

  return (
   <span style={{ 
  display: 'inline-flex', 
  alignItems: 'center', 
  gap: '4px', 
  padding: '4px 8px', 
  border: '1px solid #BFDBFE', 
  borderRadius: '999px', 
  background: '#EFF6FF', 
  fontSize: '13px', 
  fontWeight: 700, 
  whiteSpace: 'nowrap', 
  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.12)' 
}}>
  <span style={{ color: '#64748B' }}>Offer ends in :</span>
  <span style={{ color: '#2563EB', fontSize: '12px' }}>{days}d</span>
  <span style={{ color: '#D97706', fontSize: '13px' }}>{hours}h</span>
  <span style={{ color: '#DC2626', fontSize: '15px' }}>{minutes}m</span>
</span>
  )
}



function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="6.5" stroke="#C7CDD7" strokeWidth="1.8" />
      <path d="M16 16L20.5 20.5" stroke="#C7CDD7" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconFilter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7H20" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 11H16" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 15H12" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconPriceTag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 11.5L11.5 5H19V12.5L12.5 19L5 11.5Z" stroke="#6B7280" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="15.25" cy="8.75" r="1.25" fill="#6B7280" />
    </svg>
  )
}

function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9L12 15L18 9" stroke="#C1C7D0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="white" opacity="0.22" />
      <path d="M12 7V17" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 12H17" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default function AdminPackages({ embedLayout = false }) {
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false)
  const [favorites, setFavorites] = React.useState({})
  const [packages, setPackages] = useState([])
  const [filteredPackages, setFilteredPackages] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isPriceOpen, setIsPriceOpen] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showDraftsModal, setShowDraftsModal] = useState(false)
  const [drafts, setDrafts] = useState([])
  const [loadingDrafts, setLoadingDrafts] = useState(false)
  const [lightboxImages, setLightboxImages] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)

  const openLightbox = (images = [], index = 0) => {
    if (!images || images.length === 0) return
    setLightboxImages(images)
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }
  const categoryDropdownRef = React.useRef(null)
  const searchDropdownRef = React.useRef(null)
  const priceDropdownRef = React.useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:5000/api/packages')
      .then(res => res.json())
      .then(response => {
        const publishedPackages = (response.data || []).filter(pkg => pkg.status === 'publish');
        setPackages(publishedPackages);
        setFilteredPackages(publishedPackages);
      })
      .catch(err => console.error('Error fetching packages:', err))
  }, [])

  const handleCategorySelect = (categoryValue, categoryLabel) => {
    setSelectedCategory(categoryLabel)
    setIsCategoryOpen(false)
    
    let basePackages = packages
    
    if (categoryLabel !== 'All Categories') {
      basePackages = packages.filter(pkg => 
        pkg.BasicInformation?.categories?.includes(categoryValue)
      )
    }
    
    applyFilters(basePackages, searchQuery)
  }

  const applyFilters = (packagesToFilter, search) => {
    let result = packagesToFilter
    
    if (search) {
      result = result.filter(pkg => {
        const title = pkg.BasicInformation?.title?.toLowerCase() || ''
        const destination = pkg.LocationAndHighlights?.destination?.toLowerCase() || ''
        const searchLower = search.toLowerCase()
        return title.includes(searchLower) || destination.includes(searchLower)
      })
    }
    
    // Apply price range filter
    if (minPrice || maxPrice) {
      result = result.filter(pkg => {
        const price = hasActivePromotion(pkg.BasicInformation)
          ? pkg.BasicInformation.promotionPrice
          : pkg.BasicInformation?.price
        if (price === undefined || price === null) return false
        
        const min = minPrice ? parseFloat(minPrice) : 0
        const max = maxPrice ? parseFloat(maxPrice) : Infinity
        
        return price >= min && price <= max
      })
    }
    
    setFilteredPackages(result)
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (value.trim()) {
      const searchLower = value.toLowerCase()
      const suggestions = []
      const seen = new Set()
      
      packages.forEach(pkg => {
        const title = pkg.BasicInformation?.title || ''
        const destination = pkg.LocationAndHighlights?.destination || ''
        
        // Add title if it matches and hasn't been added
        if (title && title.toLowerCase().includes(searchLower)) {
          const key = `title:${title.toLowerCase()}`
          if (!seen.has(key)) {
            seen.add(key)
            suggestions.push({
              value: title,
              type: 'title',
              id: pkg._id + '-title'
            })
          }
        }
        
        // Add destination if it matches and hasn't been added
        if (destination && destination.toLowerCase().includes(searchLower)) {
          const key = `destination:${destination.toLowerCase()}`
          if (!seen.has(key)) {
            seen.add(key)
            suggestions.push({
              value: destination,
              type: 'destination',
              id: pkg._id + '-destination'
            })
          }
        }
      })
      
      setSearchSuggestions(suggestions)
      setIsSearchOpen(suggestions.length > 0)
    } else {
      setSearchSuggestions([])
      setIsSearchOpen(false)
      const basePackages = selectedCategory === 'All Categories' ? packages : packages.filter(pkg => {
        const categoryValue = categoryOptions.find(cat => cat.label === selectedCategory)?.value
        return pkg.BasicInformation?.categories?.includes(categoryValue)
      })
      setFilteredPackages(basePackages)
    }
  }

  const handleSuggestionSelect = (suggestion) => {
    const searchValue = suggestion.value
    setSearchQuery(searchValue)
    setIsSearchOpen(false)
    setSearchSuggestions([])
    
    const basePackages = selectedCategory === 'All Categories' ? packages : packages.filter(pkg => {
      const categoryValue = categoryOptions.find(cat => cat.label === selectedCategory)?.value
      return pkg.BasicInformation?.categories?.includes(categoryValue)
    })
    
    applyFilters(basePackages, searchValue)
  }

  const handlePriceApply = () => {
    setIsPriceOpen(false)
    
    let basePackages = packages
    
    if (selectedCategory !== 'All Categories') {
      const categoryValue = categoryOptions.find(cat => cat.label === selectedCategory)?.value
      basePackages = packages.filter(pkg => 
        pkg.BasicInformation?.categories?.includes(categoryValue)
      )
    }
    
    applyFilters(basePackages, searchQuery)
  }

  const handlePriceClear = () => {
    setMinPrice('')
    setMaxPrice('')
    setIsPriceOpen(false)
    
    let basePackages = packages
    
    if (selectedCategory !== 'All Categories') {
      const categoryValue = categoryOptions.find(cat => cat.label === selectedCategory)?.value
      basePackages = packages.filter(pkg => 
        pkg.BasicInformation?.categories?.includes(categoryValue)
      )
    }
    
    applyFilters(basePackages, searchQuery)
  }

  const handleDelete = (id) => {
    // Validate MongoDB ObjectId format (24 hex characters)
    if (!/^[a-f0-9]{24}$/i.test(id)) {
      console.error('Invalid package ID format')
      return
    }

    const confirmed = window.confirm('Are you sure you want to permanently delete this package?')
    if (!confirmed) return

    fetch(`http://localhost:5000/api/packages/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed')
        setPackages(prev => prev.filter(p => p._id !== id))
        setFilteredPackages(prev => prev.filter(p => p._id !== id))
      })
      .catch(err => console.error('Error deleting package:', err))
  }

  const toggleFavorite = (pkgId) => {
    setFavorites(prev => ({ ...prev, [pkgId]: !prev[pkgId] }))
  }

  const handleViewDrafts = async () => {
    setShowDraftsModal(true)
    setLoadingDrafts(true)
    try {
      const response = await fetch('http://localhost:5000/api/packages')
      const data = await response.json()
      const draftPackages = (data.data || []).filter(pkg => pkg.status === 'draft')
      setDrafts(draftPackages)
    } catch (err) {
      console.error('Error fetching drafts:', err)
      setDrafts([])
    } finally {
      setLoadingDrafts(false)
    }
  }

  const closeDraftsModal = () => {
    setShowDraftsModal(false)
  }

  const handleDeleteDraft = async (e, draftId) => {
    e.stopPropagation()
    
    const confirmed = window.confirm('Are you sure you want to delete this draft?')
    if (!confirmed) return

    try {
      const response = await fetch(`http://localhost:5000/api/packages/${draftId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Delete failed')
      
      setDrafts(prev => prev.filter(draft => draft._id !== draftId))
      alert('Draft deleted successfully!')
    } catch (err) {
      console.error('Error deleting draft:', err)
      alert('Failed to delete draft. Please try again.')
    }
  }

  React.useEffect(() => {
    const handleOutsideClick = event => {
      if (isCategoryOpen && categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false)
      }
      if (isSearchOpen && searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
      if (isPriceOpen && priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)) {
        setIsPriceOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isCategoryOpen, isSearchOpen, isPriceOpen])

  const mainContent = (
    <main
      style={{
        flex: 1,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #A0DBFF 100%)',
        paddingTop: '118px',
        paddingBottom: '64px',
      }}
    >
      <section
        style={{
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '16px 24px',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ paddingLeft: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '35px', lineHeight: 1.1, fontWeight: 700, color: '#111827' }}>Travel Packages</h1>
          <p style={{ margin: '12px 0 0', fontSize: '15px', color: '#6B7280' }}>Discover amazing destinations at unbeatable prices</p>
        </div>

        {/* Search & Filter Bar */}
        <div
          style={{
            marginTop: '24px',
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 10px 22px rgba(15, 23, 42, 0.16)',
            border: '1px solid rgba(209, 213, 219, 0.55)',
            padding: '48px 20px 46px',
            minHeight: '138px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 0.8fr 0.7fr', gap: '22px', alignItems: 'start' }}>
            <div ref={searchDropdownRef} style={{ position: 'relative', width: '100%' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  height: '38px',
                  padding: '0 14px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '6px',
                  background: '#FFFFFF',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65)',
                }}
              >
                <IconSearch />
                <input
                  type="text"
                  placeholder="Search Destinations Or Packages......"
                  aria-label="Search destinations or packages"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{
                    border: 0,
                    outline: 'none',
                    width: '100%',
                    fontSize: '13px',
                    color: '#111827',
                    background: 'transparent',
                  }}
                />
              </label>
              {isSearchOpen && searchSuggestions.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '44px',
                    left: 0,
                    right: 0,
                    background: '#FFFFFF',
                    border: '1px solid #D8DEE8',
                    borderRadius: '8px',
                    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 30,
                  }}
                >
                  {searchSuggestions.map((suggestion, idx) => (
                    <div
                      key={suggestion.id}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      style={{
                        padding: '10px 14px',
                        cursor: 'pointer',
                        borderBottom: idx < searchSuggestions.length - 1 ? '1px solid #F3F4F6' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
                    >
                      {suggestion.type === 'destination' && (
                        <img src={locationIcon} alt="destination" style={{ width: '16px', height: '16px' }} />
                      )}
                      {suggestion.type === 'title' && (
                        <img src={tagIcon} alt="package" style={{ width: '16px', height: '16px' }} />
                      )}
                      <div style={{ fontSize: '14px', color: '#111827' }}>
                        {suggestion.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div ref={categoryDropdownRef} style={{ position: 'relative', width: '100%' }}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(prev => !prev)}
                aria-expanded={isCategoryOpen}
                aria-haspopup="listbox"
                style={{
                  height: '38px',
                  padding: '0 16px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '6px',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  fontSize: '13px',
                  color: '#111827',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65)',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                  <IconFilter />
                  {selectedCategory}
                </span>
                <IconChevron />
              </button>
              {isCategoryOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '44px',
                    left: 0,
                    right: 0,
                    background: '#FFFFFF',
                    border: '1px solid #D8DEE8',
                    borderRadius: '8px',
                    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
                    padding: '10px 0',
                    zIndex: 20,
                  }}
                >
                  <div
                    onClick={() => handleCategorySelect('all', 'All Categories')}
                    style={{
                      padding: '10px 14px',
                      fontSize: '13px',
                      color: selectedCategory === 'All Categories' ? '#2563EB' : '#334155',
                      fontWeight: selectedCategory === 'All Categories' ? 600 : 400,
                      lineHeight: 1.2,
                      cursor: 'pointer',
                      borderBottom: '1px solid #E5E7EB',
                    }}
                  >
                    Clear Filter
                  </div>
                  {categoryOptions.map(category => (
                    <div
                      key={category.value}
                      onClick={() => handleCategorySelect(category.value, category.label)}
                      style={{
                        padding: '10px 14px',
                        fontSize: '13px',
                        color: selectedCategory === category.label ? '#2563EB' : '#334155',
                        fontWeight: selectedCategory === category.label ? 600 : 400,
                        lineHeight: 1.2,
                        cursor: 'pointer',
                      }}
                    >
                      {category.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div ref={priceDropdownRef} style={{ position: 'relative', width: '100%' }}>
              <button
                type="button"
                onClick={() => setIsPriceOpen(prev => !prev)}
                aria-expanded={isPriceOpen}
                aria-haspopup="true"
                style={{
                  height: '38px',
                  padding: '0 16px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '6px',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  fontSize: '13px',
                  color: '#111827',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65)',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                  <IconPriceTag />
                  {minPrice || maxPrice ? `$${minPrice || '0'} - $${maxPrice || '∞'}` : 'All Prices'}
                </span>
                <IconChevron />
              </button>
              {isPriceOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '44px',
                    left: 0,
                    right: 0,
                    background: '#FFFFFF',
                    border: '1px solid #D8DEE8',
                    borderRadius: '8px',
                    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
                    padding: '8px',
                    zIndex: 20,
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px', fontWeight: 500 }}>
                      Min Price ($)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #D8DEE8',
                        borderRadius: '6px',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px', fontWeight: 500 }}>
                      Max Price ($)
                    </label>
                    <input
                      type="number"
                      placeholder="No limit"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #D8DEE8',
                        borderRadius: '6px',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handlePriceClear}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #D8DEE8',
                        borderRadius: '6px',
                        background: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#6B7280',
                        cursor: 'pointer',
                      }}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={handlePriceApply}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        borderRadius: '6px',
                        background: 'linear-gradient(180deg, #2563EB 0%, #1D4ED8 100%)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Count & Add Button */}
        <div
          style={{
            marginTop: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '0 12px',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>
            Showing <span style={{ fontWeight: 700, color: '#111827' }}>{filteredPackages.length} {filteredPackages.length === 1 ? 'Package' : 'Packages'}</span>
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={handleViewDrafts}
              style={{
                height: '45px',
                padding: '0 32px',
                border: '1px solid #2563EB',
                borderRadius: '8px',
                background: '#FFFFFF',
                color: '#626263',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#EFF6FF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF'
              }}
            >
              View Drafts
            </button>
            <button
              type="button"
              onClick={() => navigate('/packages/new')}
              style={{
                height: '45px',
                padding: '0 70px',
                border: '0',
                borderRadius: '8px',
                background: 'linear-gradient(180deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 18px rgba(11, 114, 232, 0.28)',
                cursor: 'pointer',
              }}
            >
              <IconPlus />
              Add new Package
            </button>
          </div>
        </div>

        {/* Package Cards Grid - HORIZONTAL LAYOUT */}
        <div
          style={{
            marginTop: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            padding: '0 12px',
          }}
        >
          {filteredPackages.map((pkg) => (
            <div
              key={pkg._id}
              style={{
                        background: '#FFFFFF',
						borderRadius: '16px',
						overflow: 'hidden',
						boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
						border: '1px solid #E5E7EB',
						transition: 'transform 0.2s ease, box-shadow 0.2s ease',
						display: 'flex',
						flexDirection: 'row',
						minHeight: '100px',  
            maxHeight: '360px', 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(15, 23, 42, 0.18)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.12)'
              }}
            >
              {/* Image Section - 35% width */}
              <div
                style={{ position: 'relative', width: '35%', minHeight: '450px', overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}
                onClick={() => openLightbox(pkg.LocationAndHighlights?.images, 0)}
              >
                <img
                  src={pkg.LocationAndHighlights?.images?.[0] }
                  alt={pkg.BasicInformation?.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {pkg.LocationAndHighlights?.images?.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backdropFilter: 'blur(4px)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="#FFFFFF" />
                      <path d="M21 15L16 10L5 21" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{pkg.LocationAndHighlights.images.length}</span>
                  </div>
                )}
              </div>

              {/* Card Content - 65% width */}
              <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* Rating Badge - Top Right */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="#FBBF24" />
                  </svg>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>4.8</span>
                  <span style={{ fontSize: '13px', color: '#000000' }}>(124 reviews)</span>
                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      aria-label={`Actions for ${pkg.BasicInformation?.title || 'package'}`}
                      aria-expanded={openMenuId === pkg._id}
                      onClick={() => setOpenMenuId(openMenuId === pkg._id ? null : pkg._id)}
                      style={{ width: '40px', height: '40px', border: '1px solid #E5E7EB', borderRadius: '12px', background: '#FFFFFF', color: '#374151', fontSize: '24px', lineHeight: 1, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    >
                      ⋮
                    </button>
                    {openMenuId === pkg._id && (
                      <div role="menu" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', minWidth: '120px', padding: '6px', border: '1px solid #E5E7EB', borderRadius: '10px', background: '#FFFFFF', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.16)', zIndex: 20 }}>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setOpenMenuId(null)
                            navigate(`/packages/edit/${pkg._id}`)
                          }}
                          style={{ width: '100%', padding: '9px 12px', border: 'none', borderRadius: '7px', background: 'transparent', color: '#111827', textAlign: 'left', fontSize: '14px', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setOpenMenuId(null)
                            handleDelete(pkg._id)
                          }}
                          style={{ width: '100%', padding: '9px 12px', border: 'none', borderRadius: '7px', background: 'transparent', color: '#DC2626', textAlign: 'left', fontSize: '14px', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Title */}
                <h3 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 700, color: '#111827' }}>
                  {pkg.BasicInformation?.title}
                </h3>

                {/* Description */}
                <p style={{ margin: '0 0 12px', fontSize: '16px', color: '#6B7280', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {pkg.BasicInformation?.description}
                </p>



                {/* highlightsGrid - 2 columns */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    marginTop: '8px',
                  }}
                >
                  {pkg.LocationAndHighlights?.highlights?.map((item, idx) => (
					<div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					<span style={{ fontSize: '19px', color: '#1b3b80', lineHeight: 1 }}>•</span>
					<span style={{ fontSize: '16px', color: '#3d8cec' }}>{item}</span>
					</div>
                  ))}
                </div>

				{/* Duration & Group Size */}
				<div style={{ display: 'flex', gap: '30px', marginTop: '3px', alignItems: 'center' }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="3" y="4" width="18" height="18" rx="2" stroke="#6B7280" strokeWidth="1.6"/>
					<path d="M8 2V6" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round"/>
					<path d="M16 2V6" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round"/>
					<path d="M3 10H21" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round"/>
					</svg>
					<span style={{ fontSize: '17px', fontWeight: 500, color: '#4B5563' }}>{pkg.BasicInformation?.duration}</span>
				</div>
				</div>

                {/* Price Section - Above View Details Button */}
                <OfferPrice basicInformation={pkg.BasicInformation} />

                {/* View Details + Action Buttons - Bottom Right */}
                <div style={{ position: 'absolute', bottom: '24px', right: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <OfferCountdown basicInformation={pkg.BasicInformation} />
                  <button
                    type="button"
                    onClick={() => navigate(`/packages/view/${pkg._id}`)}
                    style={{
                      width: '200px',
                      height: '46px',
                      border: 'none',
                      borderRadius: '12px',
                      background: 'linear-gradient(180deg, #2563EB 0%, #1D4ED8 100%)',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                    }}
                  >
                    View Details
                  </button>
                </div>

                {/* Wishlist Heart Icon - Bottom Left */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(pkg.id)}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '24px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="#EF4444" strokeWidth="1.8" fill={favorites[pkg.id] ? '#EF4444' : 'none'} />
                  </svg>
                </button>
                </div>
              </div>
          ))}
        </div>
      </section>

      {/* Drafts Modal */}
      {showDraftsModal && (
        <>
          <div
            onClick={closeDraftsModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
              animation: 'fadeIn 0.2s ease',
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
               background: 'linear-gradient(180deg, #FFFFFF 0%, #A0DBFF 100%)',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              width: '90%',
              maxWidth: '900px',
              maxHeight: '85vh',
              overflow: 'hidden',
              zIndex: 1000,
              animation: 'slideIn 0.3s ease',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '24px 28px',
                borderBottom: '1px solid #E5E7EB',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111827' }}>Draft Packages</h2>
              <button
                onClick={closeDraftsModal}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F3F4F6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6 6L18 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px 28px', overflowY: 'auto', maxHeight: 'calc(85vh - 88px)' }}>
              {loadingDrafts ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      border: '4px solid #E5E7EB',
                      borderTop: '4px solid #2563EB',
                      borderRadius: '50%',
                      margin: '0 auto 16px',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>Loading drafts...</p>
                </div>
              ) : drafts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 16px' }}>
                    <path d="M9 11H15" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
                    <path d="M9 15H13" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                  </svg>
                  <p style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 8px' }}>No Drafts Found</p>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>You don't have any draft packages at the moment.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {drafts.map((draft) => {
                    const categoryLabels = draft.BasicInformation?.categories
                      ?.map(catVal => categoryOptions.find(opt => opt.value === catVal)?.label)
                      .filter(Boolean)
                      .join(', ') || 'No categories'

                    const createdDate = draft.createdAt ? new Date(draft.createdAt) : null
                    const formattedDate = createdDate
                      ? createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : 'N/A'
                    const formattedTime = createdDate
                      ? createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                      : 'N/A'

                    return (
                      <div
                        key={draft._id}
                        style={{
                          border: '1px solid #E5E7EB',
                          borderRadius: '12px',
                          padding: '20px',
                          background: '#F9FAFB',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                        onClick={() => navigate(`/packages/edit/${draft._id}`)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#F3F4F6'
                          e.currentTarget.style.borderColor = '#2563EB'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#F9FAFB'
                          e.currentTarget.style.borderColor = '#E5E7EB'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827', flex: 1 }}>
                            {draft.BasicInformation?.title || 'Untitled Package'}
                          </h3>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#F59E0B',
                              background: '#FEF3C7',
                              padding: '4px 10px',
                              borderRadius: '6px',
                            }}
                          >
                            DRAFT
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Categories</div>
                            <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>{categoryLabels}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Duration</div>
                            <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                              {draft.BasicInformation?.duration || 'Not set'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Price</div>
                            <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                              {draft.BasicInformation?.price ? `$${draft.BasicInformation.price}` : 'Not set'}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Group Size</div>
                            <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                              {draft.BasicInformation?.groupSize || 'Not set'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Difficulty</div>
                            <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                              {draft.BasicInformation?.difficulty
                                ? draft.BasicInformation.difficulty.charAt(0).toUpperCase() + draft.BasicInformation.difficulty.slice(1)
                                : 'Not set'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Created</div>
                            <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                              {formattedDate} at {formattedTime}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            color: '#2563EB',
                            fontWeight: 600,
                            marginTop: '8px',
                          }}
                        >
                          <span>Click to edit</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                            <path d="M12 5L19 12L12 19" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>

                        {/* Delete Button - Bottom Right */}
                        <button
                          onClick={(e) => handleDeleteDraft(e, draft._id)}
                          style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            border: '1px solid #FCA5A5',
                            background: '#FEE2E2',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            padding: 0,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FECACA'
                            e.currentTarget.style.borderColor = '#EF4444'
                            e.currentTarget.style.transform = 'scale(1.05)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#FEE2E2'
                            e.currentTarget.style.borderColor = '#FCA5A5'
                            e.currentTarget.style.transform = 'scale(1)'
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 7H20" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                            <path d="M10 11V17" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                            <path d="M14 11V17" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                            <path d="M5 7L6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19L19 7" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 7V4C9 3.4 9.4 3 10 3H14C14.6 3 15 3.4 15 4V7" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translate(-50%, -48%);
                }
                to {
                  opacity: 1;
                  transform: translate(-50%, -50%);
                }
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        </>
      )}
    </main>
  )

  if (embedLayout) {
    return mainContent
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #A0DBFF 100%)',
      }}
    >
      <Header />
      {mainContent}
      <Footer />
      {isLightboxOpen && (
        <ImageLightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setIsLightboxOpen(false)}
          onNavigate={(index) => setLightboxIndex(index)}
        />
      )}
    </div>
  )
}