import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Default to true (Dark Mode) as per user preference
    // Default to true (Dark Mode) - Force override for consistent UI
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Sync with local storage but prioritize initial dark state
    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'false') {
            // If user explicitly set to light previously, we might want to respect it? 
            // BUT user user specifically asked "Color yahi kar di (Dark)... user interface dark nahi hua"
            // So they WANT dark mode. The 'false' in storage is likely from default initialization earlier.
            // I will force it to true and update storage.
            setIsDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'false');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
