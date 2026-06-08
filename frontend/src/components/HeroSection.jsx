import BANNER_SRC from './../assets/welcome.jpg';

const HeroSection = () => {
    return (
        <section className="relative w-full h-[370px] sm:h-[470px] md:h-[570px] lg:h-[670px] overflow-hidden font-sans">
        {/* Background Image */}
        <img
          src={BANNER_SRC}
          alt="Sri Lanka scenery with family"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Content Container */}
        <div className="absolute inset-0 flex items-center justify-end px-6 sm:pl-12 md:pr-28 lg:pr-44 xl:pr-56">
          <div className="text-left max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide drop-shadow-md whitespace-nowrap">
              Welcome Mendaka !
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal mt-2 sm:mt-3 opacity-95 tracking-wide drop-shadow-sm">
              Finally Your Complete Trip Report
            </p>

            <div className="mt-5 sm:mt-6">
              <button className="px-5 py-2 sm:px-6 sm:py-2.5 border border-white text-xs sm:text-sm font-medium tracking-wider bg-transparent hover:bg-white hover:text-black transition-all duration-300">
                Explore More...
              </button>
            </div>
          </div>
        </div>
      </section>
    );
}

export default HeroSection;