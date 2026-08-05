import React, { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';

import BookingFilterTabs from '../../components/Guide/bookings/BookingFilterTabs';
import BookingRequestsTable from '../../components/Guide/bookings/BookingRequestsTable';

const sampleBookings = [
  {
    id: 'b-101',
    touristName: 'Julianne Moore',
    initials: 'JM',
    tourPackage: 'Sigiriya & Kandy Culture',
    dateRange: 'Oct 12 – Oct 20',
    travelers: '2 Adults',
    totalPrice: 45000,
    status: 'Pending',
  },
  {
    id: 'b-102',
    touristName: 'Robert K.',
    initials: 'RK',
    tourPackage: 'Ella Scenic Train Journey',
    dateRange: 'Nov 05 – Nov 12',
    travelers: '4 Adults, 2 Kids',
    totalPrice: 30000,
    status: 'Confirmed',
  },
  {
    id: 'b-103',
    touristName: 'Sarah Low',
    initials: 'SL',
    tourPackage: 'Mirissa Whale Watching',
    dateRange: 'Dec 15 – Dec 20',
    travelers: '1 Adult',
    totalPrice: 50000,
    status: 'Cancelled',
  },
  {
    id: 'b-104',
    touristName: 'Tom Davis',
    initials: 'TD',
    tourPackage: 'Yala Safari Adventure',
    dateRange: 'Oct 25 – Oct 28',
    travelers: '2 Adults',
    totalPrice: 15000,
    status: 'Pending',
  },
  {
    id: 'b-105',
    touristName: 'Emma Watson',
    initials: 'EW',
    tourPackage: 'Galle Fort Explorer',
    dateRange: 'Oct 15 – Oct 17',
    travelers: '2 Adults',
    totalPrice: 75000,
    status: 'Confirmed',
  },
];

const BookingRequests = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const statusParam = activeFilter.toLowerCase();
        const res = await fetch(`/api/guides/current/bookings?status=${statusParam}&page=${currentPage}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || data);
          if (data.totalPages) setTotalPages(data.totalPages);
        } else {
          throw new Error('API fetch failed');
        }
      } catch {
        // Fallback filter over sample data
        let filtered = sampleBookings;
        if (activeFilter !== 'All') {
          filtered = sampleBookings.filter(
            (b) => b.status.toLowerCase() === activeFilter.toLowerCase()
          );
        }
        setBookings(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [activeFilter, currentPage]);

  const handleApprove = async (id) => {
    try {
      await fetch(`/api/guides/current/bookings/${id}/approve`, { method: 'PATCH' });
    } catch {
      // Ignore network errors for local state update fallback
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Confirmed' } : b))
    );
  };

  const handleReject = async (id) => {
    try {
      await fetch(`/api/guides/current/bookings/${id}/reject`, { method: 'PATCH' });
    } catch {
      // Ignore network errors for local state update fallback
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );
  };

  const handleViewDetails = (booking) => {
    alert(`Viewing details for ${booking.touristName} (${booking.tourPackage})`);
  };

  return (
    <PageWrapper activeNavItem="Booking Requests">
      <div className="space-y-6">
        {/* Page Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Booking Requests</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and manage tour inquiry status for the upcoming season.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <BookingFilterTabs activeFilter={activeFilter} onSelectFilter={(f) => { setActiveFilter(f); setCurrentPage(1); }} />
            <Button variant="outline" className="flex items-center gap-1.5 whitespace-nowrap">
              <SlidersHorizontal className="w-4 h-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <BookingRequestsTable
            bookings={bookings}
            onApprove={handleApprove}
            onReject={handleReject}
            onViewDetails={handleViewDetails}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default BookingRequests;
