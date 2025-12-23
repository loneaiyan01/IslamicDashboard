import React, { useEffect, useState, useRef } from 'react';
import { fetchPrayerTimes } from '../services/api';
import { PrayerTimes } from '../types';
import { Clock, Volume2, VolumeX, MapPin } from 'lucide-react';

interface PrayerDetail {
  name: string;
  adhan: string;
  iqamah: string;
  date: Date;
  iqamahDate: Date;
}

export const PrayerTimesWidget: React.FC = () => {
  const [timings, setTimings] = useState<PrayerTimes | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<PrayerDetail | null>(null);
  const [activePrayer, setActivePrayer] = useState<PrayerDetail | null>(null); // For Adhan/Iqamah window
  const [isMuted, setIsMuted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Adhan Audio URL (Makkah Adhan)
  const ADHAN_AUDIO_URL = "https://www.islamcan.com/audio/adhan/azan1.mp3";

  useEffect(() => {
    fetchPrayerTimes().then(setTimings);

    // Initialize Audio
    audioRef.current = new Audio(ADHAN_AUDIO_URL);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate Prayer Details (Adhan & Iqamah times)
  const getPrayerDetails = (timings: PrayerTimes): PrayerDetail[] => {
    const today = new Date();
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    return prayers.map(name => {
      const timeStr = timings[name];
      const [hours, minutes] = timeStr.split(':').map(Number);

      const adhanDate = new Date(today);
      adhanDate.setHours(hours, minutes, 0, 0);

      // Iqamah Logic
      const iqamahOffset = name === 'Maghrib' ? 10 : 15;
      const iqamahDate = new Date(adhanDate.getTime() + iqamahOffset * 60000);

      return {
        name,
        adhan: timeStr,
        iqamah: iqamahDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        date: adhanDate,
        iqamahDate
      };
    });
  };

  useEffect(() => {
    if (!timings) return;

    const prayers = getPrayerDetails(timings);
    const now = new Date();

    // Find active prayer (between Adhan and Iqamah + small buffer)
    const active = prayers.find(p => {
      // Active if time is between Adhan and Iqamah
      return now >= p.date && now < p.iqamahDate;
    });

    setActivePrayer(active || null);

    // Find next prayer
    let next = prayers.find(p => p.date > now);

    // If no next prayer today, it's Fajr tomorrow (logic simplified for today-only view, 
    // ideally would fetch tomorrow's but for now we loop back to Fajr)
    if (!next) {
      // Just show Fajr as next (even if date is technically today in this array, logic handles display)
      next = prayers[0];
    }
    setNextPrayer(next);

    // Audio Trigger Logic
    if (active && !isMuted && !audioPlaying) {
      // Check if we just entered the Adhan time (within last 2 seconds)
      const timeDiff = now.getTime() - active.date.getTime();
      if (timeDiff >= 0 && timeDiff < 2000) {
        audioRef.current?.play().catch(e => console.log("Audio play failed", e));
        setAudioPlaying(true);
      }
    }

    // Reset audio playing state if not active
    if (!active) {
      setAudioPlaying(false);
    }

  }, [currentTime, timings, isMuted]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const getCountdown = (target: Date) => {
    const diff = target.getTime() - currentTime.getTime();
    if (diff < 0) return "00m 00s"; // Should not happen for next prayer

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${seconds}s`;
  };

  if (!timings || !nextPrayer) return <div className="animate-pulse h-full bg-white/5 rounded-xl"></div>;

  const isIqamahWindow = activePrayer !== null;
  const displayPrayer = activePrayer || nextPrayer;
  const countdownTarget = activePrayer ? activePrayer.iqamahDate : displayPrayer.date;
  const countdownLabel = activePrayer ? "Iqamah in" : "In";

  // Visual State Classes
  const getCardStyle = () => {
    if (activePrayer) return "border-emerald-500/50 bg-emerald-900/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]"; // Adhan Active
    if (currentTime.getTime() + 30 * 60000 > displayPrayer.date.getTime()) return "border-amber-500/50 bg-amber-900/10"; // Soon (<30m)
    return "border-white/10 bg-white/5"; // Normal
  };

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 text-emerald-400">
          <MapPin size={14} />
          <span className="text-xs font-bold tracking-widest uppercase">Prayer Times</span>
        </div>
        <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className={audioPlaying ? "animate-pulse text-emerald-400" : ""} />}
        </button>
      </div>

      {/* Main Focus Card */}
      <div className={`relative p-5 rounded-2xl border backdrop-blur-md transition-all duration-500 flex flex-col items-center text-center mb-4 ${getCardStyle()}`}>

        {/* Status Label */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/20 text-white/70">
          {activePrayer ? "Now Active" : "Next Prayer"}
        </div>

        <h2 className="text-3xl font-bold text-white mt-2 mb-1">{displayPrayer.name.toUpperCase()}</h2>

        {/* Times Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 w-full max-w-[200px] my-3">
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Adhan</p>
            <p className="text-xl font-mono text-white/90">{displayPrayer.adhan}</p>
          </div>
          <div className="text-left">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Iqamah</p>
            <p className="text-xl font-mono text-emerald-400">{displayPrayer.iqamah}</p>
          </div>
        </div>

        {/* Countdown */}
        <div className="mt-1 px-4 py-1.5 rounded-full bg-black/30 border border-white/5 flex items-center gap-2">
          <Clock size={14} className={activePrayer ? "text-amber-400 animate-pulse" : "text-white/40"} />
          <span className="text-sm font-mono text-white/80">
            {countdownLabel} <span className="text-white font-bold">{getCountdown(countdownTarget)}</span>
          </span>
        </div>
      </div>

      {/* Compact Grid for Other Prayers */}
      <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
        {getPrayerDetails(timings).filter(p => p.name !== displayPrayer.name).map((p) => {
          const isPast = currentTime > p.iqamahDate;
          return (
            <div key={p.name} className={`flex flex-col justify-center px-3 py-2 rounded-xl border ${isPast ? 'bg-white/5 border-white/5 opacity-50' : 'bg-white/10 border-white/10'}`}>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-medium text-white/70">{p.name}</span>
                <span className="text-xs font-mono text-white/40">{p.adhan}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Utility Slot Placeholder */}
      <div className="mt-2 h-1 bg-white/5 rounded-full w-1/3 mx-auto opacity-20"></div>
    </div>
  );
};