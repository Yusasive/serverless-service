import React from 'react';

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
    className = '',
    ...props
}) => {
    return (
        <textarea
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${className}`}
            {...props}
        />
    );
}; 