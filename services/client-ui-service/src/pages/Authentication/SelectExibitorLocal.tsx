import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

type ExibitorLocal = 'local' | 'international';

const exhibitorOptions = [
  {
    value: 'local',
    label: 'Local',
    description: 'Local exhibitors who want to showcase their products/services',
    icon: <FaMapMarkerAlt />,
  },
  {
    value: 'international',
    label: 'International',
    description: 'International exhibitors who want to showcase their products/services',
    icon: <FaGlobe />,
  },
];

interface SelectExibitorLocalProps {
  onClose: () => void;
}

const SelectExibitorLocal: React.FC<SelectExibitorLocalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleExhibitorTypeSelect = (local: ExibitorLocal) => {
    navigate(`/register?role=exhibitor&local=${local}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-primary-600 mb-4 text-center">
          Select Exhibitor Type
        </h3>
        <div className="space-y-4">
          {exhibitorOptions.map((role) => (
            <div
              key={role.value}
              onClick={() => handleExhibitorTypeSelect(role.value as ExibitorLocal)}
              className="cursor-pointer border rounded-lg p-4 hover:border-primary-400 transition-all hover:shadow-md"
            >
              <div className="flex items-center space-x-3">
                <div className="text-primary-600 text-2xl">
                  {role.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {role.label}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {role.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SelectExibitorLocal;