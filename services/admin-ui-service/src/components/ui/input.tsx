import React from 'react';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
    className = '',
    ...props
}) => {
    return (
        <input
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${className}`}
            {...props}
        />
    );
}; 