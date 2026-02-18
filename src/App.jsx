import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AppRoutes } from "./routes";
import { AuthProvider } from "./store/AuthContext";
import { SnackbarProvider } from "./store/SnackbarContext";
import { useThemeMode } from "./hooks/useThemeMode";
import { lightTheme, darkTheme } from "./theme";

function App() {
  const { mode } = useThemeMode();
  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SnackbarProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
