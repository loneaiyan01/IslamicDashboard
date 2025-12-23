import React, { useState, useEffect } from 'react';

export const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeParts = (date: Date) => {
    // Force 12-hour format
    const timeString = date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    
    // Split "09:04:58 PM" into parts
    const [timePart, periodPart] = timeString.split(' ');
    return { timePart, periodPart };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const { timePart, periodPart } = formatTimeParts(time);

  return (
    <div className="flex flex-col justify-center items-center h-full text-center">
      {/* Time Display - Adjusted for 1-column width */}
      <div className="flex flex-col leading-none">
        <h1 className="text-5xl md:text-5xl lg:text-6xl font-thin tracking-tighter text-white drop-shadow-lg tabular-nums">
          {timePart}
        </h1>
        <span className="text-xl md:text-2xl font-light text-emerald-400 tracking-widest opacity-90 -mt-1 md:-mt-2">
          {periodPart}
        </span>
      </div>
      
      {/* Date Display */}
      <div className="mt-3 border-t border-white/10 pt-2 w-full">
         <p className="text-sm md:text-base text-white/70 font-light tracking-wide uppercase">
            {time.toLocaleDateString('en-US', { weekday: 'long' })}
         </p>
         <p className="text-xs md:text-sm text-white/50 font-light tracking-wide">
            {time.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
         </p>
      </div>
    </div>
  );
};