import React from 'react';

const AuthLayout = ({
  children,
  leftImage,
  rightImage,
  leftConfig = {},
  rightConfig = {},
}) => {

  const leftStyle = {
    backgroundImage: leftImage ? `url(${leftImage})` : 'none',
    backgroundSize: leftConfig.size || 'cover',
    backgroundPosition: leftConfig.position || 'left top',
    opacity: leftConfig.opacity ?? 1,
    zIndex: leftConfig.zIndex ?? 20,
    filter: leftConfig.blur ? `blur(${leftConfig.blur}px)` : 'none',
    display: leftImage ? 'block' : 'none',
  };

  const rightStyle = {
    backgroundImage: rightImage ? `url(${rightImage})` : 'none',
    backgroundSize: rightConfig.size || 'cover',
    backgroundPosition: rightConfig.position || 'right top',
    opacity: rightConfig.opacity ?? 1,
    zIndex: rightConfig.zIndex ?? 0,
    filter: rightConfig.blur ? `blur(${rightConfig.blur}px)` : 'none',
    display: rightImage ? 'block' : 'none',
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#f4f8fc] overflow-hidden">
      <main className="relative min-h-[1200px] pt-1 overflow-hidden">

        {/* LEFT IMAGE */}
        <div
          className="absolute left-0 top-0 h-full bg-no-repeat"
          style={{ ...leftStyle, width: leftConfig.width || '100%' }}
        />

        {/* RIGHT IMAGE */}
        <div
          className="absolute right-0 top-0 h-full bg-no-repeat"
          style={{ ...rightStyle, width: rightConfig.width || '60%' }}
        />

        {/* CONTENT */}
        <div className="relative z-20 flex h-full">
          <div className="w-full lg:w-[45%] px-6 lg:px-12 pt-12">
            <div className="w-full max-w-[950px]">
              {children}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AuthLayout;
