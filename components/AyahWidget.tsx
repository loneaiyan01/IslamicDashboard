import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { fetchRandomAyah } from '../services/api';
import { AyahData } from '../types';
import { AlertCircle } from 'lucide-react';

export interface AyahWidgetHandle {
    refreshAyah: () => void;
    toggleEnglishOnly: () => void;
    englishOnly: boolean;
    loading: boolean;
}

export const AyahWidget = forwardRef<AyahWidgetHandle>((props, ref) => {
    const [ayah, setAyah] = useState<AyahData | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [englishOnly, setEnglishOnly] = useState(false);

    const refreshAyah = async () => {
        if (loading) return;
        setLoading(true);
        setHasError(false);
        setIsVisible(false); // Fade out

        try {
            // Wait at least 500ms for animation smoothness, but start fetch immediately
            const [data] = await Promise.all([
                fetchRandomAyah(),
                new Promise(resolve => setTimeout(resolve, 500))
            ]);

            if (data) {
                setAyah(data);
            } else {
                setHasError(true);
            }
        } catch (error) {
            console.error("Error refreshing Ayah:", error);
            setHasError(true);
        } finally {
            setIsVisible(true); // Fade in
            setLoading(false);
        }
    };

    const toggleEnglishOnly = () => {
        setEnglishOnly(!englishOnly);
    };

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        refreshAyah,
        toggleEnglishOnly,
        englishOnly,
        loading
    }));

    useEffect(() => {
        refreshAyah();
        const interval = setInterval(refreshAyah, 60000); // 60 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full relative w-full">
            <div className={`flex-1 transition-opacity duration-1000 flex flex-col h-full w-full ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

                {loading && !ayah ? (
                    /* Initial Loading State */
                    <div className="flex-1 flex flex-col justify-center items-center gap-3 w-full opacity-50">
                        <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                        <div className="h-4 w-1/2 bg-white/20 rounded"></div>
                        <div className="h-4 w-2/3 bg-white/20 rounded"></div>
                    </div>
                ) : hasError && !ayah ? (
                    /* Error State */
                    <div className="flex-1 flex flex-col justify-center items-center text-white/40 gap-2">
                        <AlertCircle size={24} className="text-red-400/60" />
                        <span className="text-xs">Failed to load verse.</span>
                        <button onClick={refreshAyah} className="text-xs text-emerald-400 underline decoration-dotted hover:text-emerald-300">
                            Try Again
                        </button>
                    </div>
                ) : (
                    /* Content State */
                    <>
                        {/* Scrollable Content Area */}
                        <div className="flex-1 relative w-full min-h-0">
                            <div className="absolute inset-0 overflow-y-auto no-scrollbar">
                                <div className={`min-h-full flex flex-col items-center py-4 px-4 md:px-8 ${englishOnly ? 'justify-center' : 'justify-center'}`}>
                                    {/* Arabic Text - Conditionally rendered */}
                                    {!englishOnly && (
                                        <p className="font-quran text-3xl md:text-4xl leading-[2.4] text-center text-white drop-shadow-md mb-4 dir-rtl w-full" dir="rtl">
                                            {ayah?.arabic}
                                        </p>
                                    )}

                                    {/* English Translation - Enhanced when English-only */}
                                    <p className={`font-inter italic text-center text-white/70 leading-relaxed max-w-4xl transition-all duration-300 ${englishOnly
                                            ? 'text-xl md:text-2xl leading-loose text-white/90'
                                            : 'text-sm md:text-base'
                                        }`}>
                                        "{ayah?.english}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reference Footer - Fixed at bottom */}
                        {ayah && (
                            <div className="shrink-0 py-3 text-center text-[10px] md:text-xs text-emerald-400/80 tracking-wider font-light uppercase border-t border-white/5 mx-6">
                                Surah {ayah.surah.englishName} • Verse {ayah.numberInSurah}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
});

AyahWidget.displayName = 'AyahWidget';