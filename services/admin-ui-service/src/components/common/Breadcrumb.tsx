import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {items.map((item, index) => (
                    <li key={index} className="inline-flex items-center">
                        {index > 0 && (
                            <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                        )}
                        {item.path ? (
                            <Link
                                to={item.path}
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-sm font-medium text-gray-500">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb; 