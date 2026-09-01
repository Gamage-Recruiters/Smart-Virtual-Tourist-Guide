import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/api'
import { hotelOwnerAPI } from '../../services/api'
import Header from '../../components/HotelOwner/Header';
import Footer from '../../components/HotelOwner/Footer';
import dashboardBackground from '../../assets/HotelOwner/Dashboard Image.png'
import bgImage from '../../assets/HotelOwner/Background Image.png'

function HotelOwnerDashboard() {
	const navigate = useNavigate()
	const [firstName, setFirstName] = useState('')
	const [hasHotel, setHasHotel] = useState(false)
	const [tooltipVisible, setTooltipVisible] = useState(false)
	const [bookingMetrics, setBookingMetrics] = useState({
		currentMonthBookings: 0,
		percentageChange: 0,
		totalRevenue: 0,
		revenuePctChange: 0,
		occupancyRate: 0,
		occupancyPctChange: 0,
	})
	const [latestReservation, setLatestReservation] = useState(null)
	const [revenueChartData, setRevenueChartData] = useState([])
	const [weeklyBookingsData, setWeeklyBookingsData] = useState([])
	const [hoveredWeek, setHoveredWeek] = useState(null)
	const [hoveredBar, setHoveredBar] = useState(null)

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('userData') || '{}')
		setFirstName((userData.fullName || 'Hotel Owner').split(' ')[0])

		apiClient.get('/auth/me')
			.then(res => {
				if (res.success && res.user) {
					localStorage.setItem('userData', JSON.stringify(res.user))
					setFirstName((res.user.fullName || 'Hotel Owner').split(' ')[0])
					setHasHotel(Array.isArray(res.user.hotels) && res.user.hotels.length > 0)

					if (Array.isArray(res.user.hotels) && res.user.hotels.length > 0) {
						const hotelId = res.user.hotels[0]._id
						fetchBookingMetrics(hotelId)
						fetchLatestReservation(hotelId)
					}
				}
			})
			.catch(() => {
				setHasHotel(Array.isArray(userData.hotels) && userData.hotels.length > 0)
				if (Array.isArray(userData.hotels) && userData.hotels.length > 0) {
					const hotelId = userData.hotels[0]._id
					fetchBookingMetrics(hotelId)
					fetchLatestReservation(hotelId)
				}
			})
	}, [])

	const pctChange = (current, previous) =>
		previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100

	const fetchBookingMetrics = (hotelId) => {
		hotelOwnerAPI.getRevenueSummariesByHotel(hotelId)
			.then(res => {
				if (!Array.isArray(res.summaries)) return

				const now = new Date()
				const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
				const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
				const prevMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`

				const cur = res.summaries.find(s => s.month === currentMonthKey)
				const prev = res.summaries.find(s => s.month === prevMonthKey)

				const currentMonthBookings = cur?.metrics?.totalBookings || 0
				const previousMonthBookings = prev?.metrics?.totalBookings || 0
				const totalRevenue = cur?.metrics?.totalRevenue || 0
				const prevRevenue = prev?.metrics?.totalRevenue || 0
				const occupancyRate = cur?.metrics?.occupancyRate || 0
				const prevOccupancy = prev?.metrics?.occupancyRate || 0

				setBookingMetrics({
					currentMonthBookings,
					percentageChange: parseFloat(pctChange(currentMonthBookings, previousMonthBookings).toFixed(1)),
					totalRevenue,
					revenuePctChange: parseFloat(pctChange(totalRevenue, prevRevenue).toFixed(1)),
					occupancyRate: parseFloat(occupancyRate.toFixed(1)),
					occupancyPctChange: parseFloat(pctChange(occupancyRate, prevOccupancy).toFixed(1)),
				})

				const months = Array.from({ length: 6 }, (_, i) => {
					const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
					const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
					const label = d.toLocaleString('en-US', { month: 'short' })
					const summary = res.summaries.find(s => s.month === key)
					return { label, revenue: summary?.metrics?.totalRevenue || 0 }
				})
				setRevenueChartData(months)

				const curSummary = res.summaries.find(s => s.month === currentMonthKey)
				if (Array.isArray(curSummary?.weeklyBookings) && curSummary.weeklyBookings.length > 0) {
					setWeeklyBookingsData(curSummary.weeklyBookings)
				}
			})
			.catch(() => {})
	}

	const fetchLatestReservation = (hotelId) => {
		hotelOwnerAPI.getBookingsByHotel(hotelId)
			.then(res => {
				if (!Array.isArray(res.bookings) || res.bookings.length === 0) return
				const latest = res.bookings.reduce((a, b) =>
					new Date(a.createdAt) >= new Date(b.createdAt) ? a : b
				)
				setLatestReservation(latest)
			})
			.catch(() => {})
	}

	return (
		<div className="min-h-screen w-full overflow-x-hidden text-slate-800">
			<div className="mx-auto flex min-h-screen w-auto flex-col">
				<Header hasHotel={hasHotel} />

				<main className="flex flex-1 flex-col gap-6">
					<section
						id="overview"
						className="relative overflow-hidden border border-slate-200/80 bg-white/25 p-5 shadow-[0_28px_60px_rgba(20,40,60,0.12)] backdrop-blur md:p-10"
						style={{
							backgroundImage: `url(${dashboardBackground})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
						}}
					>
						<div className="relative z-10 flex min-h-[620px] items-center justify-center rounded-[28px] bg-white/10 px-4 py-12 text-center sm:min-h-[700px]">
							<div className="relative flex max-w-3xl flex-col items-start gap-8 text-slate-950">
								<h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
									Welcome {firstName} !
								</h1>
								<p className="text-xl font-medium text-slate-800" style={{ wordSpacing: '5px' }}>
									Manage Your Hotel and Boost <span className="font-bold">Your</span> Booking
								</p>
								<style>{`
									@keyframes btn-shine {
										0%   { background-position: -250% center; }
										100% { background-position: 250% center; }
									}
									.shine-btn {
										background: linear-gradient(110deg, #e0eaff 0%, #e0eaff 35%, #ffffff 50%, #e0eaff 65%, #e0eaff 100%);
										background-size: 250% auto;
										animation: btn-shine 1.8s linear infinite;
									}
									@keyframes tooltip-fade {
										0%   { opacity: 0; transform: translateY(4px); }
										10%  { opacity: 1; transform: translateY(0); }
										80%  { opacity: 1; }
										100% { opacity: 0; }
									}
									.tooltip-anim { animation: tooltip-fade 3s ease forwards; }
								`}</style>
								{!hasHotel && tooltipVisible && (
									<div className="tooltip-anim absolute left-0 top-full mt-2 z-50 max-w-xs rounded-lg bg-slate-800 px-4 py-2.5 text-xs text-white shadow-lg leading-relaxed pointer-events-none">
										Next step: Click here to add your hotel. You cannot work with the system until you do.
										<span className="absolute -top-1.5 left-6 h-3 w-3 rotate-45 bg-slate-800" />
									</div>
								)}
								<button
									onClick={() => hasHotel ? navigate('/view-rooms-packages') : navigate('/hotel-info')}
									onMouseEnter={() => { if (!hasHotel) { setTooltipVisible(true); setTimeout(() => setTooltipVisible(false), 3000); } }}
									className={`inline-flex h-12 items-center justify-center rounded-sm border border-slate-500 px-10 text-lg font-medium text-slate-700 shadow-sm transition cursor-pointer${!hasHotel ? ' shine-btn' : ' bg-white/70 hover:bg-white'}`}
									type="button"
								>
									{hasHotel ? 'Explore More...' : 'Add Your Hotel'}
								</button>
							</div>
						</div>
					</section>

					<section
						className="relative overflow-hidden border border-slate-200/90 bg-slate-100/80 px-4 py-10 md:px-8"
						style={{
							backgroundImage: `linear-gradient(rgba(247,249,252,0.86), rgba(247,249,252,0.9)), url(${bgImage})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
						}}
					>
						<div className="mx-auto max-w-[1400px]">
							<div className="mb-4 flex items-center justify-between">
								<div>
									<h3 className="text-3xl font-black text-slate-900">Hotel Dashboard</h3>
									<p className="mt-1 text-sm text-slate-500">Manage your hotel operations and track performance</p>
								</div>
								<button
									type="button"
									disabled={!hasHotel}
									onClick={() => navigate('/add-room-package')}
									className="inline-flex h-11 items-center justify-center rounded-md bg-sky-800 px-5 text-sm font-semibold text-white transition hover:bg-sky-900 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
								>
									+&nbsp;Add New Room
								</button>
							</div>
							<div className="grid gap-4 lg:grid-cols-[400px_1fr]">
								<aside className="rounded-xl p-6" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #A0DBFF 100%)' }}>
										<div className="grid gap-2">
											<button type="button"
											disabled={!hasHotel}
											onClick={() => navigate('/view-rooms-packages')}
											className="rounded-lg border border-slate-300 bg-white px-4 py-4 text-left text-base font-medium text-slate-700 shadow-sm flex items-center gap-3 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
												Add Rooms &amp; Packages
											</button>
											<button type="button"
											disabled={!hasHotel}
											onClick={() => navigate('/manage-availability')}
											className="rounded-lg border border-slate-300 bg-white px-4 py-4 text-left text-base font-medium text-slate-700 shadow-sm flex items-center gap-3 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
												Manage Availability
											</button>
											<button type="button"
											disabled={!hasHotel}
											onClick={() => navigate('/view-reservations')}
											className="rounded-lg border border-slate-300 bg-white px-4 py-4 text-left text-base font-medium text-slate-700 shadow-sm flex items-center gap-3 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
												View Booking
											</button>
											<button type="button"
											onClick={() => navigate('/Hotel-Owner-Profile-Settings')}
											className="rounded-lg border border-slate-300 bg-white px-4 py-4 text-left text-base font-medium text-slate-700 shadow-sm flex items-center gap-3 cursor-pointer">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
												Profile setting
											</button>
											<button type="button"
											disabled={!hasHotel}
											onClick={() => navigate('/financial-analysis')}
											className="rounded-lg border border-slate-300 bg-white px-4 py-4 text-left text-base font-medium text-slate-700 shadow-sm flex items-center gap-3 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
												Financial Analyze
											</button>
										</div>
									</aside>

									<div className="rounded-xl bg-sky-100/65 p-4" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #A0DBFF 100%)' }}>
										<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
											<div className="rounded-lg bg-white p-3 shadow-sm">
												<p className="text-[11px] text-slate-500">Total Bookings</p>
												<p className="mt-1 text-2xl font-black text-slate-900">{bookingMetrics.currentMonthBookings}</p>
												<p className="mt-1 text-[11px]" style={{ color: bookingMetrics.percentageChange >= 0 ? '#16a34a' : '#dc2626' }}>
													{bookingMetrics.percentageChange >= 0 ? '+' : ''}{bookingMetrics.percentageChange.toFixed(1)}% <span className="text-slate-500">vs last month</span>
												</p>
											</div>
											<div className="rounded-lg bg-white p-3 shadow-sm">
												<p className="text-[11px] text-slate-500">Revenue</p>
												<p className="mt-1 text-2xl font-black text-slate-900">${bookingMetrics.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
												<p className="mt-1 text-[11px]" style={{ color: bookingMetrics.revenuePctChange >= 0 ? '#16a34a' : '#dc2626' }}>
													{bookingMetrics.revenuePctChange >= 0 ? '+' : ''}{bookingMetrics.revenuePctChange.toFixed(1)}% <span className="text-slate-500">vs last month</span>
												</p>
											</div>
											<div className="rounded-lg bg-white p-3 shadow-sm">
												<p className="text-[11px] text-slate-500">Occupancy Rate</p>
												<p className="mt-1 text-2xl font-black text-slate-900">{bookingMetrics.occupancyRate.toFixed(1)}%</p>
												<p className="mt-1 text-[11px]" style={{ color: bookingMetrics.occupancyPctChange >= 0 ? '#16a34a' : '#dc2626' }}>
													{bookingMetrics.occupancyPctChange >= 0 ? '+' : ''}{bookingMetrics.occupancyPctChange.toFixed(1)}% <span className="text-slate-500">vs last month</span>
												</p>
											</div>
											<div className="rounded-lg bg-white p-3 shadow-sm">
												<p className="text-[11px] text-slate-500">Average Rating</p>
												<p className="mt-1 text-2xl font-black text-slate-900">4.7</p>
												<p className="mt-1 text-[11px] text-emerald-600">+0.3 <span className="text-slate-500">vs last month</span></p>
											</div>
										</div>

										<div className="mt-3 grid gap-3 xl:grid-cols-2">
											<div className="rounded-lg bg-white p-4 shadow-sm">
												<h4 className="text-sm font-bold text-slate-800">Revenue Analytics</h4>
												{revenueChartData.length > 0 ? (() => {
													const maxRev = Math.max(...revenueChartData.map(d => d.revenue), 1)
													const yTop = Math.ceil(maxRev / 1000) * 1000
													const yLabels = [yTop, yTop * 0.75, yTop * 0.5, yTop * 0.25, 0]
													const svgW = 300
													const svgH = 120
													const n = revenueChartData.length
													const barW = Math.floor((svgW - (n - 1) * 6) / n)
													const bars = revenueChartData.map((d, i) => {
														const barH = Math.max((d.revenue / yTop) * svgH, d.revenue > 0 ? 2 : 0)
														const x = i * (barW + 6)
														const y = svgH - barH
														return { ...d, x, y, barH, cx: x + barW / 2 }
													})
													return (
														<div className="mt-4 flex gap-2">
															<div className="flex flex-col justify-between pb-6 text-right text-[10px] text-black">
																{yLabels.map((v, i) => (
																	<span key={i}>{v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}</span>
																))}
															</div>
															<div className="flex flex-1 flex-col">
																<div className="rounded-md bg-slate-50 px-1 pb-1" style={{ height: '13rem' }}>
																	<svg
																		viewBox={`0 0 ${svgW} ${svgH}`}
																		className="h-full w-full overflow-visible"
																		aria-label="Revenue analytics chart"
																		onMouseLeave={() => setHoveredBar(null)}
																	>
																		{bars.map((b, i) => (
																			<g key={i} onMouseEnter={() => setHoveredBar(b)} onMouseLeave={() => setHoveredBar(null)}>
																				<rect x={b.x} y={b.y} width={barW} height={b.barH} rx={2} fill="rgba(12,74,110,0.8)" />
																				<rect x={b.x} y={0} width={barW} height={svgH} fill="transparent" />
																			</g>
																		))}
																		{hoveredBar && (() => {
																			const label = `$${hoveredBar.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
																				const tw = label.length * 6 + 20
																			const tx = Math.min(Math.max(hoveredBar.cx - tw / 2, 0), svgW - tw)
																			const ty = hoveredBar.y - 26
																			return (
																				<g>
																				<rect x={tx} y={ty} width={tw} height={22} rx={4} fill="#1e293b" />
																					<text x={tx + tw / 2} y={ty + 14} textAnchor="middle" fill="white" fontSize={11}>{label}</text>
																				</g>
																			)
																		})()}
																	</svg>
																</div>
																<div className="mt-1 flex justify-between px-1 text-[10px] text-black">
																	{revenueChartData.map((d, i) => (
																		<span key={i}>{d.label}</span>
																	))}
																</div>
															</div>
														</div>
													)
												})() : (
													<p className="mt-6 text-[11px] text-slate-400">No revenue data yet.</p>
												)}
											</div>

											<div className="rounded-lg bg-white p-4 shadow-sm">
												<h4 className="text-sm font-bold text-slate-800">Booking Trends</h4>
												{weeklyBookingsData.length > 0 ? (() => {
													const maxB = Math.max(...weeklyBookingsData.map(d => d.bookings), 1)
													const yTop = Math.max(Math.ceil(maxB / 7) * 7, 7)
													const yLabels = [yTop, Math.round(yTop * 0.75), Math.round(yTop * 0.5), Math.round(yTop * 0.25), 0]
													const coords = weeklyBookingsData.map((d, i) => ({
														x: 10 + i * (300 / (weeklyBookingsData.length - 1)),
														y: 130 - (d.bookings / yTop) * 120,
														...d,
													}))
													return (
														<div className="mt-4 flex gap-2">
															<div className="flex flex-col justify-between pb-6 text-right text-[10px] text-black">
																{yLabels.map((v, i) => <span key={i}>{v}</span>)}
															</div>
															<div className="flex flex-1 flex-col">
																<div className="h-52 rounded-md bg-slate-50 p-4">
																	<svg
																		viewBox="0 0 320 140"
																		className="h-full w-full overflow-visible"
																		role="img"
																		aria-label="Booking trend chart"
																		onMouseLeave={() => setHoveredWeek(null)}
																	>
																		<polyline points={coords.map(c => `${c.x},${c.y}`).join(' ')} fill="none" stroke="#1f8a42" strokeWidth="3" />
																		{coords.map((c, i) => (
																			<g key={i} onMouseEnter={() => setHoveredWeek(c)}>
																				<rect x={c.x - 20} y={0} width={40} height={140} fill="transparent" />
																				<circle cx={c.x} cy={c.y} r={4} fill="#1f8a42" />
																			</g>
																		))}
																		{hoveredWeek && (
																			<g>
																				<rect
																					x={hoveredWeek.x > 240 ? hoveredWeek.x - 80 : hoveredWeek.x + 8}
																					y={hoveredWeek.y - 30}
																					width={72}
																					height={22}
																					rx={4}
																					fill="#1e293b"
																				/>
																				<text
																					x={hoveredWeek.x > 240 ? hoveredWeek.x - 44 : hoveredWeek.x + 44}
																					y={hoveredWeek.y - 15}
																					textAnchor="middle"
																					fill="white"
																					fontSize={11}
																				>
																					Bookings: {hoveredWeek.bookings}
																				</text>
																			</g>
																		)}
																	</svg>
																</div>
																<div className="mt-1 flex justify-between px-1 text-[10px] text-black">
																	{weeklyBookingsData.map((d, i) => <span key={i}>{d.week}</span>)}
																</div>
															</div>
														</div>
													)
												})() : (
													<p className="mt-6 text-[11px] text-slate-400">No booking trend data yet.</p>
												)}
											</div>
										</div>
									</div>
							</div>

							<div className="mt-8 p-4 md:p-6">
								<h3 className="text-4xl font-black text-slate-900">Latest Reservations</h3>

								{latestReservation ? (
									<div className="mt-8 grid grid-cols-[1.1fr_1fr_auto] items-start gap-4 rounded-lg py-3">
										<div>
											<div className="flex items-center gap-4">
												<div>
													<p className="text-2xl font-extrabold text-slate-900">
														{latestReservation.customer?.firstName} {latestReservation.customer?.lastName}
													</p>
													<p className="mt-2 text-sm text-sky-700">{latestReservation.customer?.phone || latestReservation.customer?.email || '—'}</p>
													<p className="text-sm text-slate-600">{latestReservation.roomName || latestReservation.roomType || '—'}</p>
												</div>
											</div>
										</div>
										<div className="pt-1 text-sm text-slate-700">
											<p>{latestReservation.checkIn?.slice(0, 10)} — {latestReservation.checkOut?.slice(0, 10)}</p>
											<p className="mt-1">{latestReservation.adultCount || 0} adults{latestReservation.childCount > 0 ? `, ${latestReservation.childCount} children` : ''}</p>
										</div>
										<div className="text-right">
											<p className="text-xl font-extrabold text-slate-900">US${latestReservation.bookingPrice?.toLocaleString('en-US', { maximumFractionDigits: 0 }) || '—'}</p>
											<p className="mt-1 text-sm text-slate-600">{latestReservation.bookedDate?.slice(0, 10) || new Date(latestReservation.createdAt).toISOString().slice(0, 10)}</p>
										</div>
									</div>
								) : (
									<p className="mt-8 text-sm text-slate-400">No reservations yet.</p>
								)}

								<div className="mt-8 flex justify-end">
									<button
										type="button"
										onClick={() => navigate('/')}
										className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-lg font-semibold text-slate-900 hover:text-sky-600 cursor-pointer transition-colors duration-200"
									>
										&lt; Back
									</button>
								</div>
							</div>
						</div>
					</section>
				</main>

				<Footer />
			</div>
		</div>
    
	)
}

export default HotelOwnerDashboard
