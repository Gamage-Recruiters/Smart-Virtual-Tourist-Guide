/* eslint-disable react-refresh/only-export-components */
import { Star } from 'lucide-react';

export const formatMoney = (value = 0, currency = 'LKR') => new Intl.NumberFormat('en-LK', {
  style: 'currency', currency, maximumFractionDigits: 2,
}).format(Number(value) || 0);

export const formatDate = (value) => value
  ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
  : 'Not set';

export function StatusBadge({ status = '' }) {
  const normalized = status.replaceAll('_', ' ');
  const tone = ['completed', 'confirmed', 'accepted', 'published', 'paid'].includes(status)
    ? 'green' : ['cancelled', 'rejected', 'withdrawn', 'suspended'].includes(status)
      ? 'red' : ['pending', 'receiving_bids', 'draft'].includes(status) ? 'amber' : '';
  return <span className={`guide-badge ${tone}`}>{normalized}</span>;
}

export function RatingDisplay({ rating = 0, count = null }) {
  return <span className="guide-rating"><Star size={15} fill="currentColor" /> {Number(rating).toFixed(1)} {count !== null && <small>({count})</small>}</span>;
}

export function LoadingState({ label = 'Loading…' }) {
  return <div className="guide-card guide-empty" role="status">{label}</div>;
}

export function EmptyState({ title = 'Nothing here yet', description, action }) {
  return <div className="guide-card guide-empty"><div><strong>{title}</strong>{description && <p>{description}</p>}{action}</div></div>;
}

export function ErrorMessage({ message }) {
  return message ? <div className="guide-error" role="alert">{message}</div> : null;
}

export function UserAvatar({ user, profile, className = '' }) {
  const src = profile?.avatarUrl || user?.avatarUrl;
  const name = user?.fullName || profile?.fullName || 'Guide';
  return src
    ? <img className={`guide-avatar ${className}`} src={src} alt={`${name} profile`} />
    : <div className={`guide-avatar ${className}`} aria-label={`${name} profile`}>{name.slice(0, 1).toUpperCase()}</div>;
}
