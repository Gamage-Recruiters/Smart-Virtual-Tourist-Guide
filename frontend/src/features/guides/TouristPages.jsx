import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CalendarDays, Check, ShieldCheck, Star, Users } from 'lucide-react';
import apiClient from '../../services/api.js';
import beachHero from '../../assets/mirissa.jpg';
import fallbackCover from '../../assets/Sigiriya.jpg';
import galleryOne from '../../assets/Yala.jpg';
import galleryTwo from '../../assets/nature.png';
import galleryThree from '../../assets/SLFH.jpg';
import {
  EmptyState, ErrorMessage, formatDate, formatMoney, LoadingState,
  RatingDisplay, StatusBadge, UserAvatar,
} from './components.jsx';

const dateRange = (item) => `${formatDate(item?.startDate)} – ${formatDate(item?.endDate)}`;

function PageHeading({ title, subtitle, action }) {
  return <div className="guide-actions" style={{ justifyContent: 'space-between', alignItems: 'end', marginBottom: 24 }}>
    <div><h1 className="guide-title">{title}</h1>{subtitle && <p className="guide-subtitle">{subtitle}</p>}</div>{action}
  </div>;
}

export function TouristDashboard() {
  return <>
    <div className="guide-hero"><img src={beachHero} alt="Palm-lined Sri Lankan beach" /></div>
    <PageHeading title="Plan your Sri Lankan adventure" subtitle="Request a trusted local guide and manage every step in one place." />
    <div className="guide-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))' }}>
      <div className="guide-card guide-card-pad"><Users color="#1677ff" /><h2 style={{ fontWeight: 800, marginTop: 12 }}>Find a Guide</h2><p className="guide-subtitle">Explore local guide profiles and expertise.</p><Link className="guide-btn guide-btn-secondary" style={{ marginTop: 18 }} to="/dashboard-Tourist/guides">Browse guides</Link></div>
      <div className="guide-card guide-card-pad"><CalendarDays color="#1677ff" /><h2 style={{ fontWeight: 800, marginTop: 12 }}>Request a Guide</h2><p className="guide-subtitle">Post your real itinerary and receive tailored bids.</p><Link className="guide-btn guide-btn-primary" style={{ marginTop: 18 }} to="/dashboard-Tourist/guides/request">Create request</Link></div>
      <div className="guide-card guide-card-pad"><ShieldCheck color="#1677ff" /><h2 style={{ fontWeight: 800, marginTop: 12 }}>My Requests</h2><p className="guide-subtitle">Review offers and follow active bookings.</p><Link className="guide-btn guide-btn-secondary" style={{ marginTop: 18 }} to="/dashboard-Tourist/guides/requests">View requests</Link></div>
    </div>
  </>;
}

export function PublicGuidesPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    apiClient.get('/guides').then((data) => setGuides(data.guides || [])).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  if (loading) return <LoadingState label="Loading local guides…" />;
  return <><PageHeading title="Local Guides" subtitle="Browse real guide profiles or post a request for a tailored proposal." action={<Link className="guide-btn guide-btn-primary" to="/dashboard-Tourist/guides/request">Request a Guide</Link>} /><ErrorMessage message={error} />
    {!guides.length ? <EmptyState title="No guide profiles are available yet" description="Post a request so registered guides can send you proposals." /> : <div className="guide-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))' }}>{guides.map((guide) => <div className="guide-card guide-card-pad" key={guide._id}><UserAvatar user={guide} profile={guide} /><h2 style={{ fontWeight: 800, marginTop: 12 }}>{guide.fullName}</h2><RatingDisplay rating={guide.ratingAverage} count={guide.reviewCount} /><p className="guide-subtitle">{guide.professionalTitle}</p><div className="guide-tags">{guide.expertise.map((tag) => <span className="guide-tag" key={tag}>{tag}</span>)}</div><Link className="guide-btn guide-btn-secondary" to={`/dashboard-Tourist/guides/${guide._id}`}>View Profile</Link></div>)}</div>}
  </>;
}

const initialRequest = {
  destination: '', startDate: '', endDate: '', travelers: 1,
  languagePreference: 'English', guideTypes: [], budgetMin: '', budgetMax: '',
  specialRequirements: '', meetingLocation: '',
};

export function RequestGuidePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(initialRequest);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const preferredGuide = searchParams.get('preferredGuide');
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const toggleType = (type) => setForm((current) => ({ ...current, guideTypes: current.guideTypes.includes(type) ? current.guideTypes.filter((item) => item !== type) : [...current.guideTypes, type] }));
  const submit = async (event) => {
    event.preventDefault(); setError('');
    if (new Date(form.endDate) < new Date(form.startDate)) return setError('End date must be on or after the start date.');
    if (!form.guideTypes.length) return setError('Select at least one guide type.');
    setSubmitting(true);
    try {
      const data = await apiClient.post('/guides/requests', { ...form, travelers: Number(form.travelers), budgetMin: Number(form.budgetMin) || 0, budgetMax: Number(form.budgetMax), preferredGuide: preferredGuide || undefined });
      navigate(`/dashboard-Tourist/guides/requests/${data.request._id}/bids`);
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };
  return <>
    <div className="guide-hero"><img src={beachHero} alt="Tropical beach and palms in Sri Lanka" /></div>
    <PageHeading title="Request a Guide" subtitle="Find the perfect local expert for your Sri Lankan adventure." />
    <form className="guide-card guide-request-card" onSubmit={submit}>
      <ErrorMessage message={error} />
      {preferredGuide && <p className="guide-success" style={{ marginBottom: 18 }}>Your selected guide will be invited to this request.</p>}
      <div className="guide-form-grid">
        <div className="guide-field guide-span-2"><label htmlFor="destination">Destination</label><input id="destination" name="destination" value={form.destination} onChange={change} placeholder="e.g. Galle, Ella and Yala" required /></div>
        <div className="guide-field"><label htmlFor="startDate">Travel Dates</label><input id="startDate" name="startDate" type="date" value={form.startDate} onChange={change} required /></div>
        <div className="guide-field"><label htmlFor="endDate">End Date</label><input id="endDate" name="endDate" type="date" value={form.endDate} onChange={change} required /></div>
        <div className="guide-field"><label htmlFor="travelers">Number of Travelers</label><input id="travelers" name="travelers" type="number" min="1" max="100" value={form.travelers} onChange={change} required /></div>
        <div className="guide-field"><label htmlFor="languagePreference">Language Preference</label><select id="languagePreference" name="languagePreference" value={form.languagePreference} onChange={change}><option>English</option><option>Sinhala</option><option>Tamil</option><option>French</option><option>German</option><option>Spanish</option></select></div>
        <fieldset className="guide-span-2"><legend className="guide-label" style={{ marginBottom: 9 }}>Guide Type</legend><div className="guide-type-options">{['Cultural', 'Adventure', 'City', 'Nature'].map((type) => <label key={type}><input type="checkbox" checked={form.guideTypes.includes(type)} onChange={() => toggleType(type)} />{type}</label>)}</div></fieldset>
        <div className="guide-field"><label htmlFor="budgetMin">Budget Range (per day)</label><input id="budgetMin" name="budgetMin" type="number" min="0" value={form.budgetMin} onChange={change} placeholder="Minimum LKR" /></div>
        <div className="guide-field"><label htmlFor="budgetMax">Maximum Budget (LKR)</label><input id="budgetMax" name="budgetMax" type="number" min="0" value={form.budgetMax} onChange={change} placeholder="Maximum LKR" required /></div>
        <div className="guide-field guide-span-2"><label htmlFor="specialRequirements">Special Requirements</label><textarea id="specialRequirements" name="specialRequirements" rows="5" value={form.specialRequirements} onChange={change} placeholder="Accessibility, interests, dietary needs, or meeting preferences" /></div>
      </div>
      <button disabled={submitting} className="guide-btn guide-btn-primary" style={{ width: '100%', marginTop: 24 }} type="submit">{submitting ? 'Posting Request…' : 'Post Guide Request'}</button>
    </form>
  </>;
}

