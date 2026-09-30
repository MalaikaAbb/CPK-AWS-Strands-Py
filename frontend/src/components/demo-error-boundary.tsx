"use client";

import { Component, type ReactNode } from "react";

/**
 * Shows a render error in place instead of taking down the whole demo route.
 *
 * Used where a route deliberately runs doc code that throws, so the error is
 * readable on the page and the route's other controls keep working.
 */
export class DemoErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div className="m-4 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-950 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100">
        <p className="font-semibold">The published code threw:</p>
        <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">
          {error.name}: {error.message}
        </pre>
      </div>
    );
  }
}
