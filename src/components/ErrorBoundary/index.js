import React, {PureComponent} from 'react'

export default class ErrorBoundary extends PureComponent {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  logErrorToMyService = () => {

  }

  componentDidCatch (error, info) {
    // Display fallback UI
    this.setState({ hasError: true })
    // You can also log the error to an error reporting service
    this.logErrorToMyService(error, info)
  }

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}
