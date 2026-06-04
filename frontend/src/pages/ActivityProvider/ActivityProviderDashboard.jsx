import Sidebar from '../../components/ActivityProviderSidebar';
import { FiUsers, FiMap, FiCalendar } from 'react-icons/fi';

const Stat = ({ title, value, icon }) => (
	<div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
		<div className="p-3 rounded-lg bg-blue-50 text-blue-600">{icon}</div>
		<div>
			<div className="text-sm text-gray-500">{title}</div>
			<div className="text-xl font-semibold">{value}</div>
		</div>
	</div>
);

const ActivityProviderDashboard = () => {
	return (
		<div className="min-h-screen bg-slate-100 flex">
			<Sidebar />

			<main className="flex-1 p-6">
				<header className="mb-6">
					<h1 className="text-2xl font-semibold">Provider Dashboard</h1>
					<p className="text-sm text-gray-600 mt-1">Overview of your activities and bookings</p>
				</header>

				<section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<Stat title="Total Activities" value="12" icon={<FiMap className="w-5 h-5" />} />
					<Stat title="Upcoming Bookings" value="5" icon={<FiCalendar className="w-5 h-5" />} />
					<Stat title="Participants" value="128" icon={<FiUsers className="w-5 h-5" />} />
				</section>

				<section className="bg-white rounded-lg shadow p-4">
					<h2 className="text-lg font-medium mb-2">Recent Activity</h2>
					<p className="text-sm text-gray-500">This area can show recent bookings, edits, or messages. Use the ActivityList component to render a full list.</p>
				</section>
			</main>
		</div>
	);
};

export default ActivityProviderDashboard;

