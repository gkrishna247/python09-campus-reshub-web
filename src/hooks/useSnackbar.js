import { useContext } from 'react'
import { SnackbarContext } from '../store/SnackbarContext'

export function useSnackbar() {
  const { showSnackbar } = useContext(SnackbarContext)
  return showSnackbar
}
