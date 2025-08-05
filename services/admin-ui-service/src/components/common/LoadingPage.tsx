import React from 'react';
import LoadingOverlay from './LoadingOverlay';

interface LoadingPageProps {
    isLoading: boolean;
    error: { status: number; message: string } | null;
    children: React.ReactNode;
    loadingMessage?: string;
    errorTitle?: (status: number) => string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
    isLoading,
    error,
    children,
    loadingMessage = 'Loading...',
    errorTitle = (status) => status === 401 ? 'Not Authorized' : 'Error Loading Content'
}) => {
    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                {errorTitle(error.status)}
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-6">
                <LoadingOverlay isLoading={true} message={loadingMessage} />
            </div>
        );
    }

    return <>{children}</>;
};

export default LoadingPage; 