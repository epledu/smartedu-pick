"use client";

/**
 * React Error Boundary wrapper.
 * Catches render-time errors and shows a user-friendly fallback UI.
 */
import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Optional custom fallback. If omitted, default friendly UI is shown. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // In production, forward to an error tracking service here
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] px-6 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            문제가 발생했어요
          </h2>
          <p className="text-sm text-gray-500 mb-5 max-w-xs">
            일시적인 오류입니다. 다시 시도하거나 페이지를 새로고침 해주세요.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
