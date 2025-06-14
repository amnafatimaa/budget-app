import { Form, Modal, Button } from "react-bootstrap"
import { useRef } from "react"
import { useBudget } from "../Contexts/context"
import ErrorBoundary from "./ErrorBoundary"

export default function AddBudgetModal({ show, handleClose }) {
  const nameRef = useRef()
  const maxRef = useRef()
  const { addBudget } = useBudget()

  function handleSubmit(e) {
    e.preventDefault()
    try {
      addBudget({
        name: nameRef.current.value,
        max: parseFloat(maxRef.current.value)
      })
      e.target.reset()
      handleClose()
    } catch (error) {
      console.error("Error adding budget:", error)
    }
  }

  return (
    <ErrorBoundary>
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>New Budget</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control ref={nameRef} type="text" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="max">
              <Form.Label>Maximum Spending</Form.Label>
              <Form.Control 
                ref={maxRef} 
                type="number" 
                required 
                min={0} 
                step={100}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit">
                Add
              </Button>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
    </ErrorBoundary>
  )
} 