import React from 'react';
import Avatar from '../common/Avatar';
import TagPill from '../common/TagPill';
import Button from '../common/Button';
import RatingBadge from './RatingBadge';

/**
 * Reusable GuideBidCard Component
 * @param {Object} guide - Guide bid object
 * @param {Function} onEditInfo - Callback handler when Edit Info is clicked
 */
export const GuideBidCard = ({ guide, onEditInfo }) => {
  const {
    id,
    name,
    avatarUrl,
    avatarInitials,
    rating,
    reviewCount,
    yearsExperience,
    specialties = [],
    pitch,
    totalBid,
    verified = true,
  } = guide;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5">
      {/* Left & Middle Info Container */}
      <div className="flex items-start gap-4 flex-1">
        {/* Avatar */}
        <Avatar src={avatarUrl} name={name} initials={avatarInitials} verified={verified} size="lg" />

        {/* Details */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-base font-bold text-slate-900 leading-snug">{name}</h3>
            <RatingBadge rating={rating} reviewCount={reviewCount} yearsExperience={yearsExperience} />
          </div>

          {/* Specialty Pills */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {specialties.map((specialty, idx) => (
              <TagPill key={idx} label={specialty} />
            ))}
          </div>

          {/* Testimonial / Pitch */}
          {pitch && (
            <div className="flex items-start gap-2 pt-1">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-xs text-slate-500 italic leading-relaxed line-clamp-2">
                "{pitch}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Bid Info & Action */}
      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-3 min-w-[140px]">
        <div className="text-left md:text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Bid
          </span>
          <span className="text-lg font-black text-slate-900 tracking-tight">
            LKR {typeof totalBid === 'number' ? totalBid.toLocaleString() : totalBid}
          </span>
        </div>
        <Button variant="solid" onClick={() => onEditInfo && onEditInfo(guide)}>
          Edit Info
        </Button>
      </div>
    </div>
  );
};

export const GuideBidList = ({ guides = [], onEditInfo }) => (
  <div className="space-y-4">
    {guides.map((guide) => (
      <GuideBidCard key={guide.id || guide._id} guide={guide} onEditInfo={onEditInfo} />
    ))}
  </div>
);

export default GuideBidCard;
