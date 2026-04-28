import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center font-sans z-50">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4">
            Something went wrong
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 border border-white text-white uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-300"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
