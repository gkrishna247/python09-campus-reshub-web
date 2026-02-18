import { createTheme } from '@mui/material/styles'

const commonShape = {
  borderRadius: 8,
}

const commonTypography = {
  fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#00897b' },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  shape: commonShape,
  typography: commonTypography,
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#64b5f6' },
    secondary: { main: '#4db6ac' },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  shape: commonShape,
  typography: commonTypography,
})
