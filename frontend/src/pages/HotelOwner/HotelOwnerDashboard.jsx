import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/api'
import Header from '../../components/HotelOwner/Header';
import Footer from '../../components/HotelOwner/Footer';
import dashboardBackground from '../../assets/HotelOwner/Dashboard Image.png'
import bgImage from '../../assets/HotelOwner/Background Image.png'

function HotelOwnerDashboard() {
	const navigate = useNavigate()
	const [firstName, setFirstName] = useState('')
	const [hasHotel, setHasHotel] = useState(false)
	const [tooltipVisible, setTooltipVisible] = useState(false)

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('userData') || '{}')
		setFirstName((userData.fullName || 'Hotel Owner').split(' ')[0])

		// Fetch fresh user data from API to get up-to-date hotels array
		apiClient.get('/auth/me')
			.then(res => {
				if (res.success && res.user) {
					localStorage.setItem('userData', JSON.stringify(res.user))
					setFirstName((res.user.fullName || 'Hotel Owner').split(' ')[0])
					setHasHotel(Array.isArray(res.user.hotels) && res.user.hotels.length > 0)
				}
			})
			.catch(() => {
				// Fallback to localStorage if API fails
				setHasHotel(Array.isArray(userData.hotels) && userData.hotels.length > 0)
			})
	}, [])
	return (
		<div className="min-h-screen w-full overflow-x-hidden text-slate-800">
			<div className="mx-auto flex min-h-screen w-auto flex-col gap-6 pt-28">
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
												<p className="mt-1 text-2xl font-black text-slate-900">127</p>
												<p className="mt-1 text-[11px] text-emerald-600">+12.5% <span className="text-slate-500">vs last month</span></p>
											</div>
											<div className="rounded-lg bg-white p-3 shadow-sm">
												<p className="text-[11px] text-slate-500">Revenue</p>
												<p className="mt-1 text-2xl font-black text-slate-900">$24,500</p>
												<p className="mt-1 text-[11px] text-emerald-600">+8.2% <span className="text-slate-500">vs last month</span></p>
											</div>
											<div className="rounded-lg bg-white p-3 shadow-sm">
												<p className="text-[11px] text-slate-500">Occupancy Rate</p>
												<p className="mt-1 text-2xl font-black text-slate-900">78%</p>
												<p className="mt-1 text-[11px] text-emerald-600">+5.1% <span className="text-slate-500">vs last month</span></p>
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
												<div className="mt-4 flex gap-2">
													{/* Y-axis */}
													<div className="flex flex-col justify-between pb-6 text-right text-[10px] text-black">
														<span>20K</span>
														<span>15</span>
														<span>10</span>
														<span>5</span>
														<span>0</span>
													</div>
													<div className="flex flex-1 flex-col">
														<div className="flex h-52 items-end justify-between gap-2 rounded-md bg-slate-50 px-3 pb-3">
															<div className="w-full rounded-t-sm bg-sky-900/80" style={{ height: '58%' }} />
															<div className="w-full rounded-t-sm bg-sky-900/80" style={{ height: '70%' }} />
															<div className="w-full rounded-t-sm bg-sky-900/80" style={{ height: '66%' }} />
															<div className="w-full rounded-t-sm bg-sky-900/80" style={{ height: '76%' }} />
															<div className="w-full rounded-t-sm bg-sky-900/80" style={{ height: '68%' }} />
															<div className="w-full rounded-t-sm bg-sky-900/80" style={{ height: '82%' }} />
														</div>
														{/* X-axis */}
														<div className="mt-1 flex justify-between px-1 text-[10px] text-black">
															<span>Feb</span>
															<span>Mar</span>
															<span>Apr</span>
															<span>May</span>
															<span>Jun</span>
														</div>
													</div>
												</div>
											</div>

											<div className="rounded-lg bg-white p-4 shadow-sm">
												<h4 className="text-sm font-bold text-slate-800">Booking Trends</h4>
												<div className="mt-4 flex gap-2">
													{/* Y-axis */}
													<div className="flex flex-col justify-between pb-6 text-right text-[10px] text-black">
														<span>28</span>
														<span>21</span>
														<span>14</span>
														<span>7</span>
														<span>0</span>
													</div>
													<div className="flex flex-1 flex-col">
														<div className="h-52 rounded-md bg-slate-50 p-4">
															<svg viewBox="0 0 320 140" className="h-full w-full" role="img" aria-label="Booking trend chart">
																<path d="M10 110 L95 48 L180 85 L305 15" fill="none" stroke="#1f8a42" strokeWidth="3" />
															</svg>
														</div>
														{/* X-axis */}
														<div className="mt-1 flex justify-between px-1 text-[10px] text-black">
															<span>Week 2</span>
															<span>Week 3</span>
															<span>Week 4</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
							</div>

							<div className="mt-8 p-4 md:p-6">
								<h3 className="text-4xl font-black text-slate-900">Latest Reservations</h3>

								<div className="mt-8 grid grid-cols-[1.1fr_1fr_auto] items-start gap-4 rounded-lg py-3">
									<div>
										<div className="flex items-center gap-4">
											<span className="text-3xl" aria-hidden="true">🇩🇪</span>
											<div>
												<p className="text-2xl font-extrabold text-slate-900">Jai Mister</p>
												<p className="mt-2 text-sm text-sky-700">4567893456</p>
												<p className="text-sm text-slate-600">Deluxe Suite</p>
											</div>
										</div>
									</div>
									<div className="pt-1 text-sm text-slate-700">
										<p>Jul 23, 2026 - Jul 25, 2026</p>
										<p className="mt-1">2 nights - 2 adults, 2 children</p>
									</div>
									<div className="text-right">
										<p className="text-xl font-extrabold text-slate-900">US$154</p>
										<p className="mt-1 text-sm text-slate-600">26 Feb, 2026</p>
									</div>
								</div>

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
