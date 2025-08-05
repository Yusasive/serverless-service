import React from 'react';

interface UserTypeBadgeProps {
    userType: string;
}

const UserTypeBadge: React.FC<UserTypeBadgeProps> = ({ userType }) => {
    const getButtonClass = (type: string) => {
        switch (type) {
            case 'SUPER_ADMIN':
                return 'bg-purple-100 text-purple-800';
            case 'ADMIN':
                return 'bg-red-100 text-red-800';
            case 'ORGANIZER':
                return 'bg-blue-100 text-blue-800';
            case 'ORGANIZER_STAFF':
                return 'bg-green-100 text-green-800';
            case 'EXHIBITOR':
                return 'bg-yellow-100 text-yellow-800';
            case 'ATTENDEE':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getButtonClass(userType || '')}`}>
            {(userType || '').replace(/_/g, ' ')}
        </span>
    );
};

export default UserTypeBadge; 