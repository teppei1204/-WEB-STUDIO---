import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "craft", setTheme: () => {} });
const STORAGE_KEY = "kabuki-theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "craft";
    return localStorage.getItem(STORAGE_KEY) === "lab" ? "lab" : "craft";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore */
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}