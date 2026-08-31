import React from 'react';

export default function TurnBanner({ navArrived, currentTurnInstruction, bannerTitle, navDistance }) {
  const instruction = (currentTurnInstruction || bannerTitle || '').toLowerCase();
  const isLeft = instruction.includes('left');
  const isStraight = instruction.includes('straight') || instruction.includes('continue');

  return (
    <div className="absolute left-1/2 top-6 z-20 w-[90%] max-w-[720px] -translate-x-1/2">
      <div className="flex items-center gap-5 rounded-lg bg-white p-2 shadow-lg">
        <div className="flex h-[70px] w-[110px] shrink-0 items-center justify-center rounded-[4px] bg-white">
          {(() => {
            if (navArrived) {
              return (
                <svg width="45" height="45" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              );
            }
            
            if (isStraight) {
              return (
                <svg width="45" height="45" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 10H9V22H15V10H20L12 2Z" />
                </svg>
              );
            }
            
            return (
              <svg width="45" height="45" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg" style={{ transform: isLeft ? 'scaleX(-1)' : 'none' }}>
                <path d="M8 21V10C8 8.34315 9.34315 7 11 7H15V2L23 8.5L15 15V10H11V21H8Z" />
              </svg>
            );
          })()}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <span className="text-2xl font-bold text-black tracking-tight sm:text-3xl">
            {navArrived ? 'Arrived at destination' : (
              currentTurnInstruction 
                ? `${currentTurnInstruction}${navDistance ? ` in ${navDistance}` : ''}`
                : bannerTitle
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
