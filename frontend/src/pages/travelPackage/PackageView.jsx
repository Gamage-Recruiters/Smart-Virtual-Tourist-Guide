import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/travelPackage/Header.jsx'
import Footer from '../../components/travelPackage/Footer.jsx'


function PackageViewContent({ embedLayout = false, packageData = null, expandedDays = {}, toggleDay = () => {}, navigate }) {
	const [showDifficultyTooltip, setShowDifficultyTooltip] = React.useState(false)
	const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

	const packageTitle = packageData?.BasicInformation?.title || 'Package title unavailable'
	const rawImages = packageData?.LocationAndHighlights?.images
	const imagesList = Array.isArray(rawImages) ? rawImages.filter(Boolean) : (rawImages ? [rawImages] : [])
	const activeHeroImage = imagesList[currentImageIndex] || imagesList[0] || null

	React.useEffect(() => {
		if (imagesList.length < 2) return undefined

		const slideshowTimer = window.setInterval(() => {
			setCurrentImageIndex((prev) => (prev + 1) % imagesList.length)
		}, 4000)

		return () => window.clearInterval(slideshowTimer)
	}, [imagesList.length])

	const handlePrevImage = (e) => {
		e.stopPropagation()
		setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length)
	}

	const handleNextImage = (e) => {
		e.stopPropagation()
		setCurrentImageIndex((prev) => (prev + 1) % imagesList.length)
	}
	const packageDuration = packageData?.BasicInformation?.duration || 'Days unavailable'
	const packageGroupSize = packageData?.BasicInformation?.groupSize || 'count unavailable'
	const packageDifficulty = packageData?.BasicInformation?.difficulty
	const packagePrice = typeof packageData?.BasicInformation?.price === 'number'
		? `$${packageData.BasicInformation.price.toFixed(2)}`
		: 'Price unavailable'
	const price = packageData?.BasicInformation?.price
	const promotionPrice = packageData?.BasicInformation?.promotionPrice
	const savings = (typeof price === 'number' && typeof promotionPrice === 'number') 
		? price - promotionPrice 
		: 0
	const packageDescription = packageData?.BasicInformation?.description || 'No description was returned for this package.'
	const packageWhatsIncluded = packageData?.BasicInformation?.whatsIncluded || []
	const packageFeatures = packageData?.BasicInformation?.packageFeatures || []
	const packageItinerary = packageData?.DayByDayItinerary || []
	const agencyName = packageData?.AgencyContactInformation?.agencyName || 'Travel Agency'
	const agencyPhone = packageData?.AgencyContactInformation?.phone || 'Not available'
	const agencyEmail = packageData?.AgencyContactInformation?.email || 'Not available'

	// Define whatsIncludedOptions to map values to labels
	const whatsIncludedOptions = [
		{ value: 'airportTransfers', label: 'Airport transfers' },
		{ value: 'transportation', label: 'Air-conditioned transportation' },
		{ value: 'accommodation', label: 'Accommodation in 4-star hotels' },
		{ value: 'meals', label: 'Daily breakfast and dinner' },
		{ value: 'guide', label: 'Professional English-speaking guide' },
		{ value: 'entranceFees', label: 'All entrance fees' },
		{ value: 'taxes', label: 'Government taxes & service charges' },
		{ value: 'water', label: 'Bottled water during tours' },
		{ value: 'support', label: '24/7 customer support' },
	]

	const packageFeaturesOptions = [
		{ value: 'freeCancellation', label: 'Free cancellation up to 24h' },
		{ value: 'instantConfirmation', label: 'Instant confirmation' },
		{ value: 'smallGroup', label: 'Small group experience' },
	]

	// Helper function to get friendly label from value
	const getIncludedLabel = (value) => {
		const option = whatsIncludedOptions.find(opt => opt.value === value)
		return option ? option.label : value.replace(/_/g, ' ')
	}

	const getFeatureLabel = (value) => {
		const option = packageFeaturesOptions.find(opt => opt.value === value)
		return option ? option.label : value.replace(/_/g, ' ')
	}

	const getDifficultyTooltip = (difficulty) => {
		const tooltips = {
			easy: ' Perfect for beginners and families. Gentle terrain, short walking distances, and minimal physical exertion. Suitable for all age groups.',
			moderate: ' Suitable for travelers with basic fitness. Includes some uphill walking, longer distances, and light physical activities. Good for active travelers.',
			challenging: ' For fit travelers comfortable with steep terrain, long walking hours, and high altitudes. Requires good physical endurance and stamina.',
			strenuous: ' Demanding adventures for experienced travelers. Includes tough conditions, extreme weather, high altitudes, and long treks. Requires excellent physical fitness.',
			flexible: ' Customizable difficulty. Activities can be adjusted based on your preference and fitness level. Great for mixed groups or travelers with special requirements.'
		}
		return tooltips[difficulty?.toLowerCase()] || ''
	}

	const mainContent = (
		<main
			style={{
				flex: 1,
				minHeight: '140vh',
				background: 'linear-gradient(180deg, #FFFFFF 0%, #A0DBFF 100%)',
				paddingTop: '0px',
				paddingBottom: '140px',

			}}
		>
			<section style={{ position: 'relative', overflow: 'hidden', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)' }}>
				<div style={{ position: 'relative', height: '520px', background: '#0F172A' }}>
					{activeHeroImage ? (
						<img
							src={activeHeroImage}
							alt={packageTitle}
							style={{ width: '100%', height: '100%', objectFit: 'cover' }}
						/>
					) : (
						<div style={{ width: '100%', height: '100%', background: '#0F172A' }} />
					)}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: 'linear-gradient(90deg, rgba(17, 24, 39, 0.65) 0%, rgba(17, 24, 39, 0.2) 55%, rgba(17, 24, 39, 0) 100%)',
							pointerEvents: 'none',
						}}
					/>

					{/* Navigation Arrows & Counter */}
					{imagesList.length > 1 && (
						<>
							<button
								type="button"
								onClick={handlePrevImage}
								aria-label="Previous Image"
								style={{
									position: 'absolute',
									left: '24px',
									top: '50%',
									transform: 'translateY(-50%)',
									background: 'rgba(255, 255, 255, 0.85)',
									border: '1px solid #E5E7EB',
									color: '#111827',
									borderRadius: '50%',
									width: '46px',
									height: '46px',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '24px',
									fontWeight: 'bold',
									transition: 'all 0.2s ease',
									boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
									zIndex: 10,
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = '#FFFFFF'
									e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)'
									e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
								}}
							>
								‹
							</button>

							<button
								type="button"
								onClick={handleNextImage}
								aria-label="Next Image"
								style={{
									position: 'absolute',
									right: '24px',
									top: '50%',
									transform: 'translateY(-50%)',
									background: 'rgba(255, 255, 255, 0.85)',
									border: '1px solid #E5E7EB',
									color: '#111827',
									borderRadius: '50%',
									width: '46px',
									height: '46px',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '24px',
									fontWeight: 'bold',
									transition: 'all 0.2s ease',
									boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
									zIndex: 10,
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = '#FFFFFF'
									e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)'
									e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
								}}
							>
								›
							</button>

							<div
								style={{
									position: 'absolute',
									bottom: '20px',
									right: '24px',
									background: 'rgba(15, 23, 42, 0.85)',
									color: '#FFFFFF',
									padding: '6px 14px',
									borderRadius: '20px',
									fontSize: '13px',
									fontWeight: 600,
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									backdropFilter: 'blur(4px)',
									boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
									zIndex: 10,
								}}
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect x="3" y="3" width="18" height="18" rx="2" stroke="#FFFFFF" strokeWidth="2" />
									<circle cx="8.5" cy="8.5" r="1.5" fill="#FFFFFF" />
									<path d="M21 15L16 10L5 21" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								<span>{currentImageIndex + 1} / {imagesList.length}</span>
							</div>
						</>
					)}
					<button
						type="button"
						onClick={() => {
							if (navigate) {
								navigate(-1);
							}
						}}
						style={{
							position: 'absolute',
							top: '18px',
							left: '22px',
							display: 'inline-flex',
							alignItems: 'center',
							gap: '8px',
							color: '#F8FAFC',
							fontSize: '18px',
							fontFamily: "'Inter', sans-serif",
							cursor: 'pointer',
							background: 'transparent',
							border: 'none',
							zIndex: 100,
							pointerEvents: 'auto',
						}}
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path d="M15 6L9 12L15 18" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						Back
					</button>
					<div
						style={{
							position: 'absolute',
							left: '28px',
							bottom: '22px',
							color: '#F8FAFC',
							fontFamily: "'Inter', sans-serif",
                            padding: '40px 12px',
						}}
					>
						<h1 style={{ margin: 0, fontSize: '38px', fontWeight: 700 }}>{packageTitle}</h1>
						<div style={{ marginTop: '8px', display: 'flex', gap: '16px', fontSize: '16px' }}>
							<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="#FDE047" />
								</svg>
								4.9 (234 reviews)
							</span>
							<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<path d="M7 2H17V6H7V2ZM5 8H19V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V8ZM8 12H12V16H8V12Z" fill="#E2E8F0" />
								</svg>
								{packageDuration}
							</span>
							<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C8.69 14 6 16.69 6 20H18C18 16.69 15.31 14 12 14Z" fill="#E2E8F0" />
								</svg>
								{packageGroupSize}
							</span>
							{packageDifficulty && (
								<span 
									style={{ 
										display: 'inline-flex', 
										alignItems: 'center', 
										gap: '6px',
										position: 'relative',
										cursor: 'help'
									}}
									onMouseEnter={() => setShowDifficultyTooltip(true)}
									onMouseLeave={() => setShowDifficultyTooltip(false)}
								>
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#E2E8F0" />
									</svg>
									{packageDifficulty.charAt(0).toUpperCase() + packageDifficulty.slice(1)}
									{showDifficultyTooltip && (
										<span
											style={{
												position: 'absolute',
												bottom: 'calc(100% + 12px)',
												left: '50%',
												transform: 'translateX(-50%)',
												background: '#585555',
												color: '#FFFFFF',
												padding: '12px 16px',
												borderRadius: '8px',
												boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
												fontSize: '14px',
												lineHeight: '1.5',
												whiteSpace: 'normal',
												width: '320px',
												zIndex: 1000,
												pointerEvents: 'none',
												animation: 'fadeIn 0.2s ease-in'
											}}
										>
											{getDifficultyTooltip(packageDifficulty)}
											<span
												style={{
													position: 'absolute',
													top: '100%',
													left: '50%',
													transform: 'translateX(-50%)',
													width: 0,
													height: 0,
													borderLeft: '8px solid transparent',
													borderRight: '8px solid transparent',
													borderTop: '8px solid #FFFFFF',
												}}
											/>
										</span>
									)}
								</span>
							)}
						</div>
					</div>
				</div>
			</section>

			<section
				style={{
					maxWidth: '1280px',
					margin: '24px auto 0',
					padding: '0 24px',
					display: 'grid',
					gridTemplateColumns: '1.2fr 0.2fr',
					gap: '24px',
				}}
			>
				<div>
					<h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif",
                        paddingTop: '20px',paddingBottom: '20px' }}>
						About This Package
					</h2>
					<p
						style={{
							margin: '12px 0 0',
							color: '#6B7280',
							fontSize: '18px',
							lineHeight: 1.7,
							fontFamily: "'Inter', sans-serif",
                            paddingBottom: '60px' 

						}}
					>
						  {packageDescription}
					</p>

					<h3 style={{ margin: '22px 0 12px', fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif", paddingBottom: '50px' }}>
						Day-by-Day Itinerary
					</h3>
					{packageItinerary.length > 0 ? (
											<div
						style={{
							background: '#F3FAFF',
							borderRadius: '16px',
							padding: '28px 20px',
							boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
							display: 'flex',
							flexDirection: 'column',
							gap: '12px',
							
						}}
					>
							{packageItinerary.map((item, index) => (
								<div
									key={item.day || index}
									onClick={() => toggleDay(index)}
									style={{
										background: expandedDays[index] ? '#D7FDE1' : '#D7FDE1',
										borderRadius: '12px',
										padding: '16px 20px',
										border: `1px solid ${expandedDays[index] ? '#0EA5E9' : '#BAE6FD'}`,
										boxShadow: expandedDays[index] ? '0 4px 12px rgba(14, 165, 233, 0.15)' : '0 2px 6px rgba(15, 23, 42, 0.08)',
										cursor: 'pointer',
										transition: 'all 0.2s ease',
									}}
								>
									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
										<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
											<div
												style={{
													width: '36px',
													height: '36px',
													borderRadius: '999px',
													background: expandedDays[index] ? '#0EA5E9' : '#0284C7',
													color: '#FFFFFF',
													fontSize: '16px',
													fontWeight: 700,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													flexShrink: 0,
												}}
											>
												{item.day}
											</div>
											<div>
												<div style={{ fontSize: '21px', fontWeight: 700, color: '#0C4A6E' }}>Day {item.day}</div>
												<div style={{ fontSize: '17px', color: '#334155', fontWeight: 600 }}>{item.title || 'No title'}</div>
											</div>
										</div>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											style={{
												transform: expandedDays[index] ? 'rotate(180deg)' : 'rotate(0deg)',
												transition: 'transform 0.2s ease',
												flexShrink: 0,
											}}
										>
											<path d="M6 9L12 15L18 9" stroke="#0C4A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</div>

									{expandedDays[index] && (
										<div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #BAE6FD' }}>
											{item.description && (
												<p style={{ margin: '0 0 12px', fontSize: '18px', color: '#475569', lineHeight: 1.6 }}>
													{item.description}
												</p>
											)}
											{item.activities && item.activities.length > 0 && (
												<>
													<div style={{ fontSize: '17px', fontWeight: 600, color: '#0C4A6E', marginBottom: '8px' }}>Activities:</div>
													<ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px', listStyle: 'none' }}>
														{item.activities.map((activity, actIndex) => (
															<li key={actIndex} style={{ fontSize: '17px', color: '#64748B', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
																<span style={{ color: '#0284C7', fontSize: '17px', lineHeight: '1', marginTop: '2px' }}>•</span>
																<span>{activity}</span>
															</li>
														))}
													</ul>
												</>
											)}
										</div>
									)}
								</div>
							))}
						</div>
					) : (
						<div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '16px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
							No itinerary available for this package.
						</div>
					)}
				</div>

				<aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' ,width: '25em'}}>
					<div
						style={{
							background: '#FFFFFF',
							borderRadius: '14px',
							padding: '20px' ,
							boxShadow: '0 10px 24px rgba(15, 23, 42, 0.1)',
							border: '1px solid #E5E7EB',
                            marginBottom: '-28px',
							
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<div style={{ fontSize: '16px', color: '#94A3B8', fontWeight: 600 }}>PER PERSON</div>
							{savings > 0 && (
								<span
									style={{
										fontSize: '14px',
										color: '#16A34A',
										background: '#DCFCE7',
										padding: '2px 6px',
										borderRadius: '999px',
									}}
								>
									Save ${savings.toFixed(2)}
								</span>
							)}
						</div>
						<div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
							{typeof promotionPrice === 'number' && (
								<div style={{ fontSize: '16px', color: '#94A3B8', textDecoration: 'line-through' }}>
									{packagePrice}
								</div>
							)}
							<div style={{ fontSize: '28px', fontWeight: 700, color: '#2563EB' }}>
								{typeof promotionPrice === 'number' ? `$${promotionPrice.toFixed(2)}` : packagePrice}
							</div>
						</div>
						<div style={{ marginTop: '12px', fontSize: '18px', fontWeight: 700, color: '#111827' }}>What's Included</div>
							<ul
							style={{
								listStyle: 'none',
								margin: '10px 0 0',
								padding: 0,
								display: 'flex',
								flexDirection: 'column',
								gap: '10px',
								color: '#64748B',
								fontSize: '15px'
							}}
							>
							{packageWhatsIncluded.length > 0 ? (
								packageWhatsIncluded.map((value) => (
									<li key={value} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden="true"
										>
											<circle cx="12" cy="12" r="10" stroke="#22C55E" strokeWidth="2" />
											<path
												d="M8 12L11 15L16 9"
												stroke="#22C55E"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<span>{getIncludedLabel(value)}</span>
									</li>
								))
							) : (
								<li style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No inclusions specified</li>
							)}
							</ul>

						<button
							type="button"
							style={{
								marginTop: '16px',
								width: '100%',
								height: '48px',
								borderRadius: '8px',
								background: '#2563EB',
								color: '#FFFFFF',
								border: 'none',
								fontSize: '16px',
								fontWeight: 600,
								cursor: 'pointer',
							}}
						>
							Book Now
						</button>
						<div style={{ fontSize: '20px', fontWeight: 400, color: '#111827',paddingTop: '30px' }}>Package Features</div>
						<ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#64748B' }}>
							{packageFeatures.length > 0 ? (
								packageFeatures.map((value) => (
									<li key={value} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
										<span style={{ width: '6px', height: '6px', borderRadius: '999px', background: '#94A3B8' }} />
										{getFeatureLabel(value)}
									</li>
								))
							) : (
								<li style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No features specified</li>
							)}
						</ul>
					</div>

					<div
						style={{
							background: '#FFFFFF',
							borderRadius: '11px',
							padding: '20px',
							boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
							border: '1px solid #E5E7EB',
						}}
					>
						<div style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Need Help?</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px', color: '#64748B' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
									<path d="M12 2L2 7V11C2 16.55 5.84 21.74 12 23C18.16 21.74 22 16.55 22 11V7L12 2Z" fill="#2563EB" />
									<path d="M10 12L8.5 13.5L11 16L16 11L14.5 9.5L11 13L10 12Z" fill="#FFFFFF" />
								</svg>
								<div>
									<div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500 }}>Agency Name</div>
									<div style={{ fontSize: '15px', color: '#111827', fontWeight: 600 }}>{agencyName}</div>
								</div>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
									<path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.69 6.45 9.06 7.57C9.18 7.92 9.09 8.32 8.82 8.59L6.62 10.79Z" fill="#2563EB" />
								</svg>
								<div>
									<div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500 }}>Call Us</div>
									<div style={{ fontSize: '15px', color: '#111827', fontWeight: 600 }}>{agencyPhone}</div>
								</div>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
									<path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4ZM4 6V18H20V6L12 11L4 6Z" fill="#2563EB" />
								</svg>
								<div>
									<div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500 }}>Email Us</div>
									<div style={{ fontSize: '15px', color: '#111827', fontWeight: 600, wordBreak: 'break-all' }}>{agencyEmail}</div>
								</div>
							</div>
						</div>
					</div>
				</aside>
			</section>
		</main>
	)

	if (embedLayout) {
		return (
			<>
				<style>
					{`
						@keyframes fadeIn {
							from {
								opacity: 0;
								transform: translateX(-50%) translateY(4px);
							}
							to {
								opacity: 1;
								transform: translateX(-50%) translateY(0);
							}
						}
					`}
				</style>
				{mainContent}
			</>
		)
	}

	return (
		<>
			<style>
				{`
					@keyframes fadeIn {
						from {
							opacity: 0;
							transform: translateX(-50%) translateY(4px);
						}
						to {
							opacity: 1;
							transform: translateX(-50%) translateY(0);
						}
					}
				`}
			</style>
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
			</div>
		</>
	)
}

export default function PackageView(props) {
	const params = useParams()
	const navigate = useNavigate()
	const [packageData, setPackageData] = React.useState(props.packageData || null)
	const [loading, setLoading] = React.useState(!props.packageData)
	const [expandedDays, setExpandedDays] = React.useState({})

	const toggleDay = (dayIndex) => {
		setExpandedDays(prev => ({
			...prev,
			[dayIndex]: !prev[dayIndex]
		}))
	}

	React.useEffect(() => {
		if (props.packageData) return

		let cancelled = false

		const loadPackage = async () => {
			try {
				setLoading(true)
				const response = await fetch(`http://localhost:5000/api/packages/${params.id}`)
				const data = await response.json()
				if (!cancelled) setPackageData(data.data || null)
			} catch (error) {
				if (!cancelled) setPackageData(null)
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		loadPackage()

		return () => {
			cancelled = true
		}
	}, [params.id, props.packageData])

	if (loading) {
		return (
			<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#6B7280' }}>
				Loading package...
			</div>
		)
	}

	return <PackageViewContent {...props} packageData={packageData} expandedDays={expandedDays} toggleDay={toggleDay} navigate={navigate} />
}
