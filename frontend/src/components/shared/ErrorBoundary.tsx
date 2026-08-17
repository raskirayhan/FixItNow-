import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Error Boundary Exception:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center dark:bg-slate-950">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
            Something Went Wrong
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
            An unexpected application error occurred. Don't worry, your data is safe.
          </p>

          {this.state.error && (
            <div className="mt-4 max-w-lg rounded-xl border border-red-200 bg-red-50 p-4 text-left font-mono text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              {this.state.error.message || "Unknown error"}
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={this.handleReload} variant="default" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </Button>
            <Button onClick={this.handleReset} variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
