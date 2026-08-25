import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/travelPackage/Header.jsx'
import Footer from '../../components/travelPackage/Footer.jsx'
import SucessPackage from './SucessPackage.jsx'

class AddNewPackageClass extends React.Component {
  state = {
    selectedImages: [],
    existingImages: [],
    title: '',
    duration: '',
    price: '',
    groupSize: '',
    description: '',
    selectedCategories: [],
    isCategoryOpen: false,
    selectedDifficulty: '',
    days: [{ title: '', description: '', activities: ['', '', ''] }],
    activeDay: 0,
    destination: '',
    highlights: '',
    agencyName: '',
    email: '',
    phone: '',
    packageId: null,
    isPublishedEdit: false,
    loading: false,
    publishedPackage: null,
    whatsIncluded: [],
    isIncludedOpen: false,
    whatsIncludedOptions: [
      { value: 'airportTransfers', label: 'Airport transfers' },
      { value: 'transportation', label: 'Air-conditioned transportation' },
      { value: 'accommodation', label: 'Accommodation in 4-star hotels' },
      { value: 'meals', label: 'Daily breakfast and dinner' },
      { value: 'guide', label: 'Professional English-speaking guide' },
      { value: 'entranceFees', label: 'All entrance fees' },
      { value: 'taxes', label: 'Government taxes & service charges' },
      { value: 'water', label: 'Bottled water during tours' },
      { value: 'support', label: '24/7 customer support' },
    ],
    packageFeatures: [],
    isFeaturesOpen: false,
    packageFeaturesOptions: [
      { value: 'freeCancellation', label: 'Free cancellation up to 24h' },
      { value: 'instantConfirmation', label: 'Instant confirmation' },
      { value: 'smallGroup', label: 'Small group experience' },
    ],
    errors: {},
    isSubmitting: false,
  }

  categoryMenuRef = React.createRef()
  includedMenuRef = React.createRef()
  featuresMenuRef = React.createRef()

  categoryOptions = [
    { value: 'adventure', label: 'Adventure Tours' },
    { value: 'cultural', label: 'Cultural Heritage' },
    { value: 'relaxation', label: 'Relaxation' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'nature', label: 'Nature & Eco' },
    { value: 'nightlife', label: 'Nightlife' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'photography', label: 'Photography' },
    { value: 'historical', label: 'Historical Sites' },
    { value: 'beach', label: 'Beach Holidays' },
  ]

  componentDidMount() {
    document.addEventListener('mousedown', this.handleCategoryOutsideClick)
    document.addEventListener('mousedown', this.handleIncludedOutsideClick)
    document.addEventListener('mousedown', this.handleFeaturesOutsideClick)
    const { id } = this.props.params
    if (id) {
      this.setState({ loading: true })
      fetch(`http://localhost:5000/api/packages/${id}`)
        .then(res => res.json())
        .then(({ data }) => {
          if (!data) return
          const bi = data.BasicInformation || {}
          const lh = data.LocationAndHighlights || {}
          const ac = data.AgencyContactInformation || {}
          const days = (data.DayByDayItinerary || []).map(d => ({
            title: d.title || '',
            description: d.description || '',
            activities: d.activities?.length ? d.activities : ['', '', ''],
          }))
          this.setState({
            packageId: data._id,
            isPublishedEdit: data.status === 'publish',
            existingImages: lh.images || [],
            title: bi.title || '',
            duration: bi.duration || '',
            price: bi.price != null ? String(bi.price) : '',
            groupSize: bi.groupSize || '',
            description: bi.description || '',
            selectedCategories: bi.categories || [],
            selectedDifficulty: bi.difficulty || '',
            destination: lh.destination || '',
            highlights: Array.isArray(lh.highlights) ? lh.highlights.join('\n') : lh.highlights || '',
            days: days.length ? days : [{ title: '', description: '', activities: ['', '', ''] }],
            agencyName: ac.agencyName || '',
            email: ac.email || '',
            phone: ac.phone || '',
            whatsIncluded: bi.whatsIncluded || [],
            packageFeatures: bi.packageFeatures || [],
            loading: false,
          })
        })
        .catch(() => this.setState({ loading: false }))
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleCategoryOutsideClick)
    document.removeEventListener('mousedown', this.handleIncludedOutsideClick)
    document.removeEventListener('mousedown', this.handleFeaturesOutsideClick)
  }

  handleCategoryOutsideClick = (event) => {
    if (!this.state.isCategoryOpen) return
    if (!this.categoryMenuRef.current) return
    if (this.categoryMenuRef.current.contains(event.target)) return
    this.setState({ isCategoryOpen: false })
  }

  handleIncludedOutsideClick = (event) => {
    if (!this.state.isIncludedOpen) return
    if (!this.includedMenuRef.current) return
    if (this.includedMenuRef.current.contains(event.target)) return
    this.setState({ isIncludedOpen: false })
  }

  handleFeaturesOutsideClick = (event) => {
    if (!this.state.isFeaturesOpen) return
    if (!this.featuresMenuRef.current) return
    if (this.featuresMenuRef.current.contains(event.target)) return
    this.setState({ isFeaturesOpen: false })
  }

  getMaxDays = () => {
    const match = this.state.duration.match(/\d+/)
    return match ? parseInt(match[0], 10) : null
  }

