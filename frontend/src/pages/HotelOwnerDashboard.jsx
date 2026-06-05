import {
	FaArrowRight,
	FaBed,
	FaBook,
	FaCalendarDays,
	FaChartLine,
	FaCircleCheck,
	FaClock,
	FaHotel,
	FaLanguage,
	FaPlus,
	FaSliders,
	FaStar,
	FaUserLarge,
	FaWrench,
} from 'react-icons/fa6'

import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import dashboardBackground from '../assets/Dashboard Image.png'
import lotusDecoration from '../assets/Lotus Flower.png'

const quickActions = [
	{
		title: 'Add New Room',
		description: 'Create room listings with pricing, capacity, and amenities.',
		icon: FaPlus,
		tone: 'from-amber-100 to-orange-200 text-amber-900',
	},
	{
		title: 'Manage Availability',
		description: 'Mark rooms available, booked, or under maintenance.',
		icon: FaCalendarDays,
		tone: 'from-sky-100 to-cyan-200 text-sky-900',
	},
	{
		title: 'View Bookings',
		description: 'Track arrivals, departures, and active reservations.',
		icon: FaChartLine,
		tone: 'from-emerald-100 to-lime-200 text-emerald-900',
	},
]

const roomCards = [
	{
		name: 'Ocean Suite',
		status: 'Available',
		occupancy: '2 / 4 guests',
		price: 'LKR 38,000',
		accent: 'border-emerald-200 bg-emerald-50/80',
		badge: 'bg-emerald-100 text-emerald-800',
	},
	{
		name: 'Palm Deluxe',
		status: 'Booked',
		occupancy: '2 / 3 guests',
		price: 'LKR 29,500',
		accent: 'border-amber-200 bg-amber-50/80',
		badge: 'bg-amber-100 text-amber-800',
	},
	{
		name: 'Conference Hall',
		status: 'Under Maintenance',
		occupancy: '0 / 40 guests',
		price: 'LKR 52,000',
		accent: 'border-rose-200 bg-rose-50/80',
		badge: 'bg-rose-100 text-rose-800',
	},
	{
		name: 'Garden Family Room',
		status: 'Available',
		occupancy: '4 / 5 guests',
		price: 'LKR 24,000',
		accent: 'border-emerald-200 bg-emerald-50/80',
		badge: 'bg-emerald-100 text-emerald-800',
	},
]

const bookingTimeline = [
	{ time: '09:00', title: 'Aqua Villa check-in completed', note: 'Guest arrival logged at reception.', icon: FaCircleCheck, color: 'text-emerald-600' },
	{ time: '11:30', title: 'Deluxe Room booked for 3 nights', note: 'Payment confirmed via card.', icon: FaClock, color: 'text-amber-600' },
	{ time: '14:00', title: 'Poolside Suite marked clean', note: 'Housekeeping updated room status.', icon: FaBed, color: 'text-sky-600' },
	{ time: '16:15', title: 'Maintenance scheduled for Hall A', note: 'Technician assigned for evening slot.', icon: FaWrench, color: 'text-rose-600' },
]

const secondPartActions = [
	{ label: 'Add Rooms & Packages', icon: FaBed },
	{ label: 'Manage Availability', icon: FaCalendarDays },
	{ label: 'View Booking', icon: FaBook },
	{ label: 'Profile setting', icon: FaSliders },
	{ label: 'Financial Analyze', icon: FaChartLine },
]

const analyticsCards = [
	{ title: 'Total Bookings', value: '127', change: '+12.5%', icon: FaBook },
	{ title: 'Revenue', value: '$24,500', change: '+8.2%', icon: FaChartLine },
	{ title: 'Occupancy Rate', value: '78%', change: '+5.1%', icon: FaBed },
	{ title: 'Average Rating', value: '4.7', change: '+0.3', icon: FaStar },
]

const revenueBars = [
	{ month: 'Jan', value: 78 },
	{ month: 'Feb', value: 90 },
	{ month: 'Mar', value: 82 },
	{ month: 'Apr', value: 100 },
	{ month: 'May', value: 88 },
	{ month: 'Jun', value: 110 },
]

const bookingTrend = [
	{ week: 'Week 1', value: 24 },
	{ week: 'Week 2', value: 32 },
	{ week: 'Week 3', value: 28 },
	{ week: 'Week 4', value: 35 },
]

