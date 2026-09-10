export default function HotelGallery({ images }) {
  return (
    <div>
      {/* Main Image */}
      <img
        src={images[0]}
        alt=""
        className="w-full h-[420px] object-cover rounded-2xl"
      />

      {/* Thumbnails */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <img
          src={images[1]}
          alt=""
          className="h-[180px] w-full object-cover rounded-xl"
        />

        <img
          src={images[2]}
          alt=""
          className="h-[180px] w-full object-cover rounded-xl"
        />
      </div>

      <button className="text-blue-600 text-sm mt-4 font-medium">
        View all 24 photos
      </button>
    </div>
  );
}