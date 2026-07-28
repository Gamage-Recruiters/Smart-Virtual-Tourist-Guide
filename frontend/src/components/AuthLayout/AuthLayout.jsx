import React from 'react';

const AuthLayout = ({
  children,
  rightImage,
  leftImage,
  rightConfig = {},
  leftConfig = {},
}) => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-gray-50 overflow-hidden py-10 px-4">
      {leftImage && (
        <div
          className="absolute inset-0 bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url(${leftImage})`,
            backgroundPosition: leftConfig.position || 'left top',
            backgroundSize: leftConfig.size || 'cover',
            width: leftConfig.width || '100%',
            zIndex: leftConfig.zIndex !== undefined ? leftConfig.zIndex : 0,
          }}
        />
      )}
      {rightImage && (
        <div
          className="absolute inset-0 bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url(${rightImage})`,
            backgroundPosition: rightConfig.position || 'right top',
            backgroundSize: rightConfig.size || 'cover',
            width: rightConfig.width || '50%',
            right: 0,
            left: 'auto',
            zIndex: rightConfig.zIndex !== undefined ? rightConfig.zIndex : 0,
          }}
        />
      )}
      <div className="relative z-30 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