  handleAddDay = () => {
    const max = this.getMaxDays()
    this.setState(prev => {
      if (max !== null && prev.days.length >= max) return null
      const days = [...prev.days, { title: '', description: '', activities: ['', '', ''] }]
      return { days, activeDay: days.length - 1 }
    })
  }

  handleDayField = (dayIndex, field, value) => {
    this.setState(prev => {
      const days = prev.days.map((d, i) => i === dayIndex ? { ...d, [field]: value } : d)
      return { days }
    })
  }

  handleAddActivity = (dayIndex) => {
    this.setState(prev => {
      const days = prev.days.map((d, i) => i === dayIndex ? { ...d, activities: [...d.activities, ''] } : d)
      return { days }
    })
  }

  handleRemoveActivity = (dayIndex, actIndex) => {
    this.setState(prev => {
      const days = prev.days.map((d, i) => i === dayIndex ? { ...d, activities: d.activities.filter((_, j) => j !== actIndex) } : d)
      return { days }
    })
  }

  handleActivityChange = (dayIndex, actIndex, value) => {
    this.setState(prev => {
      const days = prev.days.map((d, i) => {
        if (i !== dayIndex) return d
        const activities = d.activities.map((a, j) => j === actIndex ? value : a)
        return { ...d, activities }
      })
      return { days }
    })
  }

