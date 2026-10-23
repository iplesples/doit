import { Component } from "react"

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <pre className="p-2 text-xs text-red-400 whitespace-pre-wrap overflow-auto">
          {String(this.state.error.stack || this.state.error)}
        </pre>
      )
    }
    return this.props.children
  }
}