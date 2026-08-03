'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
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
    logger.error('UIErrorBoundary', 'componentDidCatch', error.message, {
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-[#F7F8FA] font-body text-[#0B0E12]">
          <div className="bg-white border border-[#EAECE7] rounded-3xl p-8 max-w-md w-full shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
              <AlertTriangle size={28} />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-lg text-[#0B0E12]">
                Kuch Ghalti Hui (Something Went Wrong)
              </h3>
              <p className="text-xs text-[#666E7A] font-medium leading-relaxed">
                App error display handle kar rahi hai. Aapse guzaris hai k page reload kar ke dobara koshish karein.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl text-left text-[11px] font-mono text-rose-700 max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-xl bg-[#0B0E12] text-white hover:bg-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <RefreshCw size={15} />
              <span>Page Refresh Karein</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
