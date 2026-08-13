import { useEffect, useState } from 'react';
import { getBookings } from '../../api/bookingApi';
import { useLocation } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const highlightId = location.state?.bookingId || null;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getBookings();
        if (mounted) setBookings(res.bookings || []);
      } catch (err) {
        setError(err.message || 'Failed to load bookings');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, []);

  if (loading) return <div className="p-6">Loading bookings...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-gray-600">You have no bookings yet.</p>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className={`p-4 border rounded-lg ${b._id === highlightId ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">Booking ID</div>
                <div className="font-mono font-semibold">{b._id}</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-semibold">{b.status}</div>
              </div>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-3">
              <div>
                <div className="text-sm text-gray-500">Service</div>
                <div className="font-medium">{b.service?.name || '—'}</div>
                {b.service?.location && <div className="text-sm text-gray-500">{b.service.location}</div>}
              </div>

              <div>
                <div className="text-sm text-gray-500">Customer</div>
                <div className="font-medium">{b.customer?.firstName} {b.customer?.lastName}</div>
                <div className="text-sm text-gray-500">{b.customer?.email}</div>
              </div>

                <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="font-medium">
                  {b.pricing?.currency} {
                    Number(
                      (b.pricing && b.pricing.total != null)
                        ? b.pricing.total
                        : (Array.isArray(b.pricing?.items) ? b.pricing.items.reduce((s, i) => s + Number(i.amount || 0), 0) : 0)
                    ).toFixed(2)
                  }
                </div>
                <div className="text-sm text-gray-500">{new Date(b.createdAt).toLocaleString()}</div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
