import './styles/App.css'
import { Stack, Container, Button } from 'react-bootstrap'
import BudgetCard from './components/BudgetCard'
import { BudgetProvider, useBudget } from './contexts/context'
import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import AddBudgetModal from './components/AddBudgetModal'
import AddExpenseModal from './components/AddExpenseModal'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './contexts/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'

const DEFAULT_BUDGETS = [
  {
    name: "Entertainment",
    max: 25000,
    color: "#FF6B6B"  // Coral Red
  },
  {
    name: "Utilities",
    max: 30000,
    color: "#4ECDC4"  // Mint
  },
  {
    name: "Groceries",
    max: 45000,
    color: "#45B7D1"  // Sky Blue
  },
  {
    name: "Medical Expenses",
    max: 40000,
    color: "#96CEB4"  // Sage Green
  },
  {
    name: "Transportation",
    max: 20000,
    color: "#FFD93D"  // Warm Yellow
  }
]

function App() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const { budgets, getBudgetExpenses, addBudget } = useBudget()
  
  useEffect(() => {
    // Only initialize default budgets if none exist
    if (budgets.length === 0) {
      // Add all default budgets
      DEFAULT_BUDGETS.forEach(budget => {
        addBudget(budget)
      })
    }
  }, []) // Run only once on component mount

  return (
    <div className="min-vh-100">
      <Container className="py-4">
        <div className="header-container mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <h1 className="fs-2 fw-bold mb-1">Budget Tracker</h1>
              <p className="text-muted mb-0">Manage your expenses effectively</p>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">
              <ThemeToggle />
              <Button 
                variant="primary" 
                className="d-flex align-items-center gap-2"
                onClick={() => setShowAddBudgetModal(true)}
              >
                <i className="bi bi-plus-lg"></i>
                <span>Add Budget</span>
              </Button>
              <Button 
                variant="outline-primary"
                className="d-flex align-items-center gap-2"
                onClick={() => setShowAddExpenseModal(true)}
              >
                <i className="bi bi-receipt"></i>
                <span>Add Expense</span>
              </Button>
            </div>
          </div>
        </div>
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
            alignItems: "flex-start",
          }}
        >
          {budgets.map(budget => {
            const amount = getBudgetExpenses(budget.id)
              .reduce((total, expense) => total + expense.amount, 0)
            return (
              <BudgetCard
                key={budget.id}
                id={budget.id}
                name={budget.name}
                amount={amount}
                max={budget.max}
                color={budget.color}
                onAddExpenseClick={() => setShowAddExpenseModal(true)}
              />
            )
          })}
        </div>
      </Container>
      <AddBudgetModal 
        show={showAddBudgetModal} 
        handleClose={() => setShowAddBudgetModal(false)} 
      />
      <AddExpenseModal
        show={showAddExpenseModal}
        handleClose={() => setShowAddExpenseModal(false)}
      />
      <footer className="text-center py-4 text-muted">
        <small>Budget Tracker 2025. All rights reserved.</small>
      </footer>
    </div>
  )
}

export default function AppWithProvider() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BudgetProvider>
          <App />
        </BudgetProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
