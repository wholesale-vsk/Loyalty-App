import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = "light" | "dark" | "system";
type ColorScheme = "blue" | "purple" | "green"|"orange" ;

interface ThemeContextProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  color: ColorScheme;
  setColor: (color: ColorScheme) => void;
  resolvedTheme: ThemeMode; 
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "system",
  setTheme: () => {},
  color: "purple",
  setColor: () => {},
  resolvedTheme: "system",
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [color, setColorState] = useState<ColorScheme>("purple");
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  // Load persisted values
  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('@theme_mode');
        const c = await AsyncStorage.getItem('@theme_color');
        if (t === 'light' || t === 'dark' || t === 'system') setThemeState(t as ThemeMode);
        if (c === 'blue' || c === 'purple' || c === 'green' || c === 'orange') setColorState(c as ColorScheme);
      } catch (e) {
        // ignore
      }
    })();

    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });

    return () => sub.remove();
  }, []);

  const setTheme = async (t: ThemeMode) => {
    setThemeState(t);
    try {
      await AsyncStorage.setItem('@theme_mode', t);
    } catch (e) {
      // ignore
    }
  };

  const setColor = async (c: ColorScheme) => {
    setColorState(c);
    try {
      await AsyncStorage.setItem('@theme_color', c);
    } catch (e) {
      // ignore
    }
  };

  const resolvedTheme: ThemeMode = theme === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : theme;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, color, setColor, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);