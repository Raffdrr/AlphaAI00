import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#202124] text-[#bdc1c6]">
                    <div className="bg-[#d93025]/20 p-4 rounded-full mb-4 text-[#f28b82]">
                        <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Qualcosa è andato storto</h2>
                    <p className="text-sm mb-6 max-w-md">
                        Si è verificato un errore durante il caricamento di questo componente.
                        {this.state.error && <span className="block mt-2 font-mono text-xs opacity-50">{this.state.error.message}</span>}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="flex items-center gap-2 px-4 py-2 bg-[#8ab4f8] text-[#202124] rounded-lg font-medium hover:bg-[#8ab4f8]/90 transition-colors"
                    >
                        <RefreshCw size={16} />
                        Riprova
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
