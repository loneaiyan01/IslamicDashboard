import React, { useEffect, useState, useRef } from 'react';
import { fetchPrayerTimes } from '../services/api';
import { PrayerTimes } from '../types';
import { RECITERS, SURAH_NAMES } from '../services/quranData';
import { Clock, Volume2, VolumeX, MapPin, Play, Pause, Shuffle, BookOpen, Moon, Maximize2, Minimize2 } from 'lucide-react';
import { LiveMushaf } from './LiveMushaf';

interface SpiritualityWidgetProps {
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

interface PrayerDetail {
    name: string;
    adhan: string;
    iqamah: string;
    date: Date;
    iqamahDate: Date;
}

export const SpiritualityWidget: React.FC<SpiritualityWidgetProps> = ({ isFullscreen = false, onToggleFullscreen }) => {
    // --- SHARED STATE ---
    const [activeTab, setActiveTab] = useState<'prayer' | 'quran'>('prayer');

    // --- PRAYER TIMES STATE ---
    const [timings, setTimings] = useState<PrayerTimes | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [nextPrayer, setNextPrayer] = useState<PrayerDetail | null>(null);
    const [activePrayer, setActivePrayer] = useState<PrayerDetail | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const prayerAudioRef = useRef<HTMLAudioElement | null>(null);
    const ADHAN_AUDIO_URL = "https://www.islamcan.com/audio/adhan/azan1.mp3";

    // --- QURAN PLAYER STATE ---
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
    const [selectedSurahIndex, setSelectedSurahIndex] = useState(0);
    const [playerTime, setPlayerTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentVerseNumber, setCurrentVerseNumber] = useState(1);
    const [verseTimings, setVerseTimings] = useState<{ verse_key: string, timestamp_from: number, timestamp_to: number }[]>([]);
    const quranAudioRef = useRef<HTMLAudioElement>(null);

    // --- EFFECT: PRAYER TIMES ---
    useEffect(() => {
        fetchPrayerTimes().then(setTimings);
        prayerAudioRef.current = new Audio(ADHAN_AUDIO_URL);

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // --- EFFECT: PRAYER LOGIC ---
    const getPrayerDetails = (timings: PrayerTimes): PrayerDetail[] => {
        const today = new Date();
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        return prayers.map(name => {
            const timeStr = timings[name];
            const [hours, minutes] = timeStr.split(':').map(Number);
            const adhanDate = new Date(today);
            adhanDate.setHours(hours, minutes, 0, 0);
            const iqamahOffset = name === 'Maghrib' ? 10 : 15;
            const iqamahDate = new Date(adhanDate.getTime() + iqamahOffset * 60000);
            return { name, adhan: timeStr, iqamah: iqamahDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), date: adhanDate, iqamahDate };
        });
    };

    useEffect(() => {
        if (!timings) return;
        const prayers = getPrayerDetails(timings);
        const now = new Date();
        const active = prayers.find(p => now >= p.date && now < p.iqamahDate);
        setActivePrayer(active || null);

        let next = prayers.find(p => p.date > now);
        if (!next) next = prayers[0];
        setNextPrayer(next);

        if (active && !isMuted && !audioPlaying) {
            const timeDiff = now.getTime() - active.date.getTime();
            if (timeDiff >= 0 && timeDiff < 2000) {
                prayerAudioRef.current?.play().catch(e => console.log("Adhan play failed", e));
                setAudioPlaying(true);
            }
        }
        if (!active) setAudioPlaying(false);
    }, [currentTime, timings, isMuted]);

    // --- EFFECT: QURAN PLAYER ---
    const getSurahId = (index: number) => String(index + 1).padStart(3, '0');
    const currentAudioUrl = `${selectedReciter.url}/${getSurahId(selectedSurahIndex)}.mp3`;

    useEffect(() => {
        if (quranAudioRef.current) {
            if (isPlaying) quranAudioRef.current.play().catch(e => console.error("Playback failed", e));
            else quranAudioRef.current.pause();
        }
    }, [isPlaying, currentAudioUrl]);

    // Fetch verse timings for timestamp-enabled reciters
    useEffect(() => {
        const fetchVerseTimings = async () => {
            if (!selectedReciter.hasTimestamps) {
                setVerseTimings([]);
                return;
            }
            try {
                const response = await fetch(
                    `https://api.quran.com/api/v4/recitations/${selectedReciter.timestampId}/by_chapter/${selectedSurahIndex + 1}`
                );
                const data = await response.json();
                setVerseTimings(data.audio_files?.[0]?.verse_timings || []);
            } catch (error) {
                console.error('Failed to fetch verse timings:', error);
                setVerseTimings([]);
            }
        };
        fetchVerseTimings();
    }, [selectedReciter, selectedSurahIndex]);

    // Auto-sync verse based on audio timestamp
    useEffect(() => {
        if (verseTimings.length === 0 || !isPlaying) return;

        const currentTiming = verseTimings.find(
            (timing) => playerTime >= timing.timestamp_from / 1000 && playerTime < timing.timestamp_to / 1000
        );

        if (currentTiming) {
            const verseNum = parseInt(currentTiming.verse_key.split(':')[1]);
            if (verseNum !== currentVerseNumber) {
                setCurrentVerseNumber(verseNum);
            }
        }
    }, [playerTime, verseTimings, isPlaying]);

    // --- HANDLERS ---
    const toggleMute = () => {
        if (prayerAudioRef.current) {
            prayerAudioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const getCountdown = (target: Date) => {
        const diff = target.getTime() - currentTime.getTime();
        if (diff < 0) return "00m 00s";
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m ${seconds}s`;
    };

    const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        if (value === -1) {
            const randomIndex = Math.floor(Math.random() * 114);
            setSelectedSurahIndex(randomIndex);
            setIsPlaying(true);
        } else {
            setSelectedSurahIndex(value);
            setIsPlaying(true);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // --- RENDER ---
    if (!timings || !nextPrayer) return <div className="animate-pulse h-full bg-white/5 rounded-xl"></div>;

    const displayPrayer = activePrayer || nextPrayer;
    const countdownTarget = activePrayer ? activePrayer.iqamahDate : displayPrayer.date;

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden">

            {/* HEADER: TABS */}
            <div className="flex items-center justify-between mb-2 px-1 pb-2 border-b border-white/5">
                <div className="flex bg-black/20 rounded-lg p-1 gap-1">
                    <button
                        onClick={() => setActiveTab('prayer')}
                        className={`flex items-center gap-1 px-3 py-1 rounded transition-all ${activeTab === 'prayer' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white/60'}`}
                    >
                        <Moon size={12} />
                        <span className="text-xs font-bold uppercase tracking-wide">Prayer</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('quran')}
                        className={`flex items-center gap-1 px-3 py-1 rounded transition-all ${activeTab === 'quran' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white/60'}`}
                    >
                        <BookOpen size={12} />
                        <span className="text-xs font-bold uppercase tracking-wide">Quran</span>
                    </button>
                </div>
                {activeTab === 'prayer' && (
                    <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className={audioPlaying ? "animate-pulse text-emerald-400" : ""} />}
                    </button>
                )}
            </div>

            {/* CONTENT: PRAYER */}
            <div className={`flex-1 transition-opacity duration-500 ${activeTab === 'prayer' ? 'opacity-100 flex flex-col' : 'opacity-0 hidden'}`}>
                {/* Main Card */}
                <div className={`relative p-4 rounded-xl border backdrop-blur-md flex flex-col items-center text-center mb-2 ${activePrayer ? 'border-emerald-500/50 bg-emerald-900/20' : 'border-white/10 bg-white/5'}`}>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/20 text-white/70">
                        {activePrayer ? "Now Active" : "Next Prayer"}
                    </div>
                    <h2 className="text-2xl font-bold text-white mt-4 mb-2">{displayPrayer.name.toUpperCase()}</h2>

                    <div className="flex gap-4 w-full justify-center mb-2">
                        <div className="text-center">
                            <p className="text-[9px] text-white/40 uppercase">Adhan</p>
                            <p className="text-lg font-mono text-white/90">{displayPrayer.adhan}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] text-white/40 uppercase">Iqamah</p>
                            <p className="text-lg font-mono text-emerald-400">{displayPrayer.iqamah}</p>
                        </div>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-black/30 border border-white/5 flex items-center gap-2">
                        <Clock size={12} className={activePrayer ? "text-amber-400 animate-pulse" : "text-white/40"} />
                        <span className="text-xs font-mono text-white/80">
                            {activePrayer ? "Iqamah in" : "In"} <span className="text-white font-bold">{getCountdown(countdownTarget)}</span>
                        </span>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                    {getPrayerDetails(timings).filter(p => p.name !== displayPrayer.name).map((p) => (
                        <div key={p.name} className="flex justify-between items-center px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-xs font-medium text-white/70">{p.name}</span>
                            <span className="text-xs font-mono text-white/40">{p.adhan}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CONTENT: QURAN */}
            <div className={`flex-1 transition-opacity duration-500 ${activeTab === 'quran' ? 'opacity-100 flex flex-col' : 'opacity-0 hidden'}`}>
                <audio
                    ref={quranAudioRef}
                    src={currentAudioUrl}
                    onTimeUpdate={() => quranAudioRef.current && setPlayerTime(quranAudioRef.current.currentTime)}
                    onLoadedMetadata={() => quranAudioRef.current && setDuration(quranAudioRef.current.duration)}
                    onEnded={() => { setIsPlaying(false); setPlayerTime(0); }}
                />

                {/* Surah Selection */}
                <div className="flex flex-col gap-2 mb-2">
                    <select
                        value={selectedReciter.id}
                        onChange={(e) => setSelectedReciter(RECITERS.find(r => r.id === e.target.value) || RECITERS[0])}
                        className="w-full bg-white/10 border border-white/20 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    >
                        {RECITERS.map(r => <option key={r.id} value={r.id} className="bg-gray-900">{r.name}</option>)}
                    </select>
                    <select
                        value={selectedSurahIndex}
                        onChange={handleSurahChange}
                        className="w-full bg-white/10 border border-white/20 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    >
                        <option value="-1" className="bg-gray-900 font-bold">🔀 Surprise Me</option>
                        {SURAH_NAMES.map((name, i) => <option key={i} value={i} className="bg-gray-900">{i + 1}. {name}</option>)}
                    </select>
                </div>

                {/* Live Mushaf Display */}
                <div className="flex-1 min-h-0 mb-2">
                    <LiveMushaf
                        surahNumber={selectedSurahIndex + 1}
                        currentVerse={currentVerseNumber}
                        onVerseClick={(verseNumber) => {
                            setCurrentVerseNumber(verseNumber);
                        }}
                    />
                </div>

                {/* Player Controls */}
                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                    <div className="text-center mb-3">
                        <p className="text-sm font-bold text-white truncate">{SURAH_NAMES[selectedSurahIndex]}</p>
                        <p className="text-xs text-emerald-400/70 truncate">{selectedReciter.name}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mb-3">
                        <button onClick={() => { const r = Math.floor(Math.random() * 114); setSelectedSurahIndex(r); setIsPlaying(true); }} className="text-white/40 hover:text-white">
                            <Shuffle size={14} />
                        </button>
                        <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/20">
                            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                        </button>
                    </div>

                    {/* Progress */}
                    <div className="px-1">
                        <div className="flex justify-between text-[9px] text-white/30 font-mono mb-1">
                            <span>{formatTime(playerTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                        <input
                            type="range" min="0" max={duration || 0} value={playerTime}
                            onChange={(e) => { const t = parseFloat(e.target.value); quranAudioRef.current!.currentTime = t; setPlayerTime(t); }}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};
