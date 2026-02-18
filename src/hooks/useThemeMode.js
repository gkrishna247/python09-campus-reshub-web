import { useState, useEffect } from "react";

export function useThemeMode() {
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem("campus-reshub-theme");
        return (saved === "dark" || saved === "light") ? saved : "light";
    });

    useEffect(() => {
        localStorage.setItem("campus-reshub-theme", mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
    };

    return { mode, toggleTheme };
}
