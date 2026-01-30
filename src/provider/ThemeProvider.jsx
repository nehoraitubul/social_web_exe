import { useState, useEffect } from 'react';
import { ThemeContext } from "../context/ThemeContext";

export const ThemeProvider = ({ children }) => {
    // טעינת הבחירה מה-LocalStorage או ברירת מחדל ל-'system'
    const [themeSelection, setThemeSelection] = useState(() => {
        return localStorage.getItem('theme-selection') || 'system';
    });

    useEffect(() => {
        const root = document.documentElement;

        const applyTheme = () => {
            let actualTheme = themeSelection;

            // אם נבחר system, בודקים מה הגדרות הדפדפן/מערכת
            if (themeSelection === 'system') {
                actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            root.setAttribute('data-theme', actualTheme);
        };

        applyTheme();
        localStorage.setItem('theme-selection', themeSelection);

        // האזנה לשינויים במערכת בזמן אמת (רק אם אנחנו על מצב system)
        if (themeSelection === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const listener = () => applyTheme();
            mediaQuery.addEventListener('change', listener);
            return () => mediaQuery.removeEventListener('change', listener);
        }
    }, [themeSelection]);

    return (
        <ThemeContext.Provider value={{ themeSelection, setThemeSelection }}>
            {children}
        </ThemeContext.Provider>
    );
};