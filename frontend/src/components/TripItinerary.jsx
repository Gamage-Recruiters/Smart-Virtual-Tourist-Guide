
const TripItinerary = () => {

    const DAY1_IMGS = [
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200",
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200",
    ];
    const DAY2_IMGS = [
        "https://images.unsplash.com/photo-1546708973-b339540b5162?w=200",
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    ];

    const itineraryData = [
        {
            day: 1,
            date: "March 15, 2026 - Friday",
            location: "Colombo",
            items: [
                "Arrival at Bandaranaike Airport • 2:30 PM - 4:00 PM",
                "Check-in at Cinnamon Grand Hotel • 4:30 PM - 6:00 PM",
                "Gale Face Green sunset walk • 6:30 PM - 8:00 PM",
                "Dinner at Ministry of Crab • 8:30 PM"
            ],
            images: DAY1_IMGS
        },
        {
            day: 2,
            date: "March 16, 2026 - Saturday",
            location: "Kandy",
            items: [
                "Drive to Kandy (3.5 hours) • 8:00 AM - 11:30 AM",
                "Visit Temple of the Tooth • 12:00 PM - 2:00 PM",
                "Royal Botanical Gardens tour • 3:00 PM - 5:00 PM",
                "Cultural dance show • 7:00 PM"
            ],
            images: DAY2_IMGS
        }
    ];


    return (
        <section className="bg-white rounded-t-[32px] sm:rounded-t-[48px] rounded-b-none pt-6 px-6 pb-0 sm:pt-10 sm:px-10 md:pt-16 md:px-16 lg:pt-20 lg:px-20 w-full mb-0 !mt-0">

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-12">
                Trip Itinerary Overview
            </h3>

            <div className="relative pl-12 sm:pl-16 space-y-16 pb-2">
                <div className="absolute left-[24px] sm:left-[32px] top-5 bottom-[-55px] w-[1.5px] bg-gray-300" />

                {itineraryData.map((dayData) => (
                    <div key={dayData.day} className="relative">
                        <div className="absolute -left-10 sm:-left-12 top-1 w-8 h-8 rounded-full bg-[#E5E5E5] text-gray-600 text-xs sm:text-sm font-bold flex items-center justify-center border-4 border-white z-10">
                            {dayData.day}
                        </div>

                        <div>

                            <p className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl leading-tight">
                                {dayData.date}
                            </p>

                            <div className="flex items-center gap-1.5 mt-2 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2.5"
                                    stroke="currentColor"
                                    className="w-4 h-4 text-gray-500"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                <span className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">
                                    {dayData.location}
                                </span>
                            </div>

                            <ul className="space-y-2.5">
                                {dayData.items.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                                        <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex gap-3 mt-6 flex-wrap">
                                {dayData.images.map((imgSrc, imgIndex) => (
                                    <img
                                        key={imgIndex}
                                        src={imgSrc}
                                        alt=""
                                        className="w-20 sm:w-24 md:w-28 lg:w-32 h-28 sm:h-34 md:h-40 lg:h-46 rounded-[16px] object-cover shadow-sm hover:scale-105 transition-transform duration-300"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );

}

export default TripItinerary;