import React from 'react';

export default function TurnBanner({
  navArrived,
  currentTurnInstruction,
  bannerTitle,
  navDistance,
  stepIndex = 1,
  totalSteps = 0,
  onPrevStep,
  onNextStep,
}) {
  const instruction = (currentTurnInstruction || bannerTitle || '').toLowerCase();
  const isLeft = instruction.includes('left');
  const isUturn = instruction.includes('u-turn') || instruction.includes('uturn');
  const isRoundabout = instruction.includes('roundabout') || instruction.includes('rotary');
  const isStraight = !isLeft && !isUturn && !isRoundabout && (
    instruction.includes('straight') ||
    instruction.includes('continue') ||
    instruction.includes('head')
  );

  return (
    <div className="absolute left-1/2 top-6 z-[1100] w-[92%] max-w-[760px] -translate-x-1/2">
      <div className="flex items-center gap-4 sm:gap-5 rounded-xl bg-white/95 p-3 sm:p-4 shadow-xl border border-gray-100 backdrop-blur-sm">
        {/* Direction Icon Box */}
        <div className="flex h-[72px] w-[80px] sm:w-[96px] shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {(() => {
            if (navArrived) {
              return (
                <svg width="42" height="42" viewBox="0 0 24 24" fill="#E53E3E" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              );
            }

            if (isUturn) {
              return (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 10 4 15 9 20" />
                  <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                </svg>
              );
            }

            if (isRoundabout) {
              return (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.57 2.6L21 8" />
                  <polyline points="21 3 21 8 16 8" />
                </svg>
              );
            }

            if (isStraight) {
              return (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              );
            }

            // Turn arrow (Left or Right)
            return (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1A73E8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: isLeft ? 'scaleX(-1)' : 'none' }}
              >
                <path d="M14 4h6v6" />
                <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
              </svg>
            );
          })()}
        </div>

        {/* Text Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          {totalSteps > 1 && (
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Step {stepIndex} of {totalSteps}
              </span>
              {onPrevStep && onNextStep && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onPrevStep(); }}
                    disabled={stepIndex <= 1}
                    className="px-2 py-0.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30 rounded cursor-pointer transition-colors"
                    title="Previous turn"
                  >
                    ◀ Prev
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onNextStep(); }}
                    disabled={stepIndex >= totalSteps}
                    className="px-2 py-0.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30 rounded cursor-pointer transition-colors"
                    title="Next turn"
                  >
                    Next ▶
                  </button>
                </div>
              )}
            </div>
          )}

          <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-snug">
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
