
const TripHighlights = () => {

    const stats = [
        {
            icon: <span className="text-4xl md:text-5xl">🗺️</span>, 
            value: "127 km",
            label: "Distance Traveled"
        },
        {
            icon: <span className="text-4xl md:text-5xl">🍽️</span>, 
            value: "23",
            label: "Local Food Tried"
        },
        {

            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-[#1C2C3F]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
            ),
            value: "15",
            label: "Places Visited"
        },
        {
            icon: <span className="text-4xl md:text-5xl">📸</span>, 
            value: "342",
            label: "Photos Taken"
        }
    ];

    return (
        <section className="bg-white rounded-none pt-6 px-6 pb-0 sm:pt-10 sm:px-10 md:pt-16 md:px-16 lg:pt-20 lg:px-20 w-full mb-0 !mt-0">

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-10">
                Trip Highlights & Statistics
            </h3>

            <div className="grid grid-cols-2 gap-5 sm:gap-6 md:gap-8">
                {stats.map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-gradient-to-b from-[#EBF6FF] to-[#BFE4FC] rounded-[24px] p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-sm border border-[#A2D5FF]/20 hover:shadow-md transition-all duration-300"
                    >

                        <div className="flex items-center justify-center h-14 sm:h-16 w-14 sm:w-16 mb-1">
                            {item.icon}
                        </div>

                        <p className="text-2xl sm:text-3xl md:text-[36px] lg:text-[40px] font-black text-[#1C2C3F] leading-none mt-3 sm:mt-4">
                            {item.value}
                        </p>

                        <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-[#4C6B8B] mt-1 sm:mt-2">
                            {item.label}
                        </p>
                    </div>
                ))}
            </div>

        </section>
    );
}

export default TripHighlights