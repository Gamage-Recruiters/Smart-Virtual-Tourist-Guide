import React, { useEffect, useState } from 'react';

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 text-yellow-400"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const DestinationDetails = ({ destination, onBack }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Prevent errors if destination is missing
  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Destination details are not available.
        </p>
      </div>
    );
  }

  // Scroll to top when component opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ============================================================
  // CONVERT BACKEND DATA TO DISPLAY DATA
  // ============================================================

  // Hero image matches destination card primary image
  const heroImage =
    destination.heroImage ||
    (destination.images && destination.images[0]) ||
    destination.thumbnailImage ||
    destination.image;

  const title = destination.title || 'Destination';
  const location = destination.location || 'Sri Lanka';
  const rating = destination.rating ?? 'N/A';
  const reviews = destination.reviewCount ?? destination.reviews ?? 0;

  const price =
    destination.priceDisplay ||
    (destination.price !== undefined && destination.price !== null
      ? `Rs. ${destination.price}`
      : 'Price not available');

  const days =
    destination.durationDisplay ||
    (destination.duration !== undefined && destination.duration !== null
      ? `${destination.duration} Days`
      : destination.days || 'Duration not available');

  const travelers =
    destination.travelersDisplay ||
    (destination.travelersCount !== undefined && destination.travelersCount !== null
      ? `${destination.travelersCount}+ Travelers`
      : destination.travelers || 'Travelers information unavailable');

  // ============================================================
  // GALLERY IMAGES (Other images excluding hero)
  // ============================================================

  const rawImages = Array.isArray(destination.images)
    ? destination.images
    : typeof destination.images === 'string'
    ? destination.images.split(',').map((img) => img.trim())
    : [];

  const allValidImages = rawImages.filter(Boolean);

  // Filter out the hero image so it doesn't duplicate in the gallery
  const otherImages = allValidImages.filter((img) => img !== heroImage);

  // If thumbnail exists and is different from hero and not in gallery, add it
  if (
    destination.thumbnailImage &&
    destination.thumbnailImage !== heroImage &&
    !otherImages.includes(destination.thumbnailImage)
  ) {
    otherImages.push(destination.thumbnailImage);
  }

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowRight' && otherImages.length > 1) {
        setSelectedImageIndex((prev) =>
          prev === otherImages.length - 1 ? 0 : prev + 1
        );
      }
      if (e.key === 'ArrowLeft' && otherImages.length > 1) {
        setSelectedImageIndex((prev) =>
          prev === 0 ? otherImages.length - 1 : prev - 1
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, otherImages.length]);

  // ============================================================
  // HIGHLIGHTS
  // ============================================================

  const highlights =
    destination.features && destination.features.length > 0
      ? destination.features
      : [];

  // ============================================================
  // DESCRIPTION
  // ============================================================

  const shortDescription = destination.shortDescription;
  const longDescription =
    destination.longDescription || destination.description;

  return (
    <div className="min-h-screen bg-[#fbfcfd] text-gray-800 pb-20">
      {/* ============================================================
          BACK BUTTON
      ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
        >
          <span className="p-1 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
            <ArrowLeftIcon />
          </span>
          <span className="font-medium">Back to Destinations</span>
        </button>
      </div>

      {/* ============================================================
          HERO IMAGE
      ============================================================ */}
      <div className="relative w-full h-[450px] md:h-[500px] mt-4">
        {heroImage ? (
          <img
            src={heroImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Rating Badge */}
        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <StarIcon />
          <span className="text-sm font-medium text-gray-800">
            {rating} ({reviews} Reviews)
          </span>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 drop-shadow-sm">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-sm">
            {location}
          </p>
        </div>
      </div>

      {/* ============================================================
          DETAILS CONTENT
      ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ========================================================
              LEFT COLUMN
          ======================================================== */}
          <div className="space-y-8">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Price */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#5BA3F5]">
                    {price}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Per Person</div>
                </div>

                {/* Duration */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-700">
                    <ClockIcon />
                    <span>{destination.duration || days}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Duration</div>
                </div>

                {/* Travelers */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-700">
                    <UserIcon />
                    <span>{destination.travelersCount || travelers}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Travelers</div>
                </div>

                {/* Rating */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    ★ {rating}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {reviews} Reviews
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {(shortDescription || longDescription) && (
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  About This Destination
                </h2>

                {shortDescription && (
                  <p className="text-gray-700 font-medium leading-relaxed mb-6 text-lg italic">
                    {shortDescription}
                  </p>
                )}

                {longDescription &&
                  longDescription
                    .split('\n')
                    .filter((paragraph) => paragraph.trim() !== '')
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-gray-600 leading-relaxed mb-4"
                      >
                        {paragraph.trim()}
                      </p>
                    ))}
              </div>
            )}

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Tour Highlights
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-gray-600"
                    >
                      <span className="w-2 h-2 bg-[#5BA3F5] rounded-full flex-shrink-0"></span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT COLUMN
          ======================================================== */}
          <div className="space-y-6">
            {/* Book Now Card */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Book This Tour
              </h3>

              <p className="text-3xl font-bold text-[#5BA3F5] mb-4">{price}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium text-gray-700">{days}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Group Size</span>
                  <span className="font-medium text-gray-700">{travelers}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-gray-700">{location}</span>
                </div>
              </div>

              <button className="w-full bg-[#5BA3F5] hover:bg-[#4a92e4] text-white font-semibold py-3 px-6 rounded-full transition-colors cursor-pointer shadow-sm hover:shadow-md">
                Book Now
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Free cancellation available
              </p>
            </div>

            {/* What's Included */}
            {destination.bookingInfo &&
              destination.bookingInfo.includes &&
              destination.bookingInfo.includes.length > 0 && (
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    What's Included
                  </h4>
                  <ul className="space-y-2">
                    {destination.bookingInfo.includes.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <span className="text-green-500 text-lg flex-shrink-0">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Important Information */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-6">
              <h4 className="font-semibold text-gray-800 mb-3">
                Important Information
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {destination.currency && (
                  <li className="flex items-start gap-2">
                    <span className="text-[#5BA3F5] text-lg flex-shrink-0">•</span>
                    <span>Currency: {destination.currency}</span>
                  </li>
                )}

                {(destination.bestSeasonDisplay ||
                  (destination.bestSeason &&
                    destination.bestSeason.length > 0)) && (
                  <li className="flex items-start gap-2">
                    <span className="text-[#5BA3F5] text-lg flex-shrink-0">•</span>
                    <span>
                      Best Season:{' '}
                      {destination.bestSeasonDisplay ||
                        destination.bestSeason.join(', ')}
                    </span>
                  </li>
                )}

                {destination.bookingInfo &&
                  destination.bookingInfo.cancellationPolicy && (
                    <li className="flex items-start gap-2">
                      <span className="text-[#5BA3F5] text-lg flex-shrink-0">•</span>
                      <span>
                        Cancellation: {destination.bookingInfo.cancellationPolicy}
                      </span>
                    </li>
                  )}

                {destination.bookingInfo &&
                  destination.bookingInfo.excludes &&
                  destination.bookingInfo.excludes.length > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-[#5BA3F5] text-lg flex-shrink-0">•</span>
                      <span>
                        Excludes: {destination.bookingInfo.excludes.join(', ')}
                      </span>
                    </li>
                  )}

                {destination.bookingInfo &&
                  destination.bookingInfo.whatToBring &&
                  destination.bookingInfo.whatToBring.length > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-[#5BA3F5] text-lg flex-shrink-0">•</span>
                      <span>
                        Bring: {destination.bookingInfo.whatToBring.join(', ')}
                      </span>
                    </li>
                  )}

                {destination.bookingInfo &&
                  destination.bookingInfo.importantInfo && (
                    <li className="flex items-start gap-2 mt-4 text-gray-700 italic">
                      {destination.bookingInfo.importantInfo}
                    </li>
                  )}

                {/* Fallback if no specific info is provided */}
                {!destination.currency &&
                  !destination.bestSeason &&
                  (!destination.bookingInfo ||
                    Object.keys(destination.bookingInfo).length === 0) && (
                    <li className="flex items-start gap-2 text-gray-500">
                      No additional information available for this destination.
                    </li>
                  )}
              </ul>
            </div>
          </div>
        </div>

        {/* ============================================================
            DESTINATION PHOTO GALLERY (Other Images at bottom of page)
        ============================================================ */}
        {otherImages.length > 0 && (
          <div className="mt-16 bg-white rounded-3xl p-6 sm:p-10 shadow-[0_4px_25px_rgb(0,0,0,0.06)] border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-[#5BA3F5]"></span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#5BA3F5]">
                    Visual Experience
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Photo Gallery
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Explore additional views and moments from {title}
                </p>
              </div>

              <div className="self-start sm:self-auto bg-gray-50 text-gray-600 px-4 py-1.5 rounded-full text-xs font-semibold border border-gray-200/80 shadow-xs">
                {otherImages.length} Photo{otherImages.length === 1 ? '' : 's'}
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {otherImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className="group relative h-60 rounded-2xl overflow-hidden cursor-pointer bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <img
                    src={imgUrl}
                    alt={`${title} gallery photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      Photo {idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/90 text-gray-800 flex items-center justify-center shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
          FULLSCREEN LIGHTBOX MODAL
      ============================================================ */}
      {selectedImageIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImageIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-20 cursor-pointer"
            aria-label="Close preview"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-5 text-white/90 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium z-20">
            {selectedImageIndex + 1} / {otherImages.length}
          </div>

          {/* Previous Button */}
          {otherImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) =>
                  prev === 0 ? otherImages.length - 1 : prev - 1
                );
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/50 hover:bg-black/75 p-3 rounded-full backdrop-blur-sm transition-all z-20 cursor-pointer"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}

          {/* Active Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center select-none"
          >
            <img
              src={otherImages[selectedImageIndex]}
              alt={`${title} preview`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-white/90 text-sm mt-3 text-center font-medium bg-black/40 backdrop-blur-sm px-4 py-1 rounded-full">
              {title} — Photo {selectedImageIndex + 1}
            </p>
          </div>

          {/* Next Button */}
          {otherImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) =>
                  prev === otherImages.length - 1 ? 0 : prev + 1
                );
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/50 hover:bg-black/75 p-3 rounded-full backdrop-blur-sm transition-all z-20 cursor-pointer"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DestinationDetails;