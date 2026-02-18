import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { useThemeMode } from './hooks/useThemeMode'
import { darkTheme, lightTheme } from './theme'
import AppRoutes from './routes'
import SnackbarProvider from './components/common/SnackbarProvider'
import { AuthProvider } from './store/AuthContext'
import { NotificationProvider } from './store/NotificationContext'

function App() {
  const { mode, toggleTheme } = useThemeMode()
  const theme = mode === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AuthProvider>
          <NotificationProvider>
            <BrowserRouter>
              <AppRoutes themeMode={mode} onToggleTheme={toggleTheme} />
            </BrowserRouter>
          </NotificationProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