export function MyGuideRequestsPage() {
  const [requests, setRequests] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { apiClient.get('/guides/requests').then((data) => setRequests(data.requests || [])).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, []);
  if (loading) return <LoadingState label="Loading your guide requests…" />;
  return <><PageHeading title="My Guide Requests" subtitle="Track each itinerary and open the bids linked to the correct request." action={<Link className="guide-btn guide-btn-primary" to="/dashboard-Tourist/guides/request">New Request</Link>} /><ErrorMessage message={error} />
    {!requests.length ? <EmptyState title="You have not posted a guide request" action={<Link className="guide-btn guide-btn-primary" to="/dashboard-Tourist/guides/request">Request a Guide</Link>} /> : <div className="guide-grid">{requests.map((request) => <article className="guide-card guide-card-pad" key={request._id}><div className="guide-actions" style={{ justifyContent: 'space-between' }}><div><h2 style={{ fontWeight: 800, fontSize: 20 }}>{request.destination}</h2><p className="guide-subtitle">{dateRange(request)} · {request.travelers} traveler{request.travelers === 1 ? '' : 's'}</p></div><StatusBadge status={request.status} /></div><div className="guide-actions" style={{ marginTop: 18 }}><Link className="guide-btn guide-btn-secondary" to={`/dashboard-Tourist/guides/requests/${request._id}/bids`}>Open Bids</Link>{request.booking && <Link className="guide-btn guide-btn-primary" to={`/dashboard-Tourist/guides/bookings/${request.booking}`}>View Booking</Link>}</div></article>)}</div>}
  </>;
}

export function GuideBidsPage() {
  const { requestId } = useParams(); const [data, setData] = useState(null); const [error, setError] = useState(''); const [page, setPage] = useState(1);
  useEffect(() => { apiClient.get(`/guides/requests/${requestId}/bids?page=${page}`).then(setData).catch((err) => setError(err.message)); }, [page, requestId]);
  if (!data && !error) return <LoadingState label="Loading available guide proposals…" />;
  const request = data?.request; const bids = data?.bids || [];
  return <><PageHeading title="Available Guides" subtitle="Compare real proposals submitted for your trip." /><ErrorMessage message={error} />
    {request && <div className="guide-card guide-summary"><div><span>Destination</span><strong>{request.destination}</strong></div><div><span>Travelers</span><strong>{request.travelers}</strong></div><div><span>Dates</span><strong>{dateRange(request)}</strong></div></div>}
    {!bids.length ? <EmptyState title="No bids yet" description="Your request is open. Proposals from guides will appear here automatically." /> : bids.map((bid) => <article className="guide-card guide-bid-card" key={bid._id}><UserAvatar user={bid.guide} profile={bid.guide} /><div><div className="guide-actions"><h2 style={{ fontWeight: 800, fontSize: 19 }}>{bid.guide.fullName}</h2>{bid.guide.verified && <ShieldCheck size={17} color="#1782ee" aria-label="Verified guide" />}</div><RatingDisplay rating={bid.guide.ratingAverage} count={bid.guide.reviewCount} /><p className="guide-subtitle">{bid.guide.experienceYears} years experience</p><div className="guide-tags">{bid.guide.expertise.map((tag) => <span className="guide-tag" key={tag}>{tag}</span>)}</div><p style={{ lineHeight: 1.65 }}>{bid.proposal}</p></div><div className="guide-bid-price"><small style={{ color: '#7a8799', fontWeight: 700 }}>TOTAL BID</small><strong style={{ display: 'block', fontSize: 23, margin: '6px 0 16px' }}>{formatMoney(bid.amount, bid.currency)}</strong><div className="guide-grid" style={{ gap: 8 }}><Link className="guide-btn guide-btn-secondary" to={`/dashboard-Tourist/guides/${bid.guide._id}?requestId=${requestId}&bidId=${bid._id}`}>View Profile</Link><Link className="guide-btn guide-btn-primary" to={`/dashboard-Tourist/guides/requests/${requestId}/confirm/${bid._id}`}>Select Guide</Link></div></div></article>)}
    {data?.pagination?.pages > 1 && <div className="guide-pagination">{Array.from({ length: data.pagination.pages }, (_, index) => index + 1).map((number) => <button className={number === page ? 'active' : ''} onClick={() => setPage(number)} key={number}>{number}</button>)}</div>}
  </>;
}

export function GuideProfilePage() {
  const { guideId } = useParams(); const [searchParams] = useSearchParams(); const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { apiClient.get(`/guides/${guideId}`).then(setData).catch((err) => setError(err.message)); }, [guideId]);
  if (!data && !error) return <LoadingState label="Loading guide profile…" />;
  if (error) return <ErrorMessage message={error} />;
  const { guide, packages = [], reviews = [] } = data; const requestId = searchParams.get('requestId'); const bidId = searchParams.get('bidId');
  const cta = requestId && bidId ? `/dashboard-Tourist/guides/requests/${requestId}/confirm/${bidId}` : `/dashboard-Tourist/guides/request?preferredGuide=${guideId}`;
  const gallery = guide.gallery.length ? guide.gallery : [galleryOne, galleryTwo, galleryThree];
  return <><div className="guide-profile-hero"><img src={guide.coverImageUrl || fallbackCover} alt={`${guide.fullName} tour cover`} /></div><div className="guide-profile-head"><UserAvatar user={guide} profile={guide} /><div><h1 className="guide-title">{guide.fullName}</h1><RatingDisplay rating={guide.ratingAverage} count={guide.reviewCount} /><p>{guide.professionalTitle}</p></div></div>
    <div className="guide-profile-layout"><div><section className="guide-card guide-section"><h2>About</h2><p style={{ lineHeight: 1.75 }}>{guide.bio || 'This guide has not added a professional bio yet.'}</p></section><section className="guide-card guide-section"><h2>Languages Spoken</h2><div className="guide-tags">{guide.languages.length ? guide.languages.map((item) => <span className="guide-tag" key={item}>{item}</span>) : <span>Not provided</span>}</div></section><section className="guide-card guide-section"><h2>Experience Highlights</h2>{guide.highlights.length ? <ul>{guide.highlights.map((item) => <li key={item}>• {item}</li>)}</ul> : <p>No highlights added yet.</p>}</section><section className="guide-card guide-section"><h2>Tour Gallery</h2><div className="guide-gallery">{gallery.map((url, index) => <img key={`${url}-${index}`} src={url} alt={`${guide.fullName} tour gallery ${index + 1}`} />)}</div></section><section className="guide-card guide-section"><h2>Tourist Reviews</h2>{reviews.length ? reviews.map((review) => <article style={{ borderTop: '1px solid #edf1f6', padding: '15px 0' }} key={review._id}><strong>{review.tourist?.fullName || 'Tourist'}</strong><RatingDisplay rating={review.rating} /><p>{review.comment}</p></article>) : <p>No reviews yet.</p>}</section></div>
      <aside><div className="guide-card guide-order"><h2 style={{ fontSize: 20, fontWeight: 800 }}>Book this local expert</h2>{packages[0] ? <><p className="guide-subtitle">{packages[0].title}</p><strong style={{ fontSize: 24, display: 'block', margin: '16px 0' }}>{formatMoney(packages[0].pricePerPerson, packages[0].currency)} <small style={{ fontSize: 12 }}>/ person</small></strong><p>{packages[0].shortDescription}</p></> : <p className="guide-subtitle">Request a proposal for your dates, travelers, and destination.</p>}<div className="guide-tags">{guide.expertise.map((tag) => <span className="guide-tag" key={tag}>{tag}</span>)}</div><Link className="guide-btn guide-btn-primary" style={{ width: '100%', marginTop: 20 }} to={cta}>BOOK THIS GUIDE</Link></div></aside></div>
  </>;
}

export function ConfirmBookingPage() {
  const { requestId, bidId } = useParams(); const navigate = useNavigate(); const [data, setData] = useState(null); const [error, setError] = useState(''); const [method, setMethod] = useState('card'); const [submitting, setSubmitting] = useState(false);
  useEffect(() => { apiClient.get(`/guides/requests/${requestId}/bids/${bidId}/confirmation`).then((result) => setData(result.confirmation)).catch((err) => { if (err.data?.bookingId) navigate(`/dashboard-Tourist/guides/bookings/${err.data.bookingId}`, { replace: true }); else setError(err.message); }); }, [bidId, navigate, requestId]);
  const submit = async () => { setSubmitting(true); setError(''); try { const result = await apiClient.post('/guides/bookings', { requestId, bidId, paymentMethod: method }); navigate(`/dashboard-Tourist/guides/bookings/${result.booking._id}`); } catch (err) { setError(err.message); } finally { setSubmitting(false); } };
  if (!data && !error) return <LoadingState label="Preparing your booking…" />;
  if (!data) return <ErrorMessage message={error} />;
  const { request, bid } = data;
  return <><PageHeading title="Confirm and Pay" subtitle="Please review your trip details and choose a payment method." /><ErrorMessage message={error} /><div className="guide-confirm-layout"><div className="guide-grid"><section className="guide-card guide-card-pad"><h2 style={{ fontWeight: 800, fontSize: 20 }}>STEP 1 · Trip Details</h2><div className="guide-summary" style={{ padding: '18px 0', boxShadow: 'none', border: 0 }}><div><span>DATES</span><strong>{dateRange(request)}</strong></div><div><span>TRAVELERS</span><strong>{request.travelers}</strong></div><div><span>MEETING LOCATION</span><strong>{request.meetingLocation || request.destination}</strong></div></div></section><section className="guide-card guide-card-pad"><h2 style={{ fontWeight: 800, fontSize: 20 }}>STEP 2 · Payment Method</h2><label className="guide-payment-option"><input type="radio" checked={method === 'card'} onChange={() => setMethod('card')} /> <strong>Credit / Debit Card</strong>{method === 'card' && <div className="guide-form-grid" style={{ marginTop: 14 }}><div className="guide-field guide-span-2"><label>Card Number</label><input inputMode="numeric" placeholder="Shown for gateway-ready UI only" /></div><div className="guide-field"><label>Expiry Date</label><input placeholder="MM / YY" /></div><div className="guide-field"><label>CVV</label><input type="password" placeholder="•••" /></div><p className="guide-subtitle guide-span-2">No card details are sent to or stored by this application. Payment remains pending until a real gateway or manual settlement confirms it.</p></div>}</label><label className="guide-payment-option"><input type="radio" checked={method === 'paypal'} onChange={() => setMethod('paypal')} /> <strong>PayPal</strong></label><label className="guide-payment-option"><input type="radio" checked={method === 'bank_transfer'} onChange={() => setMethod('bank_transfer')} /> <strong>Bank Transfer</strong></label></section></div>
      <aside><div className="guide-card guide-order"><h2 style={{ fontWeight: 800, fontSize: 20 }}>Order Summary</h2><div className="guide-actions" style={{ margin: '18px 0' }}><UserAvatar user={bid.guide} profile={bid.guide} /><div><strong>{bid.guide.fullName}</strong><br /><RatingDisplay rating={bid.guide.ratingAverage} count={bid.guide.reviewCount} /></div></div><div className="guide-grid" style={{ gap: 12 }}><div className="guide-actions" style={{ justifyContent: 'space-between' }}><span>Guide bid</span><strong>{formatMoney(data.bidAmount, data.currency)}</strong></div><div className="guide-actions" style={{ justifyContent: 'space-between' }}><span>Service fee</span><strong>{formatMoney(data.serviceFee, data.currency)}</strong></div><div className="guide-actions" style={{ justifyContent: 'space-between' }}><span>Tax / VAT</span><strong>{formatMoney(data.tax, data.currency)}</strong></div><hr /><div className="guide-actions" style={{ justifyContent: 'space-between', fontSize: 18 }}><strong>Total</strong><strong>{formatMoney(data.total, data.currency)}</strong></div></div><button disabled={submitting} onClick={submit} className="guide-btn guide-btn-primary" style={{ width: '100%', marginTop: 22 }}>{submitting ? 'Confirming…' : 'Pay & Confirm Booking'}</button><p className="guide-subtitle" style={{ fontSize: 11, textAlign: 'center' }}>Creates a pending booking; it does not claim payment was processed.</p></div></aside></div>
  </>;
}

export function BookingConfirmedPage() {
  const { bookingId } = useParams(); const [booking, setBooking] = useState(null); const [error, setError] = useState('');
  useEffect(() => { apiClient.get(`/guides/bookings/${bookingId}`).then((data) => setBooking(data.booking)).catch((err) => setError(err.message)); }, [bookingId]);
  const download = () => {
    const receipt = `SMART VIRTUAL TOURIST GUIDE\nBooking reference: ${booking.bookingReference}\nGuide: ${booking.guide.fullName}\nTourist: ${booking.tourist.fullName}\nDestination: ${booking.destination}\nDates: ${dateRange(booking)}\nTravelers: ${booking.travelers}\nAmount: ${formatMoney(booking.total, booking.currency)}\nBooking status: ${booking.status}\nPayment status: ${booking.paymentStatus}\nGenerated: ${new Date().toLocaleString('en-GB')}\n`;
    const url = URL.createObjectURL(new Blob([receipt], { type: 'text/plain;charset=utf-8' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${booking.bookingReference}-receipt.txt`; anchor.click(); URL.revokeObjectURL(url);
  };
  if (!booking && !error) return <LoadingState label="Loading booking details…" />;
  if (!booking) return <ErrorMessage message={error} />;
  return <div className="guide-confirmed"><div className="guide-check"><Check /></div><h1 className="guide-title" style={{ marginTop: 18 }}>Booking Confirmed</h1><p className="guide-subtitle">Your request with {booking.guide.fullName} has been recorded. Payment is currently {booking.paymentStatus}.</p><div className="guide-card guide-card-pad" style={{ textAlign: 'left', marginTop: 28 }}><h2 style={{ fontWeight: 800, fontSize: 20 }}>Booking Details</h2><div className="guide-summary" style={{ padding: '20px 0', boxShadow: 'none', border: 0 }}><div><span>BOOKING ID</span><strong>{booking.bookingReference}</strong></div><div><span>GUIDE NAME</span><strong>{booking.guide.fullName}</strong></div><div><span>DATES</span><strong>{dateRange(booking)}</strong></div><div><span>TOTAL</span><strong>{formatMoney(booking.total, booking.currency)}</strong><StatusBadge status={booking.paymentStatus} /></div></div><div className="guide-actions"><button className="guide-btn guide-btn-primary" onClick={download}>Download the Slip</button>{booking.status === 'completed' && !booking.reviewedAt && <Link className="guide-btn guide-btn-secondary" to={`/dashboard-Tourist/guides/bookings/${bookingId}/review`}>Write a Review</Link>}</div></div></div>;
}

export function BookingReviewPage() {
  const { bookingId } = useParams(); const navigate = useNavigate(); const [booking, setBooking] = useState(null); const [rating, setRating] = useState(5); const [comment, setComment] = useState(''); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  useEffect(() => { apiClient.get(`/guides/bookings/${bookingId}`).then((data) => setBooking(data.booking)).catch((err) => setError(err.message)); }, [bookingId]);
  if (booking?.reviewedAt) return <><PageHeading title="Review Submitted" subtitle="This booking has already been reviewed." /><EmptyState title="Thank you for sharing your experience" action={<Link className="guide-btn guide-btn-primary" to={`/dashboard-Tourist/guides/${booking.guide._id}`}>View Guide Profile</Link>} /></>;
  const submit = async (event) => { event.preventDefault(); setSubmitting(true); setError(''); try { await apiClient.post(`/guides/bookings/${bookingId}/reviews`, { rating, comment }); navigate(`/dashboard-Tourist/guides/${booking.guide._id}`); } catch (err) { setError(err.message); } finally { setSubmitting(false); } };
  if (!booking && !error) return <LoadingState label="Checking review eligibility…" />;
  return <><PageHeading title="Review Your Guide" subtitle={booking ? `Share your experience with ${booking.guide.fullName}.` : ''} /><form onSubmit={submit} className="guide-card guide-request-card"><ErrorMessage message={error} /><div className="guide-field"><label>Rating (1–5)</label><div className="guide-actions">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} onClick={() => setRating(value)} aria-label={`${value} stars`} style={{ color: value <= rating ? '#f6a800' : '#ccd3dc' }}><Star fill="currentColor" /></button>)}</div></div><div className="guide-field" style={{ marginTop: 18 }}><label htmlFor="comment">Review / Comment</label><textarea id="comment" rows="6" value={comment} onChange={(event) => setComment(event.target.value)} required /></div><button disabled={submitting || !booking || booking.status !== 'completed'} className="guide-btn guide-btn-primary" style={{ width: '100%', marginTop: 20 }}>{submitting ? 'Submitting…' : 'Submit Review'}</button>{booking && booking.status !== 'completed' && <p className="guide-subtitle">Reviews become available after the guide marks the booking completed.</p>}</form></>;
}
