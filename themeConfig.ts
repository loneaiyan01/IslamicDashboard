export interface Theme {
    name: string;
    background: string;
    overlay: string;
    primary: string;
    secondary: string;
    accent: string;
    text: {
        primary: string;
        secondary: string;
        muted: string;
    };
    border: string;
    cardBg: string;
    cardBorder: string;
    gradientAnimation?: string; // CSS gradient for animated background
}

export const themes: Record<string, Theme> = {
    dark: {
        name: 'Dark Mode',
        background: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")',
        overlay: 'rgba(0, 0, 0, 0.4)',
        primary: '#10b981', // emerald-500
        secondary: '#34d399', // emerald-400
        accent: '#059669', // emerald-600
        text: {
            primary: 'rgba(255, 255, 255, 0.9)',
            secondary: 'rgba(255, 255, 255, 0.7)',
            muted: 'rgba(255, 255, 255, 0.4)',
        },
        border: 'rgba(255, 255, 255, 0.1)',
        cardBg: 'rgba(255, 255, 255, 0.05)',
        cardBorder: 'rgba(255, 255, 255, 0.1)',
        gradientAnimation: 'linear-gradient(-45deg, #0f172a, #1e293b, #0c4a6e, #134e4a)',
    },
    light: {
        name: 'Light Mode',
        background: 'url("https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2564&auto=format&fit=crop")',
        overlay: 'rgba(255, 255, 255, 0.75)',
        primary: '#0891b2', // cyan-600
        secondary: '#06b6d4', // cyan-500
        accent: '#0e7490', // cyan-700
        text: {
            primary: 'rgba(15, 23, 42, 0.95)', // slate-900
            secondary: 'rgba(51, 65, 85, 0.85)', // slate-700
            muted: 'rgba(100, 116, 139, 0.7)', // slate-500
        },
        border: 'rgba(15, 23, 42, 0.12)',
        cardBg: 'rgba(255, 255, 255, 0.85)',
        cardBorder: 'rgba(15, 23, 42, 0.08)',
        gradientAnimation: 'linear-gradient(-45deg, #e0f2fe, #f0f9ff, #dbeafe, #e0e7ff)',
    },
    nature: {
        name: 'Nature',
        background: 'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2564&auto=format&fit=crop")',
        overlay: 'rgba(20, 40, 20, 0.5)',
        primary: '#84cc16', // lime-500
        secondary: '#a3e635', // lime-400
        accent: '#65a30d', // lime-600
        text: {
            primary: 'rgba(255, 255, 255, 0.95)',
            secondary: 'rgba(255, 255, 255, 0.8)',
            muted: 'rgba(255, 255, 255, 0.5)',
        },
        border: 'rgba(132, 204, 22, 0.2)',
        cardBg: 'rgba(20, 40, 20, 0.4)',
        cardBorder: 'rgba(132, 204, 22, 0.15)',
        gradientAnimation: 'linear-gradient(-45deg, #14532d, #166534, #365314, #3f6212)',
    },
    twilight: {
        name: 'Twilight',
        background: 'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2564&auto=format&fit=crop")',
        overlay: 'rgba(30, 20, 50, 0.6)',
        primary: '#a78bfa', // violet-400
        secondary: '#c4b5fd', // violet-300
        accent: '#8b5cf6', // violet-500
        text: {
            primary: 'rgba(255, 255, 255, 0.95)',
            secondary: 'rgba(255, 255, 255, 0.75)',
            muted: 'rgba(255, 255, 255, 0.45)',
        },
        border: 'rgba(167, 139, 250, 0.2)',
        cardBg: 'rgba(30, 20, 50, 0.4)',
        cardBorder: 'rgba(167, 139, 250, 0.15)',
        gradientAnimation: 'linear-gradient(-45deg, #1e1b4b, #312e81, #4c1d95, #581c87)',
    },
};

export type ThemeName = keyof typeof themes;
