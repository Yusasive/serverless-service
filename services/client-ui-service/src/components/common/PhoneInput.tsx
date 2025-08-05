import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { countriesList } from '../../data/countries';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  className?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ 
  value, 
  onChange, 
  error, 
  disabled = false,
  placeholder = "Enter phone number",
  label = "Phone Number",
  className = ""
}) => {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(() => {
    // Default to Nigeria
    return countriesList.find(country => country.code === 'NG') || countriesList[0];
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Parse the full phone value to extract country code and number
  useEffect(() => {
    if (value) {
      const countryWithCode = countriesList.find(country => 
        value.startsWith(`+${country.phoneCode}`)
      );
      if (countryWithCode) {
        setSelectedCountry(countryWithCode);
        setPhoneNumber(value.replace(`+${countryWithCode.phoneCode}`, ''));
      } else {
        setPhoneNumber(value);
      }
    } else {
      setPhoneNumber('');
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.phone-input-container')) {
        setShowCountryDropdown(false);
      }
    };
    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCountryDropdown]);

  const handleCountrySelect = (country: typeof countriesList[0]) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setSearchTerm('');
    // Update the full phone value when country changes
    const fullPhone = `+${country.phoneCode}${phoneNumber}`;
    onChange(fullPhone);
  };

  const handlePhoneNumberChange = (val: string) => {
    if (disabled) return;
    let cleanVal = val.replace(/\D/g, '');
    if (cleanVal.startsWith('0')) {
      cleanVal = cleanVal.replace(/^0+/, '');
    }
    setPhoneNumber(cleanVal);
    // Update the full phone value when number changes
    const fullPhone = selectedCountry ? `+${selectedCountry.phoneCode}${cleanVal}` : cleanVal;
    onChange(fullPhone);
  };

  const filteredCountries = countriesList.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.phoneCode.includes(searchTerm)
  );

  return (
    <div className={`relative phone-input-container ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="flex">
        {/* Country Code Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setShowCountryDropdown(!showCountryDropdown)}
            disabled={disabled}
            className={`flex items-center space-x-2 px-3 py-2 border border-r-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-400 ${
              error ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
            style={{ height: '42px' }}
          >
            <span className="text-sm font-medium">
              +{selectedCountry?.phoneCode}
            </span>
            {!disabled && <FaChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />}
          </button>

          {/* Country Dropdown */}
          {showCountryDropdown && !disabled && (
            <div className="absolute left-0 top-full z-50 w-64 min-w-full bg-white border border-gray-300 rounded-b-md shadow-lg">
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between ${
                        selectedCountry?.code === country.code ? 'bg-primary-50 text-primary-700' : ''
                      }`}
                    >
                      <span className="text-sm">{country.name}</span>
                      <span className="text-sm text-gray-500">+{country.phoneCode}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500 text-center">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          onPaste={(e) => {
            if (disabled) return;
            e.preventDefault();
            let paste = e.clipboardData.getData('text');
            handlePhoneNumberChange(paste);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 border rounded-r-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {phoneNumber && selectedCountry && !disabled && (
        <p className="text-xs text-gray-500 mt-1">
          Full number: +{selectedCountry.phoneCode}{phoneNumber}
        </p>
      )}
    </div>
  );
};

export default PhoneInput; 