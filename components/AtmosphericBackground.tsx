import React, { useEffect, useState } from 'react';

interface AtmosphericBackgroundProps {
    weatherCode: number;
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ weatherCode }) => {
    const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'day' | 'dusk' | 'night'>('day');

    useEffect(() => {
        const updateTimeOfDay = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 7) setTimeOfDay('dawn');
            else if (hour >= 7 && hour < 17) setTimeOfDay('day');
            else if (hour >= 17 && hour < 19) setTimeOfDay('dusk');
            else setTimeOfDay('night');
        };

        updateTimeOfDay();
        const interval = setInterval(updateTimeOfDay, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    // Weather code interpretation (WMO Weather interpretation codes)
    const getWeatherEffect = () => {
        if (weatherCode >= 61 && weatherCode <= 67) return 'rain';
        if (weatherCode >= 71 && weatherCode <= 77) return 'snow';
        if (weatherCode >= 2 && weatherCode <= 3) return 'clouds';
        if (weatherCode >= 45 && weatherCode <= 48) return 'fog';
        return 'clear';
    };

    const weatherEffect = getWeatherEffect();

    // Time of day gradients
    const getTimeGradient = () => {
        switch (timeOfDay) {
            case 'dawn':
                return 'linear-gradient(to bottom, #ff6b6b 0%, #feca57 30%, #48dbfb 100%)';
            case 'day':
                return 'linear-gradient(to bottom, #4facfe 0%, #00f2fe 50%, #43e97b 100%)';
            case 'dusk':
                return 'linear-gradient(to bottom, #fa709a 0%, #fee140 50%, #30cfd0 100%)';
            case 'night':
                return 'linear-gradient(to bottom, #0f0c29 0%, #302b63 50%, #24243e 100%)';
        }
    };

    return (
        <>
            {/* Time of Day Gradient */}
            <div
                className="absolute inset-0 transition-opacity duration-[3000ms]"
                style={{
                    background: getTimeGradient(),
                    opacity: 0.15,
                }}
            />

            {/* Weather Effects */}
            {weatherEffect === 'clouds' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="cloud cloud-1" />
                    <div className="cloud cloud-2" />
                    <div className="cloud cloud-3" />
                </div>
            )}

            {weatherEffect === 'rain' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Rain drops */}
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className="raindrop"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${0.5 + Math.random() * 0.5}s`,
                            }}
                        />
                    ))}
                    {/* Glass blur effect */}
                    <div className="absolute inset-0 backdrop-blur-[0.5px] opacity-30" />
                </div>
            )}

            {weatherEffect === 'snow' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className="snowflake"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 5}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            {weatherEffect === 'fog' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="fog-layer fog-1" />
                    <div className="fog-layer fog-2" />
                </div>
            )}

            {weatherEffect === 'clear' && timeOfDay === 'day' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Subtle atmospheric particles */}
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 10}s`,
                            }}
                        />
                    ))}
                </div>
            )}
        </>
    );
};
