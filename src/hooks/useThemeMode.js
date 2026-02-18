import { useMemo, useState } from 'react'

const STORAGE_KEY = 'campus-reshub-theme'

export function useThemeMode() {
  const [mode, setMode] = useState(() => localStorage.getItem(STORAGE_KEY) || 'light')

  const toggleTheme = useMemo(
    () => () => {
      setMode((prevMode) => {
        const nextMode = prevMode === 'light' ? 'dark' : 'light'
        localStorage.setItem(STORAGE_KEY, nextMode)
        return nextMode
      })
    },
    [],
  )

  return { mode, toggleTheme }
}
