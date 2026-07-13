import { Component, ReactNode } from 'react';
import { ErrorState } from '@/components/common/States';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Unhandled error in Simmer:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto px-4 py-20">
          <ErrorState message="This page hit a snag." onRetry={() => this.setState({ hasError: false })} />
        </div>
      );
    }
    return this.props.children;
  }
}
