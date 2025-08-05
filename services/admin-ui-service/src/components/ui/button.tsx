import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ 
    children, 
    className = '', 
    variant = 'default',
    ...props 
}) => {
    const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors';
    const variantStyles = {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}; 