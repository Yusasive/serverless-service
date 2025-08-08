import React from 'react';
import { Users, Edit, Trash2 } from 'lucide-react';
import { CompanyRep } from '@/types/companyRep.type';

interface CompanyRepresentativeCardProps {
  representative: CompanyRep;
  className?: string;
  onEdit?: (representative: CompanyRep) => void;
  onDelete?: (representative: CompanyRep) => void;
  showActions?: boolean;
}

const CompanyRepresentativeCard: React.FC<CompanyRepresentativeCardProps> = ({ 
  representative, 
  className = "",
  onEdit,
  onDelete,
  showActions = true
}) => {
  return (
    <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 ${className} relative group`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {representative.photo ? (
            <img
              src={representative.photo}
              alt={representative.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {representative.name}
          </h4>
          <p className="text-sm text-gray-500 truncate">
            {representative.company_name}
          </p>
          {representative.email && (
            <p className="text-xs text-gray-400 truncate">
              {representative.email}
            </p>
          )}
          {representative.phone && (
            <p className="text-xs text-gray-400 truncate">
              {representative.phone}
            </p>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      {showActions && (onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={() => onEdit(representative)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
              title="Edit representative"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(representative)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
              title="Delete representative"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyRepresentativeCard; 