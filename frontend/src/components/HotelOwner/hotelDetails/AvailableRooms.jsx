const rooms = [
  {
    id: 1,
    name: "Ocean View Suite",
    details: "King bed • Ocean view • 45 m²",
    price: 180,
    left: "Only 2 rooms left",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },

  {
    id: 2,
    name: "Deluxe Garden Room",
    details: "Twin beds • Garden view • 35 m²",
    price: 120,
    left: "5 rooms available",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  },
];

export default function AvailableRooms() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Available Rooms
      </h2>

      <div className="space-y-5">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl p-4 shadow-md flex gap-5"
          >
            <img
              src={room.image}
              alt="" 
              className="w-[180px] h-[140px] rounded-xl object-cover"
            />

            <div className="flex-1 flex justify-between items-center">
              {/* Details */}
              <div>
                <h3 className="text-xl font-bold">
                  {room.name}
                </h3>

                <p className="text-gray-500 mt-1">
                  {room.details}
                </p>

                <div className="flex gap-5 text-sm text-blue-600 mt-4">
                  <span>Free Wi-Fi</span>
                  <span>Balcony</span>
                  <span>Mini Bar</span>
                </div>

                <p className="text-green-600 mt-4 font-medium">
                  {room.left}
                </p>
              </div>

              {/* Price */}
              <div className="text-right">
                <h3 className="text-3xl font-bold text-blue-700">
                  ${room.price}
                </h3>

                <p className="text-gray-500 text-sm">
                  per night
                </p>

                <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg mt-5">
                  Select Room
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}