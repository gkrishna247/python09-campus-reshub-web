import { createTheme } from "@mui/material/styles";

const baseOptions = {
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: 12,
                },
            },
        },
    },
};

export const lightTheme = createTheme({
    ...baseOptions,
    palette: {
        mode: "light",
        primary: {
            main: "#3f51b5", // Indigo
        },
        secondary: {
            main: "#ffb74d", // Amber
        },
        background: {
            default: "#fafafa",
            paper: "#ffffff",
        },
        text: {
            primary: "#1e293b",
            secondary: "#64748b",
        },
    },
});

export const darkTheme = createTheme({
    ...baseOptions,
    palette: {
        mode: "dark",
        primary: {
            main: "#5c6bc0", // Lighter Indigo
        },
        secondary: {
            main: "#ffca28", // Amber
        },
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
        text: {
            primary: "#f8fafc",
            secondary: "#94a3b8",
        },
    },
});
