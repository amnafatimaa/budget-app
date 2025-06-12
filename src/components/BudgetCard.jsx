import { Card, ProgressBar, Stack, Button } from 'react-bootstrap'
import { currencyFormatter } from '../utils/currency'
import { useBudget } from '../contexts/context'
import { useTheme } from '../contexts/ThemeContext'
import { useState } from 'react'

export default function BudgetCard({ name, amount, max, gray, onAddExpenseClick, id, color }) {
  const [isHovered, setIsHovered] = useState(false)
  const { darkMode } = useTheme()
  const classNames = ["shadow-sm"]
  
  if (amount > max) {
    classNames.push("bg-danger bg-opacity-10")
  } else if (gray) {
    classNames.push(darkMode ? "bg-dark bg-opacity-10" : "bg-light")
  }

  const { getBudgetExpenses, deleteExpense, deleteBudget } = useBudget()
  const expenses = getBudgetExpenses(id)

  function handleDeleteBudget() {
    expenses.forEach(expense => deleteExpense(expense.id))
    deleteBudget(id)
  }

  const cardStyle = {
    position: 'relative',
    borderRadius: '0.5rem',
    backgroundColor: darkMode ? 'var(--card-bg)' : undefined,
    borderColor: 'var(--border-color)',
    color: 'var(--text-color)',
    boxShadow: isHovered ? `0 8px 16px -4px ${color}40` : undefined,
    transform: isHovered ? 'translateY(-5px)' : 'none',
    transition: 'all 0.2s ease-in-out',
    overflow: 'hidden'
  }

  const topBorderStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    backgroundColor: color || '#ddd',
    opacity: darkMode ? 0.8 : 1
  }

  const progressBarStyle = {
    height: '0.6rem',
    backgroundColor: darkMode ? 'var(--progress-bg)' : undefined
  }

  const getProgressBackground = () => {
    const ratio = amount / max
    if (ratio < 0.5) return `${color}40`
    if (ratio < 0.75) return `${color}80`
    return color
  }

  return (
    <Card 
      className={classNames.join(" ")} 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={topBorderStyle} />
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-baseline fw-bold mb-4">
          <div className="me-2">
            <span className="fs-4 text-truncate d-inline-block" style={{ maxWidth: '150px' }}>{name}</span>
          </div>
          <div className="d-flex align-items-baseline flex-shrink-0">
            <span className="fs-5 text-nowrap" style={{ color: 'var(--text-color)' }}>
              {currencyFormatter.format(amount)}
            </span>
            <span className="text-muted fs-6 ms-1 text-nowrap">
              / {currencyFormatter.format(max)}
            </span>
          </div>
        </Card.Title>
        <div className="progress rounded-pill mb-4" style={progressBarStyle}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${(amount / max * 100)}%`,
              backgroundColor: getProgressBackground(),
              transition: 'width 0.3s ease-in-out'
            }}
            aria-valuenow={amount}
            aria-valuemin="0"
            aria-valuemax={max}
          />
        </div>
        <Stack direction="horizontal" gap="3" className="mt-4 mb-3">
          <Button 
            variant={darkMode ? "outline-light" : "outline-dark"}
            className="ms-auto fw-semibold" 
            onClick={onAddExpenseClick}
          >
            <i className="bi bi-plus-lg me-1"></i> Add
          </Button>
          <Button 
            variant="outline-danger"
            className="fw-semibold"
            onClick={handleDeleteBudget}
          >
            <i className="bi bi-trash me-1"></i> Delete
          </Button>
        </Stack>
        {expenses.length > 0 && (
          <div className="mt-4">
            <h6 className="text-muted mb-3">Recent Expenses</h6>
            <div className="expenses-list">
              {expenses.map(expense => (
                <div 
                  key={expense.id} 
                  className="d-flex justify-content-between align-items-center py-2 border-bottom"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <div className="text-truncate me-2">
                    <span className="fw-medium" style={{ color: 'var(--text-color)' }}>
                      {expense.description}
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-nowrap me-2 fw-semibold" style={{ color: 'var(--text-color)' }}>
                      {currencyFormatter.format(expense.amount)}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline-danger"
                      className="rounded-circle p-1"
                      onClick={() => deleteExpense(expense.id)}
                      style={{ width: '28px', height: '28px' }}
                    >
                      <i className="bi bi-x-lg"></i>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}
