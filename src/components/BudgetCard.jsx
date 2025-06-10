import { Card, ProgressBar, Stack, Button } from 'react-bootstrap'
import { currencyFormatter } from '../utils'
import { useBudget } from '../Contexts/context'

export default function BudgetCard({ name, amount, max, gray, onAddExpenseClick, id, color }) {
  const classNames = ["shadow-sm"]
  if (amount > max) {
    classNames.push("bg-danger", "bg-opacity-10")
  } else if (gray) {
    classNames.push("bg-light")
  }

  const { getBudgetExpenses, deleteExpense, deleteBudget } = useBudget()
  const expenses = getBudgetExpenses(id)

  function handleDeleteBudget() {
    // Delete all expenses for this budget first
    expenses.forEach(expense => deleteExpense(expense.id))
    // Then delete the budget
    deleteBudget(id)
  }

  const cardStyle = {
    borderTop: `4px solid ${color || '#ddd'}`,
    borderRadius: '0.5rem',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)'
    }
  }

  return (
    <Card className={classNames.join(" ")} style={cardStyle}>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-baseline fw-bold mb-4">
          <div className="me-2 d-flex align-items-center">
            <span className="fs-4">{name}</span>
          </div>
          <div className="d-flex align-items-baseline">
            <span className="fs-5">{currencyFormatter.format(amount)}</span>
            <span className="text-muted fs-6 ms-1">
              / {currencyFormatter.format(max)}
            </span>
          </div>
        </Card.Title>
        <ProgressBar 
          className="rounded-pill mb-4" 
          variant={getProgressBarVariant(amount, max)}
          min={0}
          max={max}
          now={amount}
          style={{ height: '0.6rem' }}
        />
        <Stack direction="horizontal" gap="3" className="mt-4 mb-3">
          <Button 
            variant="outline-primary" 
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
                >
                  <div className="text-truncate me-2">
                    <span className="fw-medium">{expense.description}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-nowrap me-2 fw-semibold">
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

function getProgressBarVariant(amount, max) {
  const ratio = amount / max
  if (ratio < 0.5) return "primary"
  if (ratio < 0.75) return "warning"
  return "danger"
}
