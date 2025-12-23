import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface Verse {
    id: number;
    verse_number: number;
    verse_key: string;
    text_uthmani: string;
    text?: string;
}

interface SurahInfo {
    id: number;
    name_simple: string;
    name_arabic: string;
    verses_count: number;
    revelation_place: string;
}

interface LiveMushafProps {
    surahNumber: number;
    onVerseClick?: (verseNumber: number) => void;
    currentVerse?: number;
}

export const LiveMushaf: React.FC<LiveMushafProps> = ({
    surahNumber,
    onVerseClick,
    currentVerse = 1
}) => {
    const [verses, setVerses] = useState<Verse[]>([]);
    const [surahInfo, setSurahInfo] = useState<SurahInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSurahData = async () => {
            setLoading(true);
            try {
                const [versesRes, infoRes] = await Promise.all([
                    fetch(`https://api.quran.com/api/v4/quran/translations/203?chapter_number=${surahNumber}`),
                    fetch(`https://api.quran.com/api/v4/chapters/${surahNumber}`)
                ]);

                const versesData = await versesRes.json();
                const infoData = await infoRes.json();

                setVerses(versesData.translations || []);
                setSurahInfo(infoData.chapter || null);
            } catch (error) {
                console.error('Failed to fetch Quran data:', error);
                setVerses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSurahData();
    }, [surahNumber]);

    const parseHilaliBrackets = (text: string) => {
        if (!text) return null;
        const parts = text.split(/(\([^)]+\))/g);
        return parts.map((part, idx) => {
            if (part.startsWith('(') && part.endsWith(')')) {
                return (
                    <span key={idx} className="text-white/50 text-sm">
                        {part}
                    </span>
                );
            }
            return <span key={idx}>{part}</span>;
        });
    };

    const handlePrevVerse = () => {
        if (currentVerse > 1) {
            onVerseClick?.(currentVerse - 1);
        }
    };

    const handleNextVerse = () => {
        if (currentVerse < verses.length) {
            onVerseClick?.(currentVerse + 1);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-white/40">Loading Surah...</div>
            </div>
        );
    }

    if (verses.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white/40 text-sm">No verses available</div>
            </div>
        );
    }

    const currentVerseData = verses[currentVerse - 1];
    const progress = currentVerse / verses.length;

    return (
        <div className="relative h-full flex flex-col">
            {/* Progress Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/5 z-10">
                <div
                    className="bg-emerald-400 transition-all duration-500 w-full"
                    style={{ height: `${progress * 100}%` }}
                />
            </div>

            {/* Surah Header */}
            {surahInfo && (
                <div className="mb-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 ml-3 mr-2">
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen size={12} className="text-emerald-400" />
                        <h3 className="text-xs font-bold text-emerald-400">
                            {surahInfo.name_simple}
                        </h3>
                    </div>
                    <p className="text-base font-arabic text-white/90 mb-1">
                        {surahInfo.name_arabic}
                    </p>
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] text-white/50">
                            Verse {currentVerse} of {verses.length}
                        </p>
                        <p className="text-[10px] text-white/50">
                            {surahInfo.revelation_place}
                        </p>
                    </div>
                </div>
            )}

            {/* Current Verse Display */}
            <div className="flex-1 flex items-center justify-center px-3 overflow-hidden">
                {currentVerseData ? (
                    <div className="w-full max-w-2xl animate-fadeIn">
                        {/* Verse Number Badge */}
                        <div className="flex justify-center mb-4">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-black">
                                {currentVerseData.verse_key}
                            </span>
                        </div>

                        {/* Arabic Text */}
                        {currentVerseData.text_uthmani && (
                            <p className="font-quran text-right text-2xl lg:text-3xl leading-loose mb-6 text-white">
                                {currentVerseData.text_uthmani}
                            </p>
                        )}

                        {/* Translation */}
                        <p
                            className="text-sm lg:text-base leading-relaxed font-serif text-white/90 text-center"
                            style={{ lineHeight: '1.8' }}
                        >
                            {parseHilaliBrackets(currentVerseData.text || '')}
                        </p>
                    </div>
                ) : (
                    <div className="text-white/40">Verse not found</div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-4 mt-4 mb-2 px-3">
                <button
                    onClick={handlePrevVerse}
                    disabled={currentVerse <= 1}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Previous Verse"
                >
                    <ChevronLeft size={16} className="text-white/70" />
                </button>

                <div className="text-xs text-white/50 font-mono">
                    {currentVerse} / {verses.length}
                </div>

                <button
                    onClick={handleNextVerse}
                    disabled={currentVerse >= verses.length}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Next Verse"
                >
                    <ChevronRight size={16} className="text-white/70" />
                </button>
            </div>
        </div>
    );
};
