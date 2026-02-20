import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import '../../styles/EnquiryForm.css';

const CustomDropdown = ({ label, options, value, onChange, placeholder, name, error, isObject = false, displayKey = 'name', valueKey = 'id', disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    if (disabled) return;
    const val = isObject ? option[valueKey] : option;
    onChange({ target: { name, value: val } });
    setIsOpen(false);
  };

  const currentDisplayValue = () => {
    if (!value) return placeholder;
    if (isObject) {
      const selectedOption = options.find(opt => opt[valueKey] === value);
      return selectedOption ? selectedOption[displayKey] : placeholder;
    }
    return value;
  };

  return (
    <div className="form-group" ref={dropdownRef}>
      <label>{label}</label>
      <div className={`custom-dropdown ${isOpen ? 'open' : ''} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
        <div className="dropdown-selected" onClick={() => !disabled && setIsOpen(!isOpen)}>
          <span>{currentDisplayValue()}</span>
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        {isOpen && (
          <div className="dropdown-options">
            {options.map((option, index) => {
              const displayVal = isObject ? option[displayKey] : option;
              const optionVal = isObject ? option[valueKey] : option;
              
              return (
                <div 
                  key={index} 
                  className={`dropdown-option ${value === optionVal ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {displayVal}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default CustomDropdown;
