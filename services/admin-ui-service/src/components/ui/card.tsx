import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className = '', ...props }) => {
    return (
        <div
            className={`bg-white rounded-lg shadow ${className}`}
            {...props}
        />
    );
};

export const CardHeader: React.FC<CardProps> = ({ className = '', ...props }) => {
    return (
        <div
            className={`px-6 py-4 border-b border-gray-200 ${className}`}
            {...props}
        />
    );
};

export const CardTitle: React.FC<CardProps> = ({ className = '', ...props }) => {
    return (
        <h3
            className={`text-lg font-semibold text-gray-900 ${className}`}
            {...props}
        />
    );
};

export const CardContent: React.FC<CardProps> = ({ className = '', ...props }) => {
    return (
        <div
            className={`p-6 ${className}`}
            {...props}
        />
    );
}; 