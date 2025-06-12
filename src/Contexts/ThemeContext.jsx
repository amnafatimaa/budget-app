import { createContext, useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorageHooks'

const ThemeContext = createContext()

export const useTheme = () => {
  return useContext(ThemeContext)
}

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false)

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
} 