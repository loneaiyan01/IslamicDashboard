import React, { useState, useEffect } from 'react';
import { fetchWeather } from '../services/api';
import { WeatherData } from '../types';
import { Cloud, CloudRain, Sun, CloudFog, CloudSnow, CloudLightning, Wind } from 'lucide-react';

const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-8 h-8 text-yellow-400" />;
    if (code >= 1 && code <= 3) return <Cloud className="w-8 h-8 text-gray-300" />;
    if (code >= 45 && code <= 48) return <CloudFog className="w-8 h-8 text-gray-400" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="w-8 h-8 text-white" />;
    if (code >= 95) return <CloudLightning className="w-8 h-8 text-yellow-600" />;
    return <Wind className="w-8 h-8 text-gray-400" />;
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

export const HeroWidget: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState<WeatherData | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadWeather = async () => {
            const data = await fetchWeather();
            setWeather(data);
        };
        loadWeather();
        const interval = setInterval(loadWeather, 1800000); // 30 mins
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            {/* Time Display */}
            <div className="flex flex-col leading-none">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-thin tracking-tighter text-white drop-shadow-2xl tabular-nums">
                    {formatTime(time)}
                </h1>
            </div>

            {/* Weather Display */}
            {weather && (
                <div className="flex items-center gap-3 text-white/90 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                    {getWeatherIcon(weather.weatherCode)}
                    <span className="text-xl font-light">
                        {Math.round(weather.temperature)}° {getWeatherDescription(weather.weatherCode)}
                    </span>
                </div>
            )}

            {/* Date Display */}
            <div className="flex flex-col items-center">
                <p className="text-lg md:text-xl text-emerald-400 font-medium tracking-widest uppercase">
                    {time.toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
                <p className="text-sm md:text-base text-white/60 font-light tracking-wide">
                    {time.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>
        </div>
    );
};
