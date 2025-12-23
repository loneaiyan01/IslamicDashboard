import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themes, ThemeName, Theme } from './themeConfig';

interface ThemeContextType {
    currentTheme: ThemeName;
    theme: Theme;
    setTheme: (theme: ThemeName) => void;
    cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
        const saved = localStorage.getItem('dashboard_theme');
        return (saved as ThemeName) || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('dashboard_theme', currentTheme);
    }, [currentTheme]);

    const cycleTheme = () => {
        const themeKeys: ThemeName[] = ['dark', 'light', 'nature', 'twilight'];
        const currentIndex = themeKeys.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        setCurrentTheme(themeKeys[nextIndex]);
    };

    const value: ThemeContextType = {
        currentTheme,
        theme: themes[currentTheme],
        setTheme: setCurrentTheme,
        cycleTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
