import { Link } from 'react-router-dom';
import { FiMapPin, FiFileText, FiEye, FiCheck, FiX, FiStar } from 'react-icons/fi';
import ListingFallbackImage from '../../assets/Admin/Listing_Management.png';

const ListingCard = ({ listing, onApprove, onReject }) => {
  const tags = Array.isArray(listing.tags) ? listing.tags : [];
  const visibleTags = tags.slice(0, 3);
  const additionalTagCount = Math.max(tags.length - visibleTags.length, 0);
  const listingImage = listing.imageUrl || listing.images?.[0] || ListingFallbackImage;
  const providerInitial = listing.providerInitial || listing.providerName?.charAt(0).toUpperCase() || '?';
  const formattedPrice = typeof listing.price === 'number' ? `$${listing.price}` : listing.price;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <article className="relative mx-auto flex w-full max-w-[1166px] flex-col overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(46,92,136,0.08)] transition-shadow hover:shadow-md lg:min-h-[430px] lg:flex-row">

      {/* Status Badge overlay */}
      <div className="absolute left-4 top-4 z-10">
         <span className={`rounded-full px-3 py-1 text-[11px] font-semibold shadow-sm ${
           listing.status === 'Approved' ? 'bg-green-100 text-green-700' :
           listing.status === 'Rejected' ? 'bg-red-100 text-red-700' :
           'bg-yellow-100 text-yellow-700'
         }`}>
           {listing.status.toUpperCase()}
         </span>
      </div>

      {/* Image Section */}
      <div className="h-64 bg-slate-100 sm:h-80 lg:h-auto lg:w-[44%]">
        <img
          src={listingImage}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 lg:w-[56%] lg:p-6">

        <div>
          <div className="mb-3 flex items-start justify-between gap-4">
            <h2 className="pr-3 text-[19px] font-medium leading-tight text-[#111111] sm:text-[21px]">{listing.title}</h2>
            {listing.rating != null && (
              <div className="flex shrink-0 items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[12px] font-medium text-slate-700">
                <FiStar className="fill-current text-yellow-400" /> {listing.rating}
              </div>
            )}
          </div>

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A0DBFF] text-[13px] font-semibold text-white">
                {providerInitial}
              </div>
              <span className="text-[13px] font-medium text-[#111111]">{listing.providerName}</span>
            </div>
            {listing.since && <span className="text-[11px] font-medium text-slate-600">Since {listing.since}</span>}
          </div>

          <p className="mb-5 line-clamp-3 text-[12px] leading-relaxed text-slate-700 sm:text-[13px]">
            {listing.description || 'No description provided.'}
          </p>
        </div>

        <div>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#111111]">
                <FiMapPin className="text-gray-500" size={16} /> {listing.location}
              </div>
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#111111]">
                <FiFileText className="text-gray-500" size={16} /> Submitted {formatDate(listing.createdAt)}
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-3">
              <span className="text-[12px] font-semibold text-[#111111]">{formattedPrice}</span>
              {listing.verificationScore && <span className="text-[12px] font-medium text-[#1877F2]">{listing.verificationScore}</span>}
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-5 border-t border-slate-100 pt-4 md:flex-row md:items-center">

            <div className="flex flex-wrap gap-2">
              {visibleTags.map((tag, index) => (
                <span key={`${tag}-${index}`} className="rounded-[5px] bg-[#A0DBFF] px-3 py-1.5 text-[11px] font-medium text-[#2E5C88]">
                  {tag}
                </span>
              ))}
              {additionalTagCount > 0 && (
                <span className="rounded-[5px] border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-medium text-[#111111]">
                  +{additionalTagCount} more
                </span>
              )}
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
              <Link to={`/admin/view-details/${listing._id}`} className="flex-1 md:flex-none">
                <button className="flex w-full items-center justify-center gap-2 rounded-[5px] border border-slate-300 bg-white px-4 py-2 text-[11px] font-medium text-[#111111] transition-colors hover:bg-slate-50">
                  <FiEye size={14} /> View Full Details
                </button>
              </Link>

              {/* Approve Button */}
              {listing.status !== 'Approved' && (
                <button
                  onClick={() => onApprove(listing._id, listing.providerName)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-[5px] bg-[#0075FF] px-5 py-2 text-[11px] font-medium text-white transition-colors hover:bg-blue-600 md:flex-none"
                >
                  <FiCheck size={14} /> Approve
                </button>
              )}

              {/* Reject Button */}
              {listing.status !== 'Rejected' && (
                <button
                  onClick={() => onReject(listing._id, listing.providerName)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-[5px] bg-[#357107] px-5 py-2 text-[11px] font-medium text-white transition-colors hover:bg-[#2d6206] md:flex-none"
                >
                  <FiX size={14} /> Reject
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </article>
  );
};

export default ListingCard;