  handleImageChange = (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 50) {
      this.setState({ 
        selectedImages: files.slice(0, 50),
        errors: { ...this.state.errors, selectedImages: 'Maximum 50 images allowed (first 50 selected)' }
      })
      return
    }
    this.setState({ 
      selectedImages: files,
      errors: { ...this.state.errors, selectedImages: null }
    })
    if (event.target) event.target.value = ''
  }

  handleImageAdd = (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    const totalCurrent = (this.state.selectedImages?.length || 0) + (this.state.existingImages?.length || 0)
    const available = 50 - totalCurrent
    if (available <= 0) {
      this.setState({
        errors: { ...this.state.errors, selectedImages: 'Maximum 50 images allowed' }
      })
      return
    }
    const toAdd = files.slice(0, available)
    this.setState(prev => ({
      selectedImages: [...prev.selectedImages, ...toAdd],
      errors: { ...prev.errors, selectedImages: null }
    }))
    if (event.target) event.target.value = ''
  }

  handleRemoveSelectedImage = (index) => {
    this.setState(prev => ({
      selectedImages: prev.selectedImages.filter((_, i) => i !== index),
      errors: { ...prev.errors, selectedImages: null }
    }))
  }

  handleRemoveExistingImage = (index) => {
    this.setState(prev => ({
      existingImages: prev.existingImages.filter((_, i) => i !== index),
      errors: { ...prev.errors, selectedImages: null }
    }))
  }

  clearError = (field) => {
    this.setState(prev => ({
      errors: { ...prev.errors, [field]: null }
    }))
  }

  validateForm = () => {
    const errors = {}
    const {
      title, selectedCategories, duration, price, groupSize,
      selectedDifficulty, whatsIncluded, packageFeatures,
      description, destination, highlights, selectedImages, existingImages,
      days, agencyName, email, phone
    } = this.state

    // ===== BASIC INFORMATION =====
    if (!title?.trim()) errors.title = 'Package title is required'
    if (!selectedCategories?.length) errors.selectedCategories = 'Select at least one category'
    if (!duration?.trim()) {
      errors.duration = 'Duration is required'
    } else if (!/\d+/.test(duration)) {
      errors.duration = 'Duration must contain a number'
    }
    if (!price?.trim()) {
      errors.price = 'Price is required'
    } else {
      const cleanPrice = price.replace(/[$,€£¥\s,]/g, '').trim()
      const priceNum = parseFloat(cleanPrice)
      if (isNaN(priceNum)) {
        errors.price = 'Price must be a valid number'
      } else if (priceNum <= 0) {
        errors.price = 'Price must be greater than 0'
      }
    }
    if (!groupSize?.trim()) errors.groupSize = 'Group size is required'
    if (!whatsIncluded?.length) errors.whatsIncluded = 'Select at least one inclusion'
    if (!description?.trim()) errors.description = 'Description is required'

    // ===== LOCATION & HIGHLIGHTS =====
    if (!destination?.trim()) errors.destination = 'Destination is required'
    if (!highlights?.trim()) {
      errors.highlights = 'Package highlights are required'
    } else {
      const lines = highlights.split('\n').filter(line => line.trim())
      if (lines.length === 0) errors.highlights = 'Enter at least one highlight'
      if (lines.length > 12) errors.highlights = 'Maximum 12 highlights allowed'
    }
    const totalImagesCount = (selectedImages?.length || 0) + (existingImages?.length || 0)
    if (!totalImagesCount) {
      errors.selectedImages = 'Upload at least one image'
    } else if (totalImagesCount > 50) {
      errors.selectedImages = 'Maximum 50 images allowed'
    }

    // ===== DAY-BY-DAY ITINERARY =====
    if (!days?.length) {
      errors.days = 'Add at least one day to the itinerary'
    } else {
      days.forEach((day, idx) => {
        if (!day.title?.trim()) errors[`day_${idx}_title`] = `Day ${idx + 1} title is required`
        if (!day.description?.trim()) errors[`day_${idx}_description`] = `Day ${idx + 1} description is required`
        const validActivities = day.activities.filter(a => a?.trim())
        if (!validActivities.length) errors[`day_${idx}_activities`] = `Day ${idx + 1} must have at least one activity`
      })
    }

    // ===== AGENCY CONTACT INFORMATION =====
    if (!agencyName?.trim()) errors.agencyName = 'Agency name is required'
    if (!email?.trim()) {
      errors.email = 'Contact email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address'
    }
    if (!phone?.trim()) {
      errors.phone = 'Contact phone is required'
    } else {
      const digitsOnly = phone.replace(/\D/g, '')
      if (!digitsOnly) {
        errors.phone = 'Phone must contain at least one digit'
      } else if (digitsOnly.length < 8) {
        errors.phone = 'Phone must have at least 8 digits'
      }
    }

    this.setState({ errors })
    return errors
  }

  handleSubmit = async (status) => {
    if (this.state.isSubmitting) return

    if (status === 'publish') {
      const validationErrors = this.validateForm()
      const errorKeys = Object.keys(validationErrors)
      if (errorKeys.length > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        const firstErrorKey = errorKeys[0]
        const firstErrorMsg = validationErrors[firstErrorKey]
        alert(`Validation Error: ${firstErrorMsg}`)
        return
      }
    }

    this.setState({ isSubmitting: true, errors: {} })

    const {
      title, duration, price, groupSize, description,
      selectedCategories, selectedDifficulty,
      destination, highlights, selectedImages, existingImages,
      days, agencyName, email, phone, packageId, whatsIncluded, packageFeatures,
    } = this.state

    const formData = new FormData()

    const cleanPrice = typeof price === 'string' ? price.replace(/[$,€£¥\s,]/g, '').trim() : String(price || '')
    const BasicInformation = {
      title,
      categories: selectedCategories,
      duration: duration,
      price: price ? Number(cleanPrice) : null,
      groupSize: groupSize,
      difficulty: selectedDifficulty,
      whatsIncluded,
      packageFeatures,
      description,
      promotionPrice: null,
      promotionExpiryDate: null,
    }

    const LocationAndHighlights = {
      destination,
      highlights
    }

    const DayByDayItinerary = days.map((d, i) => ({
      day: i + 1,
      title: d.title,
      description: d.description,
      activities: d.activities.filter(Boolean)
    }))

    const AgencyContactInformation = { agencyName, email, phone }

    formData.append('BasicInformation', JSON.stringify(BasicInformation))
    formData.append('LocationAndHighlights', JSON.stringify(LocationAndHighlights))
    formData.append('DayByDayItinerary', JSON.stringify(DayByDayItinerary))
    formData.append('AgencyContactInformation', JSON.stringify(AgencyContactInformation))
    formData.append('status', status)

    if (packageId && existingImages.length > 0) {
      formData.append('existingImages', JSON.stringify(existingImages))
    }
    selectedImages.forEach(file => formData.append('images', file))

    const isEdit = !!packageId
    const url = isEdit ? `http://localhost:5000/api/packages/${packageId}` : 'http://localhost:5000/api/packages'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, { method, body: formData })
      const data = await res.json()

      if (res.ok) {
        const savedPackage = data.data || null
        this.setState({
          packageId: savedPackage?._id || packageId,
          publishedPackage: savedPackage,
          isPublishedEdit: status === 'publish' && this.state.isPublishedEdit,
          showSuccess: status === 'publish',
          isSubmitting: false,
        })
        if (status !== 'publish') alert(data.message || 'Package saved as draft')
      } else {
        const backendErrors = {}
        if (data.errors) {
          Object.keys(data.errors).forEach(key => {
            backendErrors[key] = data.errors[key]
          })
        } else if (data.error) {
          backendErrors.general = data.error
        } else if (data.message) {
          backendErrors.general = data.message
        }
        this.setState({ errors: backendErrors, isSubmitting: false })
        alert('Error: ' + (data.error || data.message || 'Failed to save package'))
      }
    } catch (err) {
      this.setState({
        errors: { general: 'Failed to connect to server: ' + err.message },
        isSubmitting: false
      })
      alert('Failed to connect to server: ' + err.message)
    }
  }

  toggleCategoryMenu = () => {
    this.setState(prev => ({ isCategoryOpen: !prev.isCategoryOpen }))
  }

  handleCategoryToggle = (value) => {
    this.setState(prev => {
      const exists = prev.selectedCategories.includes(value)
      const selectedCategories = exists
        ? prev.selectedCategories.filter(item => item !== value)
        : [...prev.selectedCategories, value]
      return { selectedCategories }
    })
    this.clearError('selectedCategories')
  }

  toggleIncludedMenu = () => {
    this.setState(prev => ({ isIncludedOpen: !prev.isIncludedOpen }))
  }

  handleIncludedToggle = (value) => {
    this.setState(prev => {
      const exists = prev.whatsIncluded.includes(value)
      const whatsIncluded = exists
        ? prev.whatsIncluded.filter(item => item !== value)
        : [...prev.whatsIncluded, value]
      return { whatsIncluded }
    })
    this.clearError('whatsIncluded')
  }

  handleAddCustomInclusion = () => {
    const label = prompt('Enter custom inclusion:')
    if (!label || !label.trim()) return
    const value = label.toLowerCase().replace(/\s+/g, '_')
    this.setState(prev => ({
      whatsIncludedOptions: [...prev.whatsIncludedOptions, { value, label }],
      whatsIncluded: [...prev.whatsIncluded, value],
    }))
    this.clearError('whatsIncluded')
  }

  toggleFeaturesMenu = () => {
    this.setState(prev => ({ isFeaturesOpen: !prev.isFeaturesOpen }))
  }

  handleFeaturesToggle = (value) => {
    this.setState(prev => {
      const exists = prev.packageFeatures.includes(value)
      const packageFeatures = exists
        ? prev.packageFeatures.filter(item => item !== value)
        : [...prev.packageFeatures, value]
      return { packageFeatures }
    })
    this.clearError('packageFeatures')
  }

  handleAddCustomFeature = () => {
    const label = prompt('Enter custom feature:')
    if (!label || !label.trim()) return
    const value = label.toLowerCase().replace(/\s+/g, '_')
    this.setState(prev => ({
      packageFeaturesOptions: [...prev.packageFeaturesOptions, { value, label }],
      packageFeatures: [...prev.packageFeatures, value],
    }))
    this.clearError('packageFeatures')
  }

  getIncludedLabel = (value) => {
    const option = this.state.whatsIncludedOptions.find(opt => opt.value === value)
    return option ? option.label : value
  }

  getFeatureLabel = (value) => {
    const option = this.state.packageFeaturesOptions.find(opt => opt.value === value)
    return option ? option.label : value
  }

  renderContent() {
    const {
      selectedImages, existingImages, duration, days, activeDay, selectedCategories,
      isCategoryOpen, showSuccess, publishedPackage, loading,
      isPublishedEdit,
      whatsIncluded, isIncludedOpen, whatsIncludedOptions,
      packageFeatures, isFeaturesOpen, packageFeaturesOptions,
      errors, isSubmitting
    } = this.state

    if (loading) {
      return <div style={{ padding: '200px', textAlign: 'center', fontSize: '18px', color: '#6B7280' }}>Loading...</div>
    }

    if (showSuccess) {
      return <SucessPackage embedLayout packageData={publishedPackage} isEditing={this.state.isPublishedEdit} onEdit={() => this.setState({ showSuccess: false, loading: false })} />
    }

    const max = this.getMaxDays()
    const selectedCategoryLabels = this.categoryOptions
      .filter(option => selectedCategories.includes(option.value))
      .map(option => option.label)
      .join(', ')
    const selectedIncludedLabels = whatsIncludedOptions
      .filter(option => whatsIncluded.includes(option.value))
      .map(option => option.label)
      .join(', ')
    const selectedFeaturesLabels = packageFeaturesOptions
      .filter(option => packageFeatures.includes(option.value))
      .map(option => option.label)
      .join(', ')

    return (
      <main
        style={{
          flex: 1,
          minHeight: '320vh',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #A0DBFF 100%)',
          paddingTop: '180px',
          paddingBottom: '80px',
        }}
      >
        <div>
          <h1 style={{ margin: '12px 180px', fontSize: '38px', fontWeight: 700, color: '#111827' }}>
            {this.state.packageId ? 'Edit Package' : 'Add New Package'}
          </h1>
          <p style={{ margin: '0px 0px 70px 180px', color: '#6B7280', fontSize: '18px' }}>
            {this.state.packageId ? 'Update the travel package details' : 'Create a new travel package for your agency'}
          </p>
        </div>
        <div style={{ maxWidth: '1325px', margin: '0 auto', padding: '0 24px' }}>

          {/* BASIC INFORMATION */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '26px',
              border: '1px solid #F3D2D9',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
              position: 'relative',
              zIndex: 3,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '999px',
                  background: '#9CA3AF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                i
              </div>
              <h2 className="m-0 text-[23px] text-gray-900 font-bold">
                Basic Information
              </h2>
            </div>

            {/* Package Title */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Package Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Cultural Triangle Explorer"
                value={this.state.title}
                onChange={e => {
                  this.setState({ title: e.target.value })
                  this.clearError('title')
                }}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.title ? '#EF4444' : '#E5E7EB'}`,
                  padding: '0 12px',
                  fontSize: '16px',
                  color: '#111827',
                }}
                data-error="true"
              />
              {errors.title && (
                <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors.title}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px', marginBottom: '16px' }}>
              {/* Category */}
              <div ref={this.categoryMenuRef} style={{ position: 'relative', zIndex: isCategoryOpen ? 20 : 1 }}>
                <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Category *
                </label>
                <button
                  type="button"
                  onClick={this.toggleCategoryMenu}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.selectedCategories ? '#EF4444' : '#E5E7EB'}`,
                    padding: '0 12px',
                    fontSize: '16px',
                    color: selectedCategories.length > 0 ? '#111827' : '#6B7280',
                    background: '#FFFFFF',
                    textAlign: 'left',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={isCategoryOpen}
                  data-error="true"
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedCategories.length > 0 ? selectedCategoryLabels : 'Select categories'}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M6 9L12 15L18 9" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {errors.selectedCategories && (
                  <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                    {errors.selectedCategories}
                  </div>
                )}
                {isCategoryOpen && (
                  <div
                    role="listbox"
                    aria-label="Category options"
                    style={{
                      position: 'absolute',
                      top: '74px',
                      left: 0,
                      right: 0,
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '10px',
                      boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
                      padding: '8px 0',
                      maxHeight: '240px',
                      overflowY: 'auto',
                      zIndex: 50,
                    }}
                    onMouseDown={event => event.stopPropagation()}
                  >
                    {this.categoryOptions.map(option => (
                      <label
                        key={option.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '15px',
                          color: '#374151',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(option.value)}
                          onChange={() => this.handleCategoryToggle(option.value)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Duration */}
              <div>
                <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Duration *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 7 Days / 6 Nights"
                  value={duration}
                  onChange={e => {
                    const val = e.target.value
                    const match = val.match(/\d+/)
                    const max = match ? parseInt(match[0], 10) : null

                    let formattedDuration = val
                    if (max !== null && max > 0) {
                      formattedDuration = `${max} Days / ${max - 1} Nights`
                    } else if (val.trim() === '') {
                      formattedDuration = ''
                    }

                    this.setState(prev => ({
                      duration: formattedDuration,
                      days: max !== null && prev.days.length > max ? prev.days.slice(0, max) : prev.days,
                      activeDay: max !== null && prev.activeDay >= max ? Math.max(0, max - 1) : prev.activeDay,
                    }))
                    this.clearError('duration')
                  }}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.duration ? '#EF4444' : '#E5E7EB'}`,
                    padding: '0 12px',
                    fontSize: '16px',
                    color: '#111827',
                  }}
                  data-error="true"
                />
                {errors.duration && (
                  <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                    {errors.duration}
                  </div>
                )}
              </div>

              {/* Price */}
              <div>
                <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Price (USD) *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6B7280',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}>
                    $
                  </span>
                  <input
                    type="text"
                    placeholder="0.00"
                    value={this.state.price}
                    onChange={e => {
                      this.setState({ price: e.target.value })
                      this.clearError('price')
                    }}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '8px',
                      border: `1px solid ${errors.price ? '#EF4444' : '#E5E7EB'}`,
                      padding: '0 12px 0 28px',
                      fontSize: '16px',
                      color: '#111827',
                    }}
                    data-error="true"
                  />
                </div>
                {errors.price && (
                  <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                    {errors.price}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', marginBottom: '16px' }}>
              {/* Group Size */}
              <div>
                <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Group Size *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2-15 people"
                  value={this.state.groupSize}
                  onChange={e => {
                    this.setState({ groupSize: e.target.value })
                    this.clearError('groupSize')
                  }}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.groupSize ? '#EF4444' : '#E5E7EB'}`,
                    padding: '0 12px',
                    fontSize: '16px',
                    color: '#111827',
                  }}
                  data-error="true"
                />
                {errors.groupSize && (
                  <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                    {errors.groupSize}
                  </div>
                )}
              </div>

              {/* Difficulty Level */}
              <div>
                <label style={{ display: 'block', fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Difficulty Level
                </label>
                <select
                  value={this.state.selectedDifficulty}
                  onChange={(e) => {
                    this.setState({ selectedDifficulty: e.target.value })
                    this.clearError('selectedDifficulty')
                  }}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.selectedDifficulty ? '#EF4444' : '#E5E7EB'}`,
                    padding: '0 12px',
                    fontSize: '14px',
                    color: this.state.selectedDifficulty ? '#374151' : '#37383a',
                    background: '#FFFFFF',
                  }}
                  data-error="true"
                >
                  <option value="" hidden>Select difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="challenging">Challenging</option>
                  <option value="strenuous">Strenuous</option>
                  <option value="flexible">Flexible</option>
                </select>
                {errors.selectedDifficulty && (
                  <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                    {errors.selectedDifficulty}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', marginBottom: '18px' }}>
              {/* What's Included */}
              <div ref={this.includedMenuRef} style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  What's Included *
                </label>
                <button
                  type="button"
                  onClick={this.toggleIncludedMenu}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.whatsIncluded ? '#EF4444' : '#E5E7EB'}`,
                    padding: '0 12px',
                    fontSize: '16px',
                    color: whatsIncluded.length > 0 ? '#111827' : '#6B7280',
                    background: '#FFFFFF',
                    textAlign: 'left',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                  data-error="true"
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {whatsIncluded.length > 0 ? selectedIncludedLabels : 'Select inclusions'}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {errors.whatsIncluded && (
                  <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                    {errors.whatsIncluded}
                  </div>
                )}
                {isIncludedOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '74px',
                      left: 0,
                      right: 0,
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '10px',
                      boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
                      padding: '8px 0',
                      maxHeight: '240px',
                      overflowY: 'auto',
                      zIndex: 10,
                    }}
                    onMouseDown={event => event.stopPropagation()}
                  >
                    {whatsIncludedOptions.map(option => (
                      <label
                        key={option.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '15px',
                          color: '#374151',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={whatsIncluded.includes(option.value)}
                          onChange={() => this.handleIncludedToggle(option.value)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        {option.label}
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={this.handleAddCustomInclusion}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        marginTop: '4px',
                        borderTop: '1px solid #E5E7EB',
                        background: 'transparent',
                        border: 'none',
                        color: '#2563EB',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>+</span>
                      Add Custom
                    </button>
                  </div>
                )}
              </div>

              {/* Package Features */}
              <div ref={this.featuresMenuRef} style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Package Features (Policies & Benefits)
                </label>
                <button
                  type="button"
                  onClick={this.toggleFeaturesMenu}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.packageFeatures ? '#EF4444' : '#E5E7EB'}`,
                    padding: '0 12px',
                    fontSize: '16px',
                    color: packageFeatures.length > 0 ? '#111827' : '#6B7280',
                    background: '#FFFFFF',
                    textAlign: 'left',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                  data-error="true"
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {packageFeatures.length > 0 ? selectedFeaturesLabels : 'Select features'}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {errors.packageFeatures && (
                  <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                    {errors.packageFeatures}
                  </div>
                )}
                {isFeaturesOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '74px',
                      left: 0,
                      right: 0,
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '10px',
                      boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
                      padding: '8px 0',
                      maxHeight: '240px',
                      overflowY: 'auto',
                      zIndex: 10,
                    }}
                    onMouseDown={event => event.stopPropagation()}
                  >
                    {packageFeaturesOptions.map(option => (
                      <label
                        key={option.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '15px',
                          color: '#374151',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={packageFeatures.includes(option.value)}
                          onChange={() => this.handleFeaturesToggle(option.value)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        {option.label}
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={this.handleAddCustomFeature}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        marginTop: '4px',
                        borderTop: '1px solid #E5E7EB',
                        background: 'transparent',
                        border: 'none',
                        color: '#2563EB',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>+</span>
                      Add Custom
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Description *
              </label>
              <textarea
                placeholder="Detailed description of the package..."
                rows={4}
                value={this.state.description}
                onChange={e => {
                  this.setState({ description: e.target.value })
                  this.clearError('description')
                }}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: `1px solid ${errors.description ? '#EF4444' : '#E5E7EB'}`,
                  padding: '10px 12px',
                  fontSize: '16px',
                  color: '#111827',
                  resize: 'none',
                }}
                data-error="true"
              />
              {errors.description && (
                <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors.description}
                </div>
              )}
            </div>
          </div>

          {/* LOCATION & HIGHLIGHTS */}
          <div
            style={{
              marginTop: '40px',
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '26px',
              border: '1px solid #F3D2D9',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 3C8.13 3 5 6.13 5 10C5 15.25 12 21 12 21C12 21 19 15.25 19 10C19 6.13 15.87 3 12 3Z" stroke="#6B7280" strokeWidth="1.6" />
                  <circle cx="12" cy="10" r="2.5" stroke="#6B7280" strokeWidth="1.6" />
                </svg>
              </div>
              <h2 className="m-0 text-[23px] text-gray-900 font-bold">
                Location & Highlights
              </h2>
            </div>

            {/* Destination */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Destination *
              </label>
              <input
                type="text"
                placeholder="e.g., Kandy, Sigiriya, Ella"
                value={this.state.destination}
                onChange={e => {
                  this.setState({ destination: e.target.value })
                  this.clearError('destination')
                }}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.destination ? '#EF4444' : '#E5E7EB'}`,
                  padding: '0 12px',
                  fontSize: '16px',
                  color: '#111827',
                }}
                data-error="true"
              />
              {errors.destination && (
                <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors.destination}
                </div>
              )}
            </div>

            {/* Package Highlights */}
            <div style={{ marginBottom: '8px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Package Highlights *
              </label>
              <textarea
                rows={4}
                placeholder={'• Visit Sigiriya Rock Fortress\n• Explore ancient temples\n• Scenic train journey'}
                value={this.state.highlights}
                onChange={e => {
                  const lines = e.target.value.split('\n')
                  if (lines.length <= 11) {
                    this.setState({ highlights: e.target.value })
                    this.clearError('highlights')
                  }
                }}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: `1px solid ${errors.highlights ? '#EF4444' : '#E5E7EB'}`,
                  padding: '18px 12px',
                  fontSize: '16px',
                  color: '#6B7280',
                  resize: 'none',
                }}
                data-error="true"
              />
              {errors.highlights && (
                <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors.highlights}
                </div>
              )}
              <div style={{ marginTop: '6px', fontSize: '14px', color: '#9CA3AF' }}>
                Enter each highlight on a new line (max 12)
              </div>
            </div>

            {/* Upload Image */}
            <div style={{ marginTop: '14px' }}>
              <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
                Upload Image *
              </label>
              {(selectedImages.length > 0 || existingImages.length > 0) ? (
                <div
                  style={{
                    border: `2px dashed ${errors.selectedImages ? '#EF4444' : '#B8C1CC'}`,
                    borderRadius: '16px',
                    padding: '20px',
                    background: '#F9FAFB',
                  }}
                  data-error="true"
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                    {/* Existing Images Previews */}
                    {existingImages.map((imgUrl, idx) => (
                      <div
                        key={`existing-${idx}`}
                        style={{
                          width: '110px',
                          height: '110px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          position: 'relative',
                          border: '1px solid #E5E7EB',
                          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
                          background: '#FFFFFF',
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={`Existing package image ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => this.handleRemoveExistingImage(idx)}
                          title="Remove image"
                          style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            background: 'rgba(15, 23, 42, 0.7)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* New Selected Images Previews */}
                    {selectedImages.map((file, idx) => (
                      <div
                        key={`new-${file.name}-${idx}`}
                        style={{
                          width: '110px',
                          height: '110px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          position: 'relative',
                          border: '1px solid #E5E7EB',
                          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
                          background: '#FFFFFF',
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => this.handleRemoveSelectedImage(idx)}
                          title="Remove image"
                          style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            background: 'rgba(15, 23, 42, 0.7)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* Add Image Box (+) */}
                    {(selectedImages.length + existingImages.length) < 50 && (
                      <label
                        htmlFor="package-images-add"
                        style={{
                          width: '110px',
                          height: '110px',
                          borderRadius: '12px',
                          border: '2px dashed #2563EB',
                          background: '#EFF6FF',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#DBEAFE' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#EFF6FF' }}
                      >
                        <input
                          id="package-images-add"
                          type="file"
                          accept="image/png, image/jpeg"
                          multiple
                          onChange={this.handleImageAdd}
                          style={{ display: 'none' }}
                        />
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#2563EB',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            marginBottom: '4px',
                          }}
                        >
                          +
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB' }}>Add Image</span>
                      </label>
                    )}
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="package-images-initial"
                  style={{
                    border: `2px dashed ${errors.selectedImages ? '#EF4444' : '#B8C1CC'}`,
                    borderRadius: '16px',
                    padding: '32px',
                    textAlign: 'center',
                    background: '#F9FAFB',
                    color: '#6B7280',
                    cursor: 'pointer',
                    display: 'block',
                  }}
                  data-error="true"
                >
                  <input
                    id="package-images-initial"
                    type="file"
                    accept="image/png, image/jpeg"
                    multiple
                    onChange={this.handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <svg width="38" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M7 18C4.79 18 3 16.21 3 14C3 11.93 4.57 10.22 6.6 10.02C7.29 7.72 9.43 6 12 6C14.97 6 17.4 8.43 17.4 11.4V11.6H18C20.21 11.6 22 13.39 22 15.6C22 17.81 20.21 19.6 18 19.6H7" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 12V17" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M10 14L12 12L14 14" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div style={{ fontSize: '15px', color: '#374151' }}>Click to upload</div>
                  <div style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '4px' }}>You can upload a maximum of 50 images.</div>
                  <div style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '2px' }}>PNG, JPG up to 5MB each</div>
                </label>
              )}
              <div style={{ marginTop: '6px', fontSize: '14px', color: '#9CA3AF' }}>
                You can upload a maximum of 50 images.
              </div>
              {errors.selectedImages && (
                <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors.selectedImages}
                </div>
              )}
            </div>
          </div>

          {/* DAY-BY-DAY ITINERARY */}
          <div
            style={{
              marginTop: '40px',
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '26px',
              border: '1px solid #F3D2D9',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="17" rx="2" stroke="#6B7280" strokeWidth="1.6" />
                    <path d="M8 3V6" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M16 3V6" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M3 9H21" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 className="m-0 text-[23px] text-gray-900 font-bold">Day-by-Day Itinerary *</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '4px 8px' }}>
                  {days.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => this.setState({ activeDay: i })}
                      style={{
                        width: '28px', height: '28px', borderRadius: '6px', border: 'none',
                        background: activeDay === i ? '#2563EB' : 'transparent',
                        color: activeDay === i ? '#FFFFFF' : '#6B7280',
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={this.handleAddDay}
                  disabled={max !== null && days.length >= max}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '8px 14px', borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    background: max !== null && days.length >= max ? '#F3F4F6' : '#FFFFFF',
                    color: max !== null && days.length >= max ? '#9CA3AF' : '#6B7280',
                    fontSize: '16px', fontWeight: 600, cursor: max !== null && days.length >= max ? 'not-allowed' : 'pointer',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>+</span>
                  Add Day
                </button>
              </div>
            </div>

            {errors.days && (
              <div style={{ color: '#EF4444', fontSize: '14px', marginBottom: '16px', padding: '8px 12px', background: '#FEE2E2', borderRadius: '8px' }}>
                {errors.days}
              </div>
            )}

            {days.map((day, dayIndex) => dayIndex !== activeDay ? null : (
              <div
                key={dayIndex}
                style={{ border: `1px solid ${errors[`day_${dayIndex}_title`] || errors[`day_${dayIndex}_description`] || errors[`day_${dayIndex}_activities`] ? '#EF4444' : '#F3A0C6'}`, borderRadius: '12px', padding: '24px' }}
              >
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '18px' }}>Day {dayIndex + 1}</div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Day Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Arrival in Colombo"
                    value={day.title}
                    onChange={e => {
                      this.handleDayField(dayIndex, 'title', e.target.value)
                      this.clearError(`day_${dayIndex}_title`)
                      this.clearError('days')
                    }}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '8px',
                      border: `1px solid ${errors[`day_${dayIndex}_title`] ? '#EF4444' : '#E5E7EB'}`,
                      padding: '0 12px',
                      fontSize: '16px',
                      color: '#111827',
                    }}
                    data-error="true"
                  />
                  {errors[`day_${dayIndex}_title`] && (
                    <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                      {errors[`day_${dayIndex}_title`]}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Description *</label>
                  <textarea
                    placeholder="Describe What Happens On This Day......."
                    rows={3}
                    value={day.description}
                    onChange={e => {
                      this.handleDayField(dayIndex, 'description', e.target.value)
                      this.clearError(`day_${dayIndex}_description`)
                      this.clearError('days')
                    }}
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      border: `1px solid ${errors[`day_${dayIndex}_description`] ? '#EF4444' : '#E5E7EB'}`,
                      padding: '10px 12px',
                      fontSize: '16px',
                      color: '#111827',
                      resize: 'none',
                    }}
                    data-error="true"
                  />
                  {errors[`day_${dayIndex}_description`] && (
                    <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                      {errors[`day_${dayIndex}_description`]}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151' }}>Activities *</label>
                  <button
                    type="button"
                    onClick={() => {
                      this.handleAddActivity(dayIndex)
                      this.clearError(`day_${dayIndex}_activities`)
                      this.clearError('days')
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      background: '#FFFFFF',
                      color: '#6B7280',
                      fontSize: '15px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>+</span>
                    Add Activity
                  </button>
                </div>

                {errors[`day_${dayIndex}_activities`] && (
                  <div style={{ color: '#EF4444', fontSize: '14px', marginBottom: '10px' }}>
                    {errors[`day_${dayIndex}_activities`]}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', rowGap: '10px' }}>
                  {day.activities.map((value, actIndex) => (
                    <React.Fragment key={actIndex}>
                      <input
                        type="text"
                        placeholder="Activity description"
                        value={value}
                        onChange={e => {
                          this.handleActivityChange(dayIndex, actIndex, e.target.value)
                          this.clearError(`day_${dayIndex}_activities`)
                          this.clearError('days')
                        }}
                        style={{
                          width: '100%',
                          height: '38px',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB',
                          padding: '0 12px',
                          fontSize: '15px',
                          color: '#6B7280',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => this.handleRemoveActivity(dayIndex, actIndex)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                        }}
                        aria-label="Remove activity"
                      >
                        <svg width="18" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M4 7H20" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
                          <path d="M10 11V17" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
                          <path d="M14 11V17" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
                          <path d="M6 7L7 20H17L18 7" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 7V4H15V7" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* AGENCY CONTACT INFORMATION */}
          <div
            style={{
              marginTop: '40px',
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '26px',
              border: '1px solid #F3D2D9',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '999px',
                  background: '#6B7280',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                i
              </div>
              <h2 className="m-0 text-[23px] text-gray-900 font-bold">
                Agency Contact Information
              </h2>
            </div>

            {/* Agency Name */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Agency Name *
              </label>
              <input
                type="text"
                placeholder="Your Travel Agency"
                value={this.state.agencyName}
                onChange={e => {
                  this.setState({ agencyName: e.target.value })
                  this.clearError('agencyName')
                }}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.agencyName ? '#EF4444' : '#E5E7EB'}`,
                  padding: '0 12px',
                  fontSize: '16px',
                  color: '#111827',
                }}
                data-error="true"
              />
              {errors.agencyName && (
                <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors.agencyName}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
              {/* Contact Email */}
              <div>
                <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Contact Email *
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={this.state.email}
                  onChange={e => {
                    this.setState({ email: e.target.value })
                    this.clearError('email')
                  }}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.email ? '#EF4444' : '#E5E7EB'}`,
                    padding: '0 12px',
                    fontSize: '16px',
                    color: '#111827',
                  }}
                  data-error="true"
                />
                {errors.email && (
                  <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Contact Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Contact Phone *
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '40px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.phone ? '#EF4444' : '#E5E7EB'}`,
                    padding: '0 12px',
                    background: '#FFFFFF',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.42 14.94C17.5 15.3 18.67 15.5 19.9 15.5C20.45 15.5 20.9 15.95 20.9 16.5V20.4C20.9 20.95 20.45 21.4 19.9 21.4C10.44 21.4 2.6 13.56 2.6 4.1C2.6 3.55 3.05 3.1 3.6 3.1H7.5C8.05 3.1 8.5 3.55 8.5 4.1C8.5 5.33 8.7 6.5 9.06 7.58C9.17 7.92 9.08 8.32 8.81 8.59L6.62 10.79Z" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    type="tel"
                    placeholder="+94 11 234 5678"
                    value={this.state.phone}
                    onChange={e => {
                      this.setState({ phone: e.target.value })
                      this.clearError('phone')
                    }}
                    style={{
                      width: '100%',
                      border: 0,
                      outline: 'none',
                      fontSize: '16px',
                      color: '#111827',
                      background: 'transparent',
                    }}
                    data-error="true"
                  />
                </div>
                {errors.phone && (
                  <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                    {errors.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ marginTop: '70px', display: 'flex', justifyContent: 'flex-end', gap: '40px' }}>
            <button
              type="button"
              onClick={() => this.handleSubmit('draft')}
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 22px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                color: '#111827',
                fontSize: '15px',
                fontWeight: 600,
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.12)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M4 7H20" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M7 4V10" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M17 4V10" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" />
                <rect x="4" y="6" width="16" height="14" rx="2" stroke="#6B7280" strokeWidth="1.6" />
              </svg>
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </button>

            <button
              type="button"
              onClick={() => this.props.navigate('/packages/admin')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 40px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                color: '#111827',
                fontSize: '15px',
                fontWeight: 600,
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.12)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => this.handleSubmit('publish')}
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 22px',
                borderRadius: '8px',
                border: '1px solid #2563EB',
                background: '#2563EB',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 600,
                boxShadow: '0 3px 8px rgba(37, 99, 235, 0.35)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M4 7H20" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M7 4V10" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M17 4V10" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
                <rect x="4" y="6" width="16" height="14" rx="2" stroke="#FFFFFF" strokeWidth="1.6" />
                <path d="M9 14H15" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {isSubmitting ? (isPublishedEdit ? 'Updating...' : 'Publishing...') : (isPublishedEdit ? 'Edit Package' : 'Publish Package')}
            </button>
          </div>
        </div>
      </main>
    )
  }

  render() {
    const { embedLayout = false } = this.props

    if (embedLayout) {
      return this.renderContent()
    }

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #FFFFFF 0%, #A0DBFF 100%)' }}>
        <Header />
        {this.renderContent()}
        <Footer />
      </div>
    )
  }
}

export default function AddNewPackage(props) {
  const params = useParams()
  const navigate = useNavigate()
  return <AddNewPackageClass {...props} params={params} navigate={navigate} />
}