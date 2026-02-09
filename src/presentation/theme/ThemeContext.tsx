import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from './colors';

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    isDark: false,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
