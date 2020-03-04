import { Component } from 'react';
import { showAlert } from './helpers/utility-functions';

class ErrorBoundary extends Component {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }

  componentDidCatch(error) {
    showAlert({
      status: 'error',
      title: 'Error',
      text:
        error?.message ??
        'Could not complete your request, please try again later',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    const hasError = Boolean(error);

    return !hasError && children;
  }
}

export default ErrorBoundary;
