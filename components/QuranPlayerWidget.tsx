import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Shuffle } from 'lucide-react';
import { RECITERS, SURAH_NAMES } from '../services/quranData';

export const QuranPlayerWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [selectedSurahIndex, setSelectedSurahIndex] = useState(0); // 0-based index
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Pad Surah number for URL (e.g., 1 -> "001")
  const getSurahId = (index: number) => String(index + 1).padStart(3, '0');

  const currentAudioUrl = `${selectedReciter.url}/${getSurahId(selectedSurahIndex)}.mp3`;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentAudioUrl]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    if (value === -1) {
      playRandomSurah();
    } else {
      setSelectedSurahIndex(value);
      setIsPlaying(true); // Auto-play on selection
    }
  };

  const playRandomSurah = () => {
    const randomIndex = Math.floor(Math.random() * 114);
    setSelectedSurahIndex(randomIndex);
    setIsPlaying(true);
  };

  const handleReciterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const reciterId = e.target.value;
    const reciter = RECITERS.find(r => r.id === reciterId);
    if (reciter) {
      setSelectedReciter(reciter);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full justify-between p-1">
      <audio 
        ref={audioRef} 
        src={currentAudioUrl} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Top Controls: Dropdowns */}
      <div className="flex flex-col gap-2">
        {/* Reciter Select */}
        <div className="relative">
            <select 
                value={selectedReciter.id} 
                onChange={handleReciterChange}
                className="w-full bg-white/10 border border-white/20 text-white text-xs lg:text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 appearance-none cursor-pointer"
            >
                {RECITERS.map(r => (
                    <option key={r.id} value={r.id} className="bg-gray-900 text-white">
                        {r.name}
                    </option>
                ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>

        {/* Surah Select */}
        <div className="relative">
            <select 
                value={selectedSurahIndex} 
                onChange={handleSurahChange}
                className="w-full bg-white/10 border border-white/20 text-white text-xs lg:text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 appearance-none cursor-pointer"
            >
                <option value="-1" className="bg-gray-900 text-emerald-400 font-bold">
                     🔀 Surprise Me (Random)
                </option>
                {SURAH_NAMES.map((name, index) => (
                    <option key={index} value={index} className="bg-gray-900 text-white">
                        {index + 1}. {name}
                    </option>
                ))}
            </select>
             <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
      </div>

      {/* Bottom Controls: Player Interface */}
      <div className="flex flex-col mt-2 bg-black/20 rounded-xl p-2 border border-white/5 gap-2">
        
        {/* Progress Bar & Info */}
        <div className="flex flex-col gap-1 px-1">
             <div className="flex justify-between text-[10px] text-white/40 font-mono tracking-wider">
                 <span>{formatTime(currentTime)}</span>
                 <span>{formatTime(duration)}</span>
             </div>
             <input 
                type="range" 
                min="0" 
                max={duration || 0} 
                value={currentTime} 
                onChange={handleSeek}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400"
             />
        </div>

        <div className="flex items-center gap-3">
            <button 
                onClick={togglePlay}
                className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full transition-all shadow-lg shadow-emerald-900/20 shrink-0"
            >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>

            <button 
                onClick={playRandomSurah}
                className="flex items-center justify-center w-7 h-7 lg:w-9 lg:h-9 bg-white/10 hover:bg-emerald-500/20 text-white/70 hover:text-emerald-400 rounded-full transition-all shrink-0"
                title="Random Surah"
            >
                <Shuffle size={14} />
            </button>

            <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="text-xs font-medium text-white truncate">
                    {SURAH_NAMES[selectedSurahIndex]}
                </div>
                <div className="text-[10px] text-emerald-400/80 truncate">
                    {selectedReciter.name}
                </div>
            </div>

            <div className="flex items-center gap-2 pr-1 shrink-0">
                {/* Visualizer */}
                <div className="flex items-end gap-[2px] h-3 lg:h-4">
                    {[40, 70, 50, 80, 60].map((h, i) => (
                        <div 
                            key={i} 
                            className={`w-1 bg-emerald-500/50 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`} 
                            style={{ height: isPlaying ? `${h}%` : '20%' }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};