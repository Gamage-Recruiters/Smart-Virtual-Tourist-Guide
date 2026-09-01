export default function CheckAvailability() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      {/* Price */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-bold text-blue-700">
            $150
          </h2>

          <div className="text-yellow-400 mt-1">★★★★★</div>

          <p className="text-gray-500 text-sm">
            4.8 (3,824 reviews)
          </p>
        </div>

        <span className="text-gray-500 text-sm">per night</span>
      </div>

      {/* Inputs */}
      <div className="space-y-5 mt-6">
        <div>
          <label className="text-sm font-medium">Check-in</label>

          <input
            type="date"
            className="w-full border rounded-lg px-4 py-3 mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Check-out</label>

          <input
            type="date"
            className="w-full border rounded-lg px-4 py-3 mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Guests</label>

          <select className="w-full border rounded-lg px-4 py-3 mt-2">
            <option>1 Guest</option>
            <option>2 Guests</option>
            <option>Family</option>
          </select>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-medium">
          Check Availability
        </button>
      </div>

      {/* Price Breakdown */}
      <div className="border-t mt-6 pt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span>$150 × 3 nights</span>
          <span>$450</span>
        </div>

        <div className="flex justify-between">
          <span>Service fee</span>
          <span>$25</span>
        </div>

        <div className="flex justify-between">
          <span>Taxes</span>
          <span>$35</span>
        </div>

        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span>$510</span>
        </div>
      </div>
    </div>
  );
}