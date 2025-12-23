import React, { useRef, useState, useEffect } from 'react';
import { HeroWidget } from './components/HeroWidget';
import { AyahWidget, AyahWidgetHandle } from './components/AyahWidget';
import { NewsWidget } from './components/NewsWidget';
import { TaskFocusWidget } from './components/TaskFocusWidget';
import { SpiritualityWidget } from './components/SpiritualityWidget';
import { BentoItem } from './components/BentoItem';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { useTheme } from './ThemeContext';
import { fetchWeather } from './services/api';
import { Moon, BookOpen, CheckSquare, Globe, RefreshCcw, Newspaper, Link2 } from 'lucide-react';
import { QuickLinksWidget } from './components/QuickLinksWidget';

const App: React.FC = () => {
  const ayahWidgetRef = useRef<AyahWidgetHandle>(null);
  const { theme } = useTheme();
  const [weatherCode, setWeatherCode] = useState(0);
  const [isSpiritualityFullscreen, setIsSpiritualityFullscreen] = useState(false);

  useEffect(() => {
    const loadWeather = async () => {
      const data = await fetchWeather();
      setWeatherCode(data.weatherCode);
    };
    loadWeather();
    const interval = setInterval(loadWeather, 1800000); // 30 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-screen h-[100vh] flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden"
      style={{
        backgroundImage: theme.background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Animated Gradient Layer */}
      {theme.gradientAnimation && (
        <div
          className="absolute inset-0 animate-gradient"
          style={{
            background: theme.gradientAnimation,
            backgroundSize: '400% 400%',
            opacity: 0.3,
          }}
        />
      )}

      {/* Atmospheric Background Effects */}
      <AtmosphericBackground weatherCode={weatherCode} />

      {/* Overlay for readability */}
      <div className="absolute inset-0" style={{ backgroundColor: theme.overlay }} />

      {/* Theme Switcher */}
      <ThemeSwitcher />

      {/* Main Content Container - Flex Column */}
      <div className="relative z-10 w-full max-w-[1920px] h-full flex flex-col gap-4">

        {/* Fullscreen Spirituality Hub */}
        {isSpiritualityFullscreen ? (
          <div className="flex-1 min-h-0">
            <BentoItem className="h-full" title="Spirituality Hub" icon={<Moon size={14} />}>
              <SpiritualityWidget
                isFullscreen={isSpiritualityFullscreen}
                onToggleFullscreen={() => setIsSpiritualityFullscreen(false)}
              />
            </BentoItem>
          </div>
        ) : (
          <>
            {/* DESKTOP: Grid Layout (hidden on mobile) */}
            <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 flex-1 min-h-0">

              {/* Row 1, Col 1: Task & Focus (1x1) */}
              <BentoItem title="Tasks & Focus" icon={<CheckSquare size={14} />}>
                <TaskFocusWidget />
              </BentoItem>

              {/* Row 1, Col 2-3: Hero Section (2x1) */}
              <BentoItem className="col-span-2">
                <HeroWidget />
              </BentoItem>

              {/* Row 1-2, Col 4: Spirituality Hub (1x2) - Spans both rows */}
              <BentoItem className="col-span-1 row-span-2" title="Spirituality Hub" icon={<Moon size={14} />}>
                <SpiritualityWidget
                  isFullscreen={isSpiritualityFullscreen}
                  onToggleFullscreen={() => setIsSpiritualityFullscreen(true)}
                />
              </BentoItem>

              {/* Row 2, Col 1: News Headlines (1x1) */}
              <BentoItem title="Live Headlines" icon={<Newspaper size={14} />}>
                <NewsWidget />
              </BentoItem>

              {/* Row 2, Col 2-3: Quick Links (2x1) */}
              <BentoItem className="col-span-2" title="Quick Links" icon={<Link2 size={14} />}>
                <QuickLinksWidget />
              </BentoItem>

            </div>

            {/* MOBILE: Vertical Scroll Layout (visible on mobile only) */}
            <div className="md:hidden flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4">

              {/* Hero Widget */}
              <div className="min-h-[200px]">
                <BentoItem className="h-full">
                  <HeroWidget />
                </BentoItem>
              </div>

              {/* Quick Links */}
              <div className="min-h-[120px]">
                <BentoItem title="Quick Links" icon={<Link2 size={14} />} className="h-full">
                  <QuickLinksWidget />
                </BentoItem>
              </div>

              {/* Tasks & Focus */}
              <div className="min-h-[300px]">
                <BentoItem title="Tasks & Focus" icon={<CheckSquare size={14} />} className="h-full">
                  <TaskFocusWidget />
                </BentoItem>
              </div>

              {/* Spirituality Hub */}
              <div className="min-h-[400px]">
                <BentoItem title="Spirituality Hub" icon={<Moon size={14} />} className="h-full">
                  <SpiritualityWidget
                    isFullscreen={isSpiritualityFullscreen}
                    onToggleFullscreen={() => setIsSpiritualityFullscreen(true)}
                  />
                </BentoItem>
              </div>

              {/* News Headlines */}
              <div className="min-h-[250px]">
                <BentoItem title="Live Headlines" icon={<Newspaper size={14} />} className="h-full">
                  <NewsWidget />
                </BentoItem>
              </div>

              {/* Verse of the Moment */}
              <div className="min-h-[250px]">
                <BentoItem
                  title="Verse of the Moment"
                  icon={<BookOpen size={14} />}
                  allowOverflow={true}
                  className="h-full"
                >
                  <AyahWidget ref={ayahWidgetRef} />
                </BentoItem>
              </div>

            </div>

            {/* Bottom Section: Ayah Widget (Desktop only) */}
            <div className="hidden md:block relative w-full h-[25vh] min-h-[180px]">
              <BentoItem
                className="w-full h-full"
                style={{
                  borderColor: theme.primary + '50',
                  backgroundColor: theme.cardBg,
                }}
                title="Verse of the Moment"
                icon={<BookOpen size={14} />}
                allowOverflow={true}
              >
                <AyahWidget ref={ayahWidgetRef} />
              </BentoItem>

              {/* Control buttons positioned absolutely over the BentoItem */}
              <div className="absolute top-6 right-6 flex items-center gap-2 z-50">
                <button
                  onClick={() => ayahWidgetRef.current?.toggleEnglishOnly()}
                  className="p-2 transition-all rounded-full backdrop-blur-sm"
                  style={{
                    backgroundColor: ayahWidgetRef.current?.englishOnly ? theme.primary + '33' : theme.cardBg,
                    color: ayahWidgetRef.current?.englishOnly ? theme.primary : theme.text.muted,
                  }}
                  title={ayahWidgetRef.current?.englishOnly ? "Show Arabic + English" : "English Only"}
                >
                  <Globe size={16} />
                </button>

                <button
                  onClick={() => ayahWidgetRef.current?.refreshAyah()}
                  className="p-2 transition-all rounded-full backdrop-blur-sm"
                  style={{
                    backgroundColor: theme.cardBg,
                    color: theme.text.muted,
                  }}
                  title="Next Verse"
                  disabled={ayahWidgetRef.current?.loading}
                >
                  <RefreshCcw size={16} className={`transition-transform duration-700 ${ayahWidgetRef.current?.loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default App;