import React, { useEffect, useState } from 'react';
import { fetchWeather } from '../services/api';
import { WeatherData } from '../types';
import { Cloud, CloudRain, Sun, CloudFog, CloudSnow, CloudLightning, Wind, RefreshCcw } from 'lucide-react';

const getWeatherIcon = (code: number) => {
  if (code === 0) return <Sun className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-400" />;
  if (code >= 1 && code <= 3) return <Cloud className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300" />;
  if (code >= 45 && code <= 48) return <CloudFog className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400" />;
  if (code >= 51 && code <= 67) return <CloudRain className="w-12 h-12 lg:w-16 lg:h-16 text-blue-400" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="w-12 h-12 lg:w-16 lg:h-16 text-white" />;
  if (code >= 95) return <CloudLightning className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-600" />;
  return <Wind className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400" />;
};

const getWeatherDescription = (code: number) => {
  if (code === 0) return "Clear Sky";
  if (code >= 1 && code <= 3) return "Partly Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rainy";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 95) return "Thunderstorm";
  return "Variable";
};

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadWeather = async () => {
    setLoading(true);
    const data = await fetchWeather();
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    loadWeather();
    // Refresh every 30 minutes
    const interval = setInterval(() => {
      loadWeather();
    }, 1800000);
    return () => clearInterval(interval);
  }, []);

  if (!weather && !loading) return <div className="animate-pulse h-full bg-white/5 rounded-xl"></div>;

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-2 lg:gap-4 group">
      {/* Refresh Button */}
      <button 
        onClick={loadWeather}
        disabled={loading}
        className="absolute top-0 right-0 p-2 text-white/20 hover:text-white/80 transition-colors z-20"
      >
        <RefreshCcw size={14} className={`transition-transform duration-700 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
      </button>

      {weather ? (
        <>
          <div className={`drop-shadow-lg transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            {getWeatherIcon(weather.weatherCode)}
          </div>
          <div className={`text-center transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            <div className="text-4xl lg:text-5xl font-light tabular-nums">
              {Math.round(weather.temperature)}°
            </div>
            <div className="text-base lg:text-lg text-white/60 font-medium mt-1">
              {getWeatherDescription(weather.weatherCode)}
            </div>
            <div className="text-[10px] lg:text-xs text-white/40 mt-1 lg:mt-2 uppercase tracking-widest">
              Srinagar, IN
            </div>
          </div>
        </>
      ) : (
        <div className="animate-pulse flex flex-col items-center gap-2">
           <div className="w-12 h-12 bg-white/10 rounded-full"></div>
           <div className="w-16 h-8 bg-white/10 rounded"></div>
        </div>
      )}
    </div>
  );
};