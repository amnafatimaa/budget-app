import './App.css'
import { Stack, Container, Button } from 'react-bootstrap'
import BudgetCard from './components/BudgetCard'
import { BudgetProvider, useBudget } from './Contexts/context'
import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import AddBudgetModal from './components/AddBudgetModal'
import AddExpenseModal from './components/AddExpenseModal'

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
    // Clear existing budgets
    localStorage.removeItem('budgets')
    localStorage.removeItem('expenses')
    
    // Add all default budgets
    DEFAULT_BUDGETS.forEach(budget => {
      addBudget(budget)
    })
  }, []) // Run only once on component mount

  return (
    <div className="min-vh-100 bg-light">
      <Container className="py-5">
        <Stack direction="horizontal" gap={3} className="mb-5">
          <div>
            <h1 className="me-auto fs-2 fw-bold text-dark">Budget Tracker</h1>
            <p className="text-muted mb-0">Manage your expenses effectively</p>
          </div>
          <Button 
            variant="primary" 
            className="ms-auto px-4 fw-semibold"
            onClick={() => setShowAddBudgetModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Add Budget
          </Button>
          <Button 
            variant="outline-primary"
            className="px-4 fw-semibold"
            onClick={() => setShowAddExpenseModal(true)}
          >
            <i className="bi bi-receipt me-2"></i>
            Add Expense
          </Button>
        </Stack>
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
            alignItems: "flex-start",
            marginTop: "1rem"
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
    <BudgetProvider>
      <App />
    </BudgetProvider>
  )
}
