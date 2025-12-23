import React from 'react';
import { useTheme } from '../ThemeContext';
import { Palette } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
    const { theme, cycleTheme, currentTheme } = useTheme();

    return (
        <button
            onClick={cycleTheme}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
            style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.border}`,
                color: theme.text.primary,
            }}
            title={`Current: ${theme.name} - Click to switch`}
        >
            <Palette size={20} />
            <span className="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{
                backgroundColor: theme.primary,
                color: theme.name === 'Light Mode' ? '#000' : '#fff',
            }}>
                {currentTheme.charAt(0).toUpperCase()}
            </span>
        </button>
    );
};
