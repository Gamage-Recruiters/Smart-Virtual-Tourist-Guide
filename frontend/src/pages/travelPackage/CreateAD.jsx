import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/travelPackage/Header.jsx'
import Footer from '../../components/travelPackage/Footer.jsx'
import New from '../../assets/travelPackage/New.png'

const MAX_AD_IMAGES = 10

export default function SucessPackages({ embedLayout = false }) {
	const navigate = useNavigate()
	const [titleQuery, setTitleQuery] = React.useState('')
	const [packageSuggestions, setPackageSuggestions] = React.useState([])
	const [isSuggestionsOpen, setIsSuggestionsOpen] = React.useState(false)
	const [selectedPackage, setSelectedPackage] = React.useState(null)
	const [budget, setBudget] = React.useState('')
	const [description, setDescription] = React.useState('')
	const [type, setType] = React.useState('Banner Ad')
	const [startDate, setStartDate] = React.useState('')
	const [endDate, setEndDate] = React.useState('')
	const [discountPercent, setDiscountPercent] = React.useState(0)
	const [selectedImages, setSelectedImages] = React.useState([])
	const [loading, setLoading] = React.useState(false)
	const fileInputRef = React.useRef(null)
	const searchTimeoutRef = React.useRef(null)

	React.useEffect(() => {
		const query = titleQuery.trim()

		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current)
		}

		if (!query) {
			setPackageSuggestions([])
			setIsSuggestionsOpen(false)
			return undefined
		}

		searchTimeoutRef.current = setTimeout(async () => {
			try {
				const response = await fetch(`http://localhost:5000/api/packages/search?title=${encodeURIComponent(query)}`)
				const data = await response.json()
				console.log('Search API response:', data)
				console.log('All packages:', data.data)
				const publishedPackages = (data.data || []).filter(pkg => {
					console.log('Package:', pkg.title, 'Status:', pkg.status)
					return pkg.status === 'publish'
				})
				console.log('Published packages:', publishedPackages)
				setPackageSuggestions(publishedPackages)
				setIsSuggestionsOpen(publishedPackages.length > 0)
			} catch (error) {
				console.error('Search error:', error)
				setPackageSuggestions([])
				setIsSuggestionsOpen(false)
			}
		}, 250)

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current)
			}
		}
	}, [titleQuery])

	const handlePackageSelect = (packageItem) => {
		setSelectedPackage(packageItem)
		setPackageSuggestions([])
		setIsSuggestionsOpen(false)
		setBudget('')
		setDiscountPercent(0)
	}

	const handleBudgetChange = (value) => {
		setBudget(value)
		if (selectedPackage && selectedPackage.price && value) {
			const originalPrice = Number(selectedPackage.price)
			const newPrice = Number(value.replace(/[^0-9.-]/g, ''))
			if (!isNaN(originalPrice) && !isNaN(newPrice) && originalPrice > 0) {
				const percent = ((newPrice - originalPrice) / originalPrice) * 100
				setDiscountPercent(percent)
			}
		}
	}

	const handlePercentChange = (newPercent) => {
		setDiscountPercent(newPercent)
		if (selectedPackage && selectedPackage.price) {
			const originalPrice = Number(selectedPackage.price)
			if (!isNaN(originalPrice) && originalPrice > 0) {
				const newPrice = originalPrice * (1 - newPercent / 100)
				setBudget(newPrice.toFixed(2))
			}
		}
	}

	const calculateDiscount = () => {
		if (!selectedPackage || !selectedPackage.price || !budget) {
			return null
		}
		const originalPrice = Number(selectedPackage.price)
		const newPrice = Number(budget.toString().replace(/[^0-9.-]/g, ''))
		if (isNaN(originalPrice) || isNaN(newPrice) || originalPrice <= 0) {
			return null
		}
		const difference = originalPrice - newPrice
		const percent = (difference / originalPrice) * 100
		return {
			percent: Math.abs(percent).toFixed(2),
			amount: Math.abs(difference).toFixed(2),
			isDiscount: difference > 0
		}
	}

	const handleImageChange = (event) => {
		const files = Array.from(event.target.files || [])
		const availableSlots = MAX_AD_IMAGES - selectedImages.length
		if (files.length > availableSlots) {
			alert(`You can select a maximum of ${MAX_AD_IMAGES} images`)
		}
		setSelectedImages((images) => [...images, ...files.slice(0, availableSlots)])
		event.target.value = ''
	}

	const handleRemoveImage = (index) => {
		setSelectedImages((images) => images.filter((_, imageIndex) => imageIndex !== index))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		
		if (!titleQuery.trim()) {
			alert('Please enter an advertisement title')
			return
		}
		
		if (!description.trim()) {
			alert('Please enter a description')
			return
		}
		
		if (!budget || !startDate || !endDate) {
			alert('Please fill in budget, start date, and end date')
			return
		}
		
		try {
			setLoading(true)
			const formData = new FormData()
			
			// Add form data
			formData.append('title', titleQuery.trim())
			formData.append('description', description.trim())
			formData.append('type', type)
			formData.append('budget', budget)
			formData.append('startDate', startDate)
			formData.append('endDate', endDate)
			if (selectedPackage) {
				formData.append('packageId', selectedPackage._id)
			}
			
			console.log('Sending advertisement data:', {
				title: titleQuery.trim(),
				description: description.trim(),
				type,
				budget,
				startDate,
				endDate,
				packageId: selectedPackage?._id
			})
			
			selectedImages.forEach((file) => formData.append('images', file))
			
			const response = await fetch('http://localhost:5000/api/advertisements', {
				method: 'POST',
				body: formData
			})
			
			const data = await response.json()
			
			if (response.ok) {
				alert('Advertisement created successfully! Package promotion has been updated.')
				// Reset form
				setTitleQuery('')
				setSelectedPackage(null)
				setDescription('')
				setBudget('')
				setStartDate('')
				setEndDate('')
				setDiscountPercent(0)
				setSelectedImages([])
				if (fileInputRef.current) fileInputRef.current.value = ''
			} else {
				console.error('Server error:', data)
				alert('Error: ' + data.error)
			}
		} catch (error) {
			console.error('Request failed:', error)
			alert('Failed to create advertisement: ' + error.message)
		} finally {
			setLoading(false)
		}
	}

	const formatPrice = (value) => {
		if (value === null || value === undefined || value === '') return 'Price unavailable'
		const numericValue = Number(value)
		return Number.isNaN(numericValue) ? String(value) : `$${numericValue.toFixed(2)}`
	}

	const formatSuggestionLine = (packageItem) => `Title: ${packageItem.title || 'Unavailable'} — Duration: ${packageItem.duration || 'Unavailable'} — Price: ${formatPrice(packageItem.price)} — Group Size: ${packageItem.groupSize || 'Unavailable'}`

	const calculatePercentageDifference = (originalPrice, promotionPriceStr) => {
		// Parse the original price
		const original = Number(originalPrice)
		if (Number.isNaN(original)) {
			return 'Original price is not a valid number'
		}
		if (original <= 0) {
			return 'Original price must be greater than 0'
		}
		
		// Parse the promotion price (remove any currency symbols)
		const promotionPriceClean = promotionPriceStr.replace(/[^0-9.-]/g, '')
		const promotion = Number(promotionPriceClean)
		if (Number.isNaN(promotion)) {
			return 'Enter a valid number for promotion price'
		}
		if (promotion < 0) {
			return 'Promotion price cannot be negative'
		}
		
		// Calculate percentage difference
		const difference = promotion - original
		const percentage = (difference / original) * 100
		
		// Format the result
		if (percentage > 0) {
			return `Increase: +${percentage.toFixed(2)}% ($${difference.toFixed(2)})`
		} else if (percentage < 0) {
			return `Discount: ${percentage.toFixed(2)}% (-$${Math.abs(difference).toFixed(2)})`
		} else {
			return 'No change (0%)'
		}
	}

	const main = (
		<main
			style={{
				minHeight: '100vh',
				background: 'linear-gradient(180deg, #FFFFFF 0%, #EAF6FF 100%)',
				paddingTop: 120,
				paddingBottom: 80,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'flex-start',
				fontFamily: "'Inter', sans-serif",
			}}
		>
			<div style={{ width: '920px', maxWidth: '95%', padding: '54px 28px' }}>
				<div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <img
                        src={New}
                        alt="new"
                        style={{
                        width: 56,
                        height: 56,
                        marginBottom: 12,
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        }}
                    />
					<h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#0F172A' }}>Create New Advertisement</h1>
					<p style={{ margin: '12px 0 0', fontSize: 16, color: '#64748B' }}>Set up a new promotional campaign for your travel packages</p>
				</div>

				<div
					style={{
						background: '#FFFFFF',
						borderRadius: 14,
						padding: 32,
						boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
						border: '1px solid rgba(2,6,23,0.04)',
						filter: 'grayscale(0.02) contrast(0.98)',
					}}
				>
					<form>
						<div style={{ marginBottom: 22 }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: '#334155', marginBottom: 10 }}>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<rect x="3" y="3" width="18" height="18" rx="2" stroke="#334155" strokeWidth="1.5"/>
									<path d="M8 9L16 9" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
									<path d="M8 12L12 12" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
									<path d="M8 15L14 15" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
								</svg>
								Advertisement Title
							</div>
							<input
								placeholder="Advertisement title"
								aria-label="Advertisement Title"
								value={titleQuery}
								onChange={(event) => setTitleQuery(event.target.value)}
								onFocus={() => {
									if (packageSuggestions.length > 0) {
										setIsSuggestionsOpen(true)
									}
								}}
								onBlur={() => {
									window.setTimeout(() => setIsSuggestionsOpen(false), 150)
								}}
								style={{ width: '100%', height: 52, borderRadius: 10, border: '1px solid #E6EEF8', padding: '0 16px', fontSize: 16 }}
							/>
							{isSuggestionsOpen && packageSuggestions.length > 0 && (
								<div style={{ marginTop: 10, border: '1px solid #D9E6F5', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 14px 30px rgba(15, 23, 42, 0.12)', overflow: 'hidden' }}>
									{packageSuggestions.sort((a, b) => new Date(b.createdAt || b._id || 0) - new Date(a.createdAt || a._id || 0)).map((packageItem) => (
										<button
											key={packageItem._id}
											type="button"
											onMouseDown={(event) => event.preventDefault()}
											onClick={() => handlePackageSelect(packageItem)}
											style={{
												width: '100%',
												textAlign: 'left',
												padding: '12px 16px',
												border: 'none',
												background: '#FFFFFF',
												cursor: 'pointer',
												borderBottom: '1px solid #EEF2F7',
												whiteSpace: 'nowrap',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
											}}
										>
											<div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
												{formatSuggestionLine(packageItem)}
											</div>
										</button>
									))}
								</div>
							)}
							{selectedPackage && (
									<div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #D9E6F5', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.7 }}>
										<div style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
											{formatSuggestionLine(selectedPackage)}
										</div>
								</div>
							)}
						</div>

						<div style={{ marginBottom: 22 }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: '#334155', marginBottom: 10 }}>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<path d="M8 7H16V9H8V7Z" fill="#334155"/>
									<path d="M8 11H16V13H8V11Z" fill="#334155"/>
									<path d="M8 15H12V17H8V15Z" fill="#334155"/>
									<rect x="4" y="4" width="16" height="16" rx="2" stroke="#334155" strokeWidth="1.5"/>
								</svg>
								Description
							</div>
							<textarea 
							placeholder="Describe your promotional offer..." 
							aria-label="Description" 
							rows={4} 
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							style={{ width: '100%', borderRadius: 10, border: '1px solid #E6EEF8', padding: 14, fontSize: 16, resize: 'vertical' }} 
						/>
						</div>

						<div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 18, alignItems: 'center', marginBottom: 22 }}>
							<div>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: '#334155', marginBottom: 10 }}>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<path d="M12 7L8 11L12 15" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										<path d="M16 11H8" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
										<rect x="3" y="5" width="18" height="14" rx="2" stroke="#334155" strokeWidth="1.5"/>
									</svg>
									Advertisement Type
								</div>
								<select aria-label="Advertisement Type" style={{ width: '100%', height: 48, borderRadius: 10, border: '1px solid #E6EEF8', padding: '0 14px', fontSize: 16 }}>
									<option value="">Banner Ad</option>
								</select>
							</div>

							<div>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: '#334155', marginBottom: 10 }}>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<circle cx="12" cy="12" r="9" stroke="#334155" strokeWidth="1.5"/>
										<path d="M12 7L12 17" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
										<path d="M9 12L15 12" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
									</svg>
									Budget
								</div>
								<input 
									placeholder="$500" 
									aria-label="Budget" 
									value={budget}
									onChange={(e) => handleBudgetChange(e.target.value)}
									style={{ width: '100%', height: 48, borderRadius: 10, border: '1px solid #E6EEF8', padding: '0 14px', fontSize: 16 }} 
								/>
								{(() => {
									const discount = calculateDiscount()
									return discount ? (
										<div style={{ marginTop: 8, fontSize: 14, color: discount.isDiscount ? '#10B981' : '#EF4444', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
											<span>Discount: {discount.isDiscount ? '-' : '+'}</span>
											<div style={{ position: 'relative', display: 'inline-block' }}>
												<input
													type="number"
													value={Math.abs(discountPercent).toFixed(1)}
													onChange={(e) => handlePercentChange(Number(e.target.value))}
													style={{ width: 72, height: 28, border: '1px solid #D1D5DB', borderRadius: 5, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#374151', background: '#FFFFFF', paddingRight: 18, paddingRight: 2, direction: 'ltr' }}
												/>
												<span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#6B7280', pointerEvents: 'none' }}>%</span>
											</div>
											<span>({discount.isDiscount ? '-' : '+'}${discount.amount})</span>
										</div>
									) : null
								})()}
							</div>
						</div>

						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
							<div>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: '#334155', marginBottom: 10 }}>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<rect x="3" y="5" width="18" height="15" rx="2" stroke="#334155" strokeWidth="1.5"/>
										<path d="M8 3V7" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
										<path d="M16 3V7" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
										<path d="M3 11H21" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
									</svg>
									Start Date
								</div>
								<input 
									type="date" 
									aria-label="Start Date" 
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									style={{ width: '100%', height: 48, borderRadius: 10, border: '1px solid #E6EEF8', padding: '0 14px', fontSize: 16 }} 
								/>
							</div>
							<div>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: '#334155', marginBottom: 10 }}>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<rect x="3" y="5" width="18" height="15" rx="2" stroke="#334155" strokeWidth="1.5"/>
										<path d="M8 3V7" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
										<path d="M16 3V7" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
										<path d="M3 11H21" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
									</svg>
									End Date
								</div>
								<input 
									type="date" 
									aria-label="End Date" 
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									style={{ width: '100%', height: 48, borderRadius: 10, border: '1px solid #E6EEF8', padding: '0 14px', fontSize: 16 }} 
								/>
							</div>
						</div>

						<div style={{ marginBottom: 24 }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: '#334155', marginBottom: 10 }}>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<rect x="3" y="5" width="18" height="14" rx="2" stroke="#334155" strokeWidth="1.5"/>
									<circle cx="9" cy="10" r="2" stroke="#334155" strokeWidth="1.5"/>
									<path d="M5 19L9 15L14 20L19 15L21 17" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
								Upload Advertisement Image
							</div>
							<label
								htmlFor="ad-image"
								style={{
									width: '100%',
									minHeight: '150px',
									border: '2px dashed #B8C1CC',
									borderRadius: '16px',
									padding: '20px',
									background: '#F9FAFB',
									color: '#6B7280',
									cursor: 'pointer',
									display: 'block',
									transition: 'all 0.2s ease',
								}}
								onMouseEnter={(event) => { event.currentTarget.style.background = '#F1F5F9' }}
								onMouseLeave={(event) => { event.currentTarget.style.background = '#F9FAFB' }}
							>
								<input
									ref={fileInputRef}
									id="ad-image"
									type="file"
									accept="image/png, image/jpeg, image/gif"
									multiple
									onChange={handleImageChange}
									style={{ display: 'none' }}
								/>
								{selectedImages.length > 0 ? (
									<div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', textAlign: 'left' }}>
										{selectedImages.map((file, index) => (
											<div key={`${file.name}-${index}`} style={{ width: '110px', height: '110px', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid #E5E7EB', background: '#FFFFFF' }}>
												<img src={URL.createObjectURL(file)} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
												<button
													type="button"
													onClick={(event) => { event.stopPropagation(); handleRemoveImage(index) }}
													aria-label={`Remove ${file.name}`}
													style={{ position: 'absolute', top: '6px', right: '6px', width: '24px', height: '24px', border: 'none', borderRadius: '50%', background: 'rgba(15, 23, 42, 0.75)', color: '#FFFFFF', cursor: 'pointer', fontWeight: 700 }}
												>
													✕
												</button>
											</div>
										))}
										{selectedImages.length < MAX_AD_IMAGES && (
											<div
												role="button"
												tabIndex={0}
												aria-label="Add another advertisement image"
												onClick={(event) => {
													event.preventDefault()
													event.stopPropagation()
													fileInputRef.current?.click()
												}}
												onKeyDown={(event) => {
													if (event.key === 'Enter' || event.key === ' ') {
														event.preventDefault()
														fileInputRef.current?.click()
													}
												}}
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
												}}
											>
												<div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
													+
												</div>
												<span style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB' }}>Add Image</span>
											</div>
										)}
									</div>
								) : (
									<>
										<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
											<svg width="38" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
												<path d="M7 18C4.79 18 3 16.21 3 14C3 11.93 4.57 10.22 6.6 10.02C7.29 7.72 9.43 6 12 6C14.97 6 17.4 8.43 17.4 11.4V11.6H18C20.21 11.6 22 13.39 22 15.6C22 17.81 20.21 19.6 18 19.6H7" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												<path d="M12 12V17" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
												<path d="M10 14L12 12L14 14" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
											</svg>
										</div>
										<div style={{ color: '#0F172A', fontWeight: 600, fontSize: 16, marginTop: 4 }}>Click to upload</div>
										<div style={{ color: '#9CA3AF', fontSize: 14, marginTop: 8 }}>PNG, JPG, GIF up to 10MB each (maximum 10 images)</div>
									</>
								)}
							</label>
						</div>
								<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '56px', gap: '68px' }}>
                                <button
                                    type="button"
									onClick={() => navigate('/packages/admin')}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#F1F5F9'
                                        e.currentTarget.style.borderColor = '#CBD5E1'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#FFFFFF'
                                        e.currentTarget.style.borderColor = '#E6EEF8'
                                    }}
                                    style={{
									padding: '14px 26px',
                                    borderRadius: 999,
                                    border: '1px solid #E6EEF8',
                                    background: '#FFFFFF',
                                    color: '#0F172A',
									fontSize: 15,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(180deg,#0A65D1 0%,#1578EB 100%)'
                                        e.currentTarget.style.transform = 'translateY(-1px)'
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(11, 114, 232, 0.3)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(180deg,#0B72E8 0%,#1A86FF 100%)'
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                    style={{
									padding: '14px 26px',
                                    borderRadius: 999,
                                    border: '0',
                                    background: 'linear-gradient(180deg,#0B72E8 0%,#1A86FF 100%)',
                                    color: '#FFFFFF',
									fontSize: 15,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    }}
                                >
                                    Create Advertisement
                                </button>
                                </div>

					</form>
				</div>
			</div>
		</main>
	)

	if (embedLayout) return main

	return (
		<div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #FFFFFF 0%, #EAF6FF 100%)' }}>
			<Header />
			{main}
			<Footer />
		</div>
	)
}
