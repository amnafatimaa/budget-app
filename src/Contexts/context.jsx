import { createContext, useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useLocalStorage from '../hooks/useLocalStorageHooks'

const BudgetContext = createContext()

export const useBudget = () => {
    return useContext(BudgetContext)
}

// Default colors for budgets if none provided
const DEFAULT_COLORS = [
    "#FF6B6B",  // Coral Red
    "#4ECDC4",  // Mint
    "#45B7D1",  // Sky Blue
    "#96CEB4",  // Sage Green
    "#FFD93D",  // Warm Yellow
    "#6C5B7B",  // Purple
    "#C06C84",  // Rose
    "#F8B195",  // Peach
]

export const BudgetProvider = ({ children }) => {
    const [budgets, setBudgets] = useLocalStorage('budgets', [])
    const [expenses, setExpenses] = useLocalStorage('expenses', [])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    function getBudgetExpenses(budgetId) {
        try {
            setLoading(true)
            const result = expenses.filter(expense => expense.budgetId === budgetId)
            setError(null)
            return result
        } catch (err) {
            setError('Failed to get budget expenses')
            return []
        } finally {
            setLoading(false)
        }
    }

    async function addExpense({ description, amount, budgetId }) {
        try {
            setLoading(true)
            if (!description || amount <= 0 || !budgetId) {
                throw new Error('Invalid expense data')
            }
            setExpenses(prevExpenses => {
                return [...prevExpenses, { id: uuidv4(), description, amount, budgetId }]
            })
            setError(null)
        } catch (err) {
            setError(err.message || 'Failed to add expense')
        } finally {
            setLoading(false)
        }
    }

    async function addBudget({ name, max, color }) {
        try {
            setLoading(true)
            if (!name || max <= 0) {
                throw new Error('Invalid budget data')
            }
            setBudgets(prevBudgets => {
                if (prevBudgets.find(budget => budget.name === name)) {
                    throw new Error('Budget with this name already exists')
                }
                const budgetColor = color || DEFAULT_COLORS[prevBudgets.length % DEFAULT_COLORS.length]
                return [...prevBudgets, { id: uuidv4(), name, max, color: budgetColor }]
            })
            setError(null)
        } catch (err) {
            setError(err.message || 'Failed to add budget')
        } finally {
            setLoading(false)
        }
    }

    async function deleteBudget(id) {
        try {
            setLoading(true)
            if (!id) {
                throw new Error('Invalid budget ID')
            }
            setExpenses(prevExpenses => {
                return prevExpenses.filter(expense => expense.budgetId !== id)
            })
            setBudgets(prevBudgets => {
                return prevBudgets.filter(budget => budget.id !== id)
            })
            setError(null)
        } catch (err) {
            setError(err.message || 'Failed to delete budget')
        } finally {
            setLoading(false)
        }
    }

    async function deleteExpense(id) {
        try {
            setLoading(true)
            if (!id) {
                throw new Error('Invalid expense ID')
            }
            setExpenses(prevExpenses => {
                return prevExpenses.filter(expense => expense.id !== id)
            })
            setError(null)
        } catch (err) {
            setError(err.message || 'Failed to delete expense')
        } finally {
            setLoading(false)
        }
    }

    return (
        <BudgetContext.Provider value={{
            budgets,
            expenses,
            error,
            loading,
            getBudgetExpenses,
            addExpense,
            addBudget,
            deleteBudget,
            deleteExpense
        }}>
            {children}
        </BudgetContext.Provider>
    )
}