const latestReservations = [
	{
		id: 'r1',
		flag: '🇩🇪',
		name: 'Jai Mister',
		phone: '4567893456',
		room: 'Deluxe Suite',
		dateRange: 'Jul 23, 2026 - Jul 25, 2026',
		nights: '2 nights - 2 adults, 2 children',
		price: 'US$154',
		bookedDate: '26 Feb, 2026',
	},
	{
		id: 'r2',
		flag: '🇦🇺',
		name: 'Dave Hofmans',
		phone: '4567893455',
		room: 'Villa with pool view',
		dateRange: 'Apr 25, 2026 - Apr 28, 2026',
		nights: '3 nights - 2 adults, 2 children',
		price: 'US$426',
		bookedDate: '26 Feb, 2026',
	},
	{
		id: 'r3',
		flag: '🇪🇸',
		name: 'Prescilia Loveara',
		phone: '4567893454',
		room: 'Standard Double Room',
		dateRange: 'Apr 7, 2026 - Apr 9, 2026',
		nights: '2 nights - 2 adults',
		price: 'US$84',
		bookedDate: '26 Feb, 2026',
	},
]
function HotelOwnerDashboard() {
	return (
		<div className="min-h-screen min-w-full text-slate-800">
			<div className="mx-auto flex min-h-screen w-auto flex-col gap-6 py-3">
				<Header />

				<main className="flex flex-1 flex-col gap-6">
					<section
						id="overview"
						className="grid gap-6 overflow-hidden border border-slate-200/80 bg-white/25 p-5 shadow-[0_28px_60px_rgba(20,40,60,0.12)] backdrop-blur md:grid-cols-[1.35fr_0.9fr] md:p-10"
						style={{
							backgroundImage:
								`linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.2)), linear-gradient(160deg, rgba(53,120,146,0.15), rgba(255,255,255,0.2)), url(${dashboardBackground})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
						}}
					>
						<div className="flex max-w-3xl flex-col justify-center gap-5 text-slate-900">
							<span className="text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-sky-800">Hotel owner dashboard</span>
							<h2 className="max-w-2xl text-4xl font-black leading-[0.98] text-slate-950 sm:text-5xl lg:text-6xl">
								Welcome Thilini, your resort is ready for a busy season.
							</h2>
							<p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
								Manage rooms, control availability, monitor bookings, and track revenue from one calm,
								resort-inspired workspace.
							</p>

							<div className="flex flex-wrap gap-3">
								<button className="inline-flex h-12 items-center gap-2 rounded-xl bg-sky-800 px-5 font-extrabold text-white shadow-lg shadow-sky-900/20 transition hover:bg-sky-900" type="button">
									Explore More <FaArrowRight />
								</button>
								<button className="inline-flex h-12 items-center gap-2 rounded-xl border border-sky-200 bg-white/90 px-5 font-extrabold text-sky-900 transition hover:border-sky-300 hover:bg-white" type="button">
									<FaPlus /> Add New Room
								</button>
							</div>

							<div className="flex flex-wrap gap-3 pt-1">
								<article style={{ minWidth: 150 }} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 backdrop-blur">
									<strong className="block text-2xl font-black text-slate-900">28</strong>
									<span className="text-sm text-slate-600">Active rooms</span>
								</article>
								<article style={{ minWidth: 150 }} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 backdrop-blur">
									<strong className="block text-2xl font-black text-slate-900">91%</strong>
									<span className="text-sm text-slate-600">Occupancy</span>
								</article>
								<article style={{ minWidth: 150 }} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 backdrop-blur">
									<strong className="block text-2xl font-black text-slate-900">12</strong>
									<span className="text-sm text-slate-600">New bookings</span>
								</article>
							</div>
						</div>

						<aside className="grid content-end gap-4">
							<div className="overflow-hidden rounded-3xl border border-white/60 bg-slate-950/40 p-5 text-white shadow-xl backdrop-blur-sm">
								<p className="text-sm font-semibold text-white/80">Today’s summary</p>
								<h3 className="mt-2 text-4xl font-black tracking-tight">LKR 184,200</h3>
								<p className="mt-2 text-sm text-white/80">Projected revenue for today</p>
							</div>

							<div className="grid grid-cols-3 gap-3 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg backdrop-blur">
								<div className="rounded-2xl bg-sky-50 p-3 text-center">
									<strong className="block text-2xl font-black text-slate-900">7</strong>
									<span className="text-xs font-semibold text-slate-500">Arrivals</span>
								</div>
								<div className="rounded-2xl bg-amber-50 p-3 text-center">
									<strong className="block text-2xl font-black text-slate-900">4</strong>
									<span className="text-xs font-semibold text-slate-500">Departures</span>
								</div>
								<div className="rounded-2xl bg-rose-50 p-3 text-center">
									<strong className="block text-2xl font-black text-slate-900">3</strong>
									<span className="text-xs font-semibold text-slate-500">Tasks</span>
								</div>
							</div>
						</aside>
					</section>



					{/* Hotel dashboard charts and revenue */}
                    <div className="pl-0">
                        <section className="grid gap-6 border border-sky-100 bg-sky-100/80 p-4 shadow-[0_24px_50px_rgba(20,40,60,0.08)] lg:grid-cols-[300px_1fr] lg:p-5">
                            <aside className="rounded-[22px] bg-white/95 p-4 shadow-sm">
                                <div className="mb-6 p-2">
                                    <h3 className="text-2xl font-black text-slate-900">Hotel Dashboard</h3>
                                    <p className="mt-1 text-sm text-slate-500">Manage your hotel operations and track performance</p>
                                </div>

                                <div className="mt-4 grid gap-3">
                                    {secondPartActions.map((action) => {
                                        const Icon = action.icon

                                        return (
                                            <button
                                                key={action.label}
                                                type="button"
                                                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-sky-200 hover:bg-sky-50"
                                            >
                                                <span className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-600">
                                                    <Icon className="text-xl" />
                                                </span>
                                                <span className="text-sm font-medium text-slate-700">{action.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </aside>

                            <div className="rounded-[22px] bg-sky-100 p-4 shadow-sm">
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                    {analyticsCards.map((card) => {
                                        const Icon = card.icon
                                        return (
                                            <div key={card.title} className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-xs text-slate-500">{card.title}</p>
                                                        <strong className="mt-1 block text-2xl font-black text-slate-900">{card.value}</strong>
                                                    </div>
                                                    <div className="grid h-8 w-8 place-items-center rounded-md bg-sky-50 text-sky-700">
                                                        <Icon className="text-sm" />
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-xs text-emerald-600">
                                                    {card.change} <span className="text-slate-500">vs last month</span>
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                                        <h4 className="text-lg font-bold text-slate-900">Revenue Analytics</h4>
                                        <div className="mt-4 flex h-64 items-end gap-2 rounded-2xl bg-slate-50 px-4 pb-4 pt-6">
                                            {revenueBars.map((bar) => (
                                                <div key={bar.month} className="flex flex-1 flex-col items-center justify-end gap-2">
                                                    <div className="w-full rounded-t-md bg-sky-700/85 shadow-sm" style={{ height: `${bar.value * 2}px` }} />
                                                    <span className="text-[11px] text-slate-500">{bar.month}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                                        <h4 className="text-lg font-bold text-slate-900">Booking Trends</h4>
                                        <div className="mt-4 flex h-64 items-end gap-5 rounded-2xl bg-slate-50 px-4 pb-4 pt-6">
                                            {bookingTrend.map((item) => (
                                                <div key={item.week} className="flex flex-1 flex-col items-center justify-end gap-3">
                                                    <div className="w-full rounded-t-md bg-transparent">
                                                        <div className="mx-auto w-1 rounded-full bg-green-600" style={{ height: `${item.value * 7}px` }} />
                                                    </div>
                                                    <span className="text-[11px] text-slate-500">{item.week}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

					<div className="pl-0">
                        <section className="relative overflow-hidden border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur pl-10" aria-label="Latest reservations">
                            <img
                                src={lotusDecoration}
                                alt="lotus decoration"
                                className="pointer-events-none absolute left-11 top-1/2 hidden h-115 w-auto -translate-x-1/4 -translate-y-1/2 opacity-45 md:block"
                            />
                            <div className="relative z-10">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-extrabold uppercase tracking-wide text-sky-700">Latest Reservations</p>
                                    <h3 className="text-2xl font-black text-slate-900">Recent bookings</h3>
                                </div>
                                <button className="inline-flex items-center gap-2 text-sm font-bold text-sky-700">View all <FaArrowRight /></button>
                            </div>

                            <div className="grid gap-6">
                                {latestReservations.map((r) => (
                                    <div key={r.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">{r.flag}</div>
                                            <div>
                                                <strong className="block text-lg font-black text-slate-900">{r.name}</strong>
                                                <a href="#" className="text-sm text-sky-600">{r.phone}</a>
                                                <p className="text-sm text-slate-500">{r.room}</p>
                                            </div>
                                        </div>
                                        <div className="text-center text-sm text-slate-600">
                                            <div>{r.dateRange}</div>
                                            <div className="mt-1 text-xs text-slate-500">{r.nights}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-extrabold text-slate-900">{r.price}</div>
                                            <div className="text-xs text-slate-500 mt-1">{r.bookedDate}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">‹ Back</button>
                            </div>
                            </div>
                        </section>
                    </div>

					<div className="pl-6 pr-2">
                        <section className="grid gap-4 md:grid-cols-3" aria-label="Quick actions">
                            {quickActions.map((action) => {
                                const Icon = action.icon

                                return (
                                    <article key={action.title} className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg">
                                        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${action.tone}`}>
                                            <Icon className="text-xl" />
                                        </div>
                                        <h3 className="text-lg font-extrabold text-slate-900">{action.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
                                    </article>
                                )
                            })}
                        </section>
                    

                        <section className="grid gap-6 lg:grid-cols-2 pt-6" aria-label="Rooms and availability">
                            <article id="rooms" className="rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur sm:p-6">
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-sky-700">Room overview</p>
                                        <h3 className="mt-1 text-2xl font-black text-slate-900">Rooms & packages</h3>
                                    </div>
                                    <button className="inline-flex items-center gap-2 font-extrabold text-sky-800 transition hover:text-sky-950" type="button">
                                        View all <FaArrowRight />
                                    </button>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {roomCards.map((room) => (
                                        <div key={room.name} className={`rounded-3xl border p-5 ${room.accent}`}>
                                            <div className="flex items-start justify-between gap-4">
                                                <h4 className="text-lg font-black text-slate-900">{room.name}</h4>
                                                <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${room.badge}`}>{room.status}</span>
                                            </div>
                                            <p className="mt-6 text-sm font-medium text-slate-600">{room.occupancy}</p>
                                            <strong className="mt-2 block text-xl font-black text-slate-900">{room.price}</strong>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article id="availability" className="rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur sm:p-6">
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-sky-700">Availability management</p>
                                        <h3 className="mt-1 text-2xl font-black text-slate-900">Live room status</h3>
                                    </div>
                                    <button className="inline-flex items-center gap-2 font-extrabold text-sky-800 transition hover:text-sky-950" type="button">
                                        Manage <FaArrowRight />
                                    </button>
                                </div>

                                <div className="grid gap-3">
                                    {roomCards.map((room) => (
                                        <div key={room.name} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                                            <div>
                                                <strong className="block text-base font-black text-slate-900">{room.name}</strong>
                                                <p className="mt-1 text-sm text-slate-500">{room.occupancy}</p>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${room.badge}`}>{room.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        </section>

                        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] pt-6" aria-label="Bookings and revenue">
                            <article id="bookings" className="rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur sm:p-6">
                                <div className="mb-5">
                                    <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-sky-700">Booking activity</p>
                                    <h3 className="mt-1 text-2xl font-black text-slate-900">Today’s timeline</h3>
                                </div>

                                <div className="grid gap-3">
                                    {bookingTimeline.map((item) => {
                                        const Icon = item.icon

                                        return (
                                            <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                                                <div className={`mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-slate-50 ${item.color}`}>
                                                    <Icon />
                                                </div>
                                                <div className="min-w-0">
                                                    <strong className="block text-sm font-black text-slate-900 sm:text-base">
                                                        {item.time} - {item.title}
                                                    </strong>
                                                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.note}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </article>

                            <article id="revenue" className="rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur sm:p-6">
                                <div className="mb-5">
                                    <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-sky-700">Revenue analyze</p>
                                    <h3 className="mt-1 text-2xl font-black text-slate-900">Performance snapshot</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                                            <span className="inline-flex items-center gap-2"><FaCircleCheck className="text-emerald-600" /> Occupancy</span>
                                            <span>91%</span>
                                        </div>
                                        <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[91%] rounded-full bg-linear-to-r from-amber-400 to-sky-700" /></div>
                                    </div>
                                    <div>
                                        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                                            <span className="inline-flex items-center gap-2"><FaChartLine className="text-sky-700" /> Daily revenue</span>
                                            <span>78%</span>
                                        </div>
                                        <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[78%] rounded-full bg-linear-to-r from-sky-500 to-cyan-700" /></div>
                                    </div>
                                    <div>
                                        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                                            <span className="inline-flex items-center gap-2"><FaStar className="text-amber-500" /> Guest satisfaction</span>
                                            <span>96%</span>
                                        </div>
                                        <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[96%] rounded-full bg-linear-to-r from-emerald-400 to-lime-500" /></div>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <strong className="block text-2xl font-black text-slate-900">LKR 2.1M</strong>
                                        <span className="mt-1 block text-sm text-slate-500">This month</span>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <strong className="block text-2xl font-black text-slate-900">4.8 / 5</strong>
                                        <span className="mt-1 block text-sm text-slate-500">Guest rating</span>
                                    </div>
                                </div>
                            </article>
                        </section>
                    </div>
				</main>

				<Footer />
			</div>
		</div>
	)
}

export default HotelOwnerDashboard