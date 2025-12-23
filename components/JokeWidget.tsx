import React, { useEffect, useState } from 'react';
import { fetchRandomJoke } from '../services/api';
import { JokeData } from '../types';
import { Smile } from 'lucide-react';

export const JokeWidget: React.FC = () => {
  const [joke, setJoke] = useState<JokeData | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const refreshJoke = async () => {
    setIsVisible(false);
    setTimeout(async () => {
      const data = await fetchRandomJoke();
      setJoke(data);
      setIsVisible(true);
    }, 500);
  };

  useEffect(() => {
    refreshJoke();
    const interval = setInterval(refreshJoke, 60000); // 60 seconds
    return () => clearInterval(interval);
  }, []);

  if (!joke) return <div className="animate-pulse h-full bg-white/5 rounded-xl"></div>;

  return (
    <div className={`h-full w-full relative transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Scrollable Container */}
      <div className="absolute inset-0 overflow-y-auto no-scrollbar">
        <div className="min-h-full flex flex-col justify-center p-2">
          
          <div className="flex-1 flex items-center justify-center py-2">
            <p className="text-lg md:text-xl lg:text-2xl font-medium text-center text-white/90 leading-snug">
                "{joke.setup}"
            </p>
          </div>
          
          <div className="flex-shrink-0 border-t border-white/10 mx-4" />

          <div className="flex-1 flex items-center justify-center py-4">
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-emerald-300">
                {joke.punchline}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};