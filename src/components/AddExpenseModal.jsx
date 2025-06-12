import { Form, Modal, Button } from "react-bootstrap"
import { useRef } from "react"
import { useBudget } from "../contexts/context"
import ErrorBoundary from "./ErrorBoundary"

export default function AddExpenseModal({ show, handleClose }) {
  const descriptionRef = useRef()
  const amountRef = useRef()
  const budgetIdRef = useRef()
  const { addExpense, budgets } = useBudget()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await addExpense({
        description: descriptionRef.current.value,
        amount: parseFloat(amountRef.current.value),
        budgetId: budgetIdRef.current.value
      })
      e.target.reset()
      handleClose()
    } catch (error) {
      console.error("Error adding expense:", error)
    }
  }

  return (
    <ErrorBoundary>
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>New Expense</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control ref={descriptionRef} type="text" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                ref={amountRef}
                type="number"
                required
                min={0}
                step={100}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="budgetId">
              <Form.Label>Budget</Form.Label>
              <Form.Select ref={budgetIdRef} required defaultValue="">
                <option value="" disabled>Select a budget</option>
                {budgets.map(budget => (
                  <option key={budget.id} value={budget.id}>
                    {budget.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit">
                Add Expense
              </Button>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
    </ErrorBoundary>
  )
} 