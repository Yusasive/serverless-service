import React from 'react';

interface StatusBadgeProps {
    isActive: boolean;
    activeLabel?: string;
    inactiveLabel?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
    isActive, 
    activeLabel = 'Active', 
    inactiveLabel = 'Inactive' 
}) => {
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
        }`}>
            {isActive ? activeLabel : inactiveLabel}
        </span>
    );
};

export default StatusBadge; 