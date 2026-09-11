const reviews = [
  {
    id: 1,
    name: "Harindu Lakshan",
    time: "2 days ago",
    review:
      "Amazing resort with exceptional service. The ocean view from our suite was breathtaking, and the staff went above and beyond to make our stay memorable.",
  },

  {
    id: 2,
    name: "Ravindu Prabha",
    time: "1 week ago",
    review:
      "Beautiful location and great amenities. The pool area is stunning and the food at the restaurant was delicious.",
  },
];

export default function GuestReviews() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
          Guest Reviews
        </h2>

        <button className="text-blue-600 font-medium">
          View all reviews
        </button>
      </div>

      <div className="space-y-6">
        {reviews.map((item) => (
          <div
            key={item.id}
            className="border-b pb-6"
          >
            <h3 className="font-bold">{item.name}</h3>

            <div className="flex items-center gap-3 mt-1">
              <div className="text-yellow-400">
                ★★★★★
              </div>

              <span className="text-sm text-gray-500">
                {item.time}
              </span>
            </div>

            <p className="text-gray-600 leading-7 mt-4">
              {item.review}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
