export default function DriverFilter() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-8">
        Filter Drivers
      </h2>

      {/* Trip Date */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Trip Date
        </label>

        <input
          type="date"
          className="w-full border rounded-lg px-4 py-3 outline-none"
        />
      </div>

      {/* Duration */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Duration (Days)
        </label>

        <input
          type="number"
          placeholder="Enter days"
          className="w-full border rounded-lg px-4 py-3 outline-none"
        />
      </div>

      {/* Price */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-4">
          Price Range (per day)
        </label>

        <input type="range" className="w-full" />

        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>$0</span>
          <span>$200</span>
        </div>
      </div>

      {/* Vehicle */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">
          Vehicle Type
        </label>

        <select className="w-full border rounded-lg px-4 py-3 outline-none">
          <option>All Vehicles</option>
          <option>Toyota SUV</option>
          <option>Mercedes Van</option>
          <option>Honda Sedan</option>
          <option>Nissan SUV</option>
        </select>
      </div>

      {/* Rating */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-4">
          Rating
        </label>

        <div className="space-y-3">
          {["4.5+", "4.0+", "3.5+"].map((rate) => (
            <label
              key={rate}
              className="flex items-center gap-3"
            >
              <input type="radio" name="rating" />

              <span className="text-yellow-500">★</span>

              <span>{rate}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-medium">
        Apply Filters
      </button>
    </div>
  );
}