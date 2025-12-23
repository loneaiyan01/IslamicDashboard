import React, { useRef } from 'react';
import { HeroWidget } from './components/HeroWidget';
import { SessionTimerWidget } from './components/SessionTimerWidget';
import { PrayerTimesWidget } from './components/PrayerTimesWidget';
import { AyahWidget, AyahWidgetHandle } from './components/AyahWidget';
import { JokeWidget } from './components/JokeWidget';
import { QuranPlayerWidget } from './components/QuranPlayerWidget';
import { TodoWidget } from './components/TodoWidget';
import { BentoItem } from './components/BentoItem';
import { Moon, Smile, BookOpen, Music, CheckSquare, Timer, Globe, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const ayahWidgetRef = useRef<AyahWidgetHandle>(null);

  return (
    <div
      className="relative w-screen h-[100vh] flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main Content Container - Flex Column */}
      <div className="relative z-10 w-full max-w-[1920px] h-full flex flex-col gap-4">

        {/* Top Section: Grid for Widgets (Flex-1 to take available space) */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 flex-1 min-h-0">
          {/* Top Left: Todo List (1x1) */}
          <BentoItem title="My Tasks" icon={<CheckSquare size={14} />}>
            <TodoWidget />
          </BentoItem>

          {/* Top Middle (2 Columns): Hero Section (Time + Weather) */}
          <BentoItem className="md:col-span-2">
            <HeroWidget />
          </BentoItem>

          {/* Right Column: Prayer Times (1x2) */}
          <BentoItem className="md:col-span-1 md:row-span-2" title="Prayer Times" icon={<Moon size={14} />}>
            <PrayerTimesWidget />
          </BentoItem>

          {/* Middle Row Left: Jokes (1x1) */}
          <BentoItem title="Daily Humor" icon={<Smile size={14} />}>
            <JokeWidget />
          </BentoItem>

          {/* Middle Row Center: Session Timer (1x1) */}
          <BentoItem title="Focus Session" icon={<Timer size={14} />} className="bg-black/40 border-emerald-500/50">
            <SessionTimerWidget />
          </BentoItem>

          {/* Row 2 Col 3: Quran Player (1x1) */}
          <BentoItem title="Audio Quran" icon={<Music size={14} />}>
            <QuranPlayerWidget />
          </BentoItem>
        </div>

        {/* Bottom Section: Ayah Widget (Fixed Height or Relative) */}
        <div className="relative w-full h-[25vh] min-h-[180px]">
          <BentoItem className="w-full h-full border-emerald-500/30 bg-emerald-950/20" title="Verse of the Moment" icon={<BookOpen size={14} />} allowOverflow={true}>
            <AyahWidget ref={ayahWidgetRef} />
          </BentoItem>

          {/* Control buttons positioned absolutely over the BentoItem */}
          <div className="absolute top-6 right-6 flex items-center gap-2 z-50">
            {/* English Toggle Button */}
            <button
              onClick={() => ayahWidgetRef.current?.toggleEnglishOnly()}
              className={`p-2 transition-all rounded-full backdrop-blur-sm ${ayahWidgetRef.current?.englishOnly
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-black/10 text-white/40 hover:text-emerald-400'
                }`}
              title={ayahWidgetRef.current?.englishOnly ? "Show Arabic + English" : "English Only"}
            >
              <Globe size={16} />
            </button>

            {/* Next Verse Button */}
            <button
              onClick={() => ayahWidgetRef.current?.refreshAyah()}
              className="p-2 text-white/40 hover:text-emerald-400 transition-colors bg-black/10 rounded-full backdrop-blur-sm"
              title="Next Verse"
              disabled={ayahWidgetRef.current?.loading}
            >
              <RefreshCcw size={16} className={`transition-transform duration-700 ${ayahWidgetRef.current?.loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;