import { IconButton, useTheme } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeMode } from "../../hooks/useThemeMode";

export const ThemeToggle = () => {
    const theme = useTheme();
    const { toggleTheme } = useThemeMode();

    return (
        <IconButton onClick={toggleTheme} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
    );
};
