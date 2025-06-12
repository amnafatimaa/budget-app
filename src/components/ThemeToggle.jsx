import { Button } from 'react-bootstrap'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <Button
      variant={darkMode ? "light" : "dark"}
      size="sm"
      onClick={toggleDarkMode}
      className="rounded-circle p-2 d-flex align-items-center justify-content-center"
      style={{ width: '38px', height: '38px' }}
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <i className={`bi bi-${darkMode ? "sun" : "moon-stars"}`}></i>
    </Button>
  )
} 