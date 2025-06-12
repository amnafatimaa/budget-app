import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Something went wrong</h4>
          <p>We're sorry, but there was an error loading this component.</p>
          <hr />
          <p className="mb-0">
            <button 
              className="btn btn-outline-danger"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </button>
          </p>
        </div>
      )
    }

    return this.props.children
  }
} 