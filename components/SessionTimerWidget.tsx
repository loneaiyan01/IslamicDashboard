import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const SessionTimerWidget: React.FC = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000); // Update every second
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
    };

    // Format time parts
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');

    // Ring Progress (1 hour = 100%)
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const progress = (time % 3600) / 3600; // 0 to 1
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <div className={`flex flex-row items-center justify-center h-full w-full relative overflow-hidden transition-all duration-1000 gap-4 ${isRunning ? 'shadow-[inset_0_0_50px_rgba(0,224,198,0.05)]' : ''}`}>

            {/* Background Noise/Blur Effect */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="w-32 h-32 bg-emerald-500/30 rounded-full blur-3xl"></div>
            </div>

            <div className="relative flex items-center justify-center">
                {/* SVG Ring */}
                <svg className="transform -rotate-90 w-32 h-32 lg:w-40 lg:h-40">
                    {/* Background Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="6"
                    />
                    {/* Progress Circle with Glow */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="#00e0c6" // Teal Accent
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                        style={{
                            filter: 'drop-shadow(0 0 6px rgba(0, 224, 198, 0.5))'
                        }}
                    />
                </svg>

                {/* Digital Time Display */}
                <div className="absolute flex flex-col items-center justify-center z-10" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    <div className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg flex items-baseline">
                        <span>{hours}</span>
                        <span className="mx-0.5 opacity-50">:</span>
                        <span>{minutes}</span>
                    </div>
                    <div className="text-xs lg:text-sm font-medium text-white/50 mt-[-2px]">
                        .{seconds}
                    </div>
                </div>
            </div>

            {/* Controls - Vertical Stack on the right */}
            <div className="flex flex-col items-center gap-3 z-20">
                {/* Play/Pause Button (Primary) */}
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${isRunning
                            ? 'bg-white/10 text-white border border-white/20'
                            : 'bg-gradient-to-br from-white/20 to-white/5 text-[#00e0c6] border border-white/20 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.2)]'
                        }`}
                    title={isRunning ? "Pause" : "Start"}
                >
                    {isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>

                {/* Reset Button (Secondary) */}
                <button
                    onClick={handleReset}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
                    title="Reset"
                >
                    <RotateCcw size={16} />
                </button>
            </div>
        </div>
    );
};
