import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiCheck, FiX } from 'react-icons/fi';
import '../../styles/EnquiryForm.css';

const MultiSelectDropdown = ({ 
  label, 
  options, 
  value = [], 
  onChange, 
  placeholder, 
  name, 
  error, 
  isObject = false, 
  displayKey = 'name', 
  valueKey = 'id', 
  disabled = false 
}) => {
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
    const optionVal = isObject ? option[valueKey] : option;
    
    let newValue;
    if (value.includes(optionVal)) {
      newValue = value.filter(v => v !== optionVal);
    } else {
      newValue = [...value, optionVal];
    }
    
    onChange({ target: { name, value: newValue } });
  };

  const currentDisplayValue = () => {
    if (!value || value.length === 0) return placeholder;
    if (isObject) {
      const selectedNames = options
        .filter(opt => value.includes(opt[valueKey]))
        .map(opt => opt[displayKey]);
      
      if (selectedNames.length === 0) return placeholder;
      if (selectedNames.length > 2) return `${selectedNames.length} items selected`;
      return selectedNames.join(', ');
    }
    return value.join(', ');
  };

  return (
    <div className="form-group" ref={dropdownRef}>
      <label>{label}</label>
      <div className={`custom-dropdown multi-select ${isOpen ? 'open' : ''} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
        <div className="dropdown-selected" onClick={() => !disabled && setIsOpen(!isOpen)}>
          <span className="selected-text-container">{currentDisplayValue()}</span>
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        {isOpen && (
          <div className="dropdown-options">
            {options.map((option, index) => {
              const displayVal = isObject ? option[displayKey] : option;
              const optionVal = isObject ? option[valueKey] : option;
              const isSelected = value.includes(optionVal);
              
              return (
                <div 
                  key={index} 
                  className={`dropdown-option multi ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  <div className="checkbox-replacement">
                    {isSelected && <FiCheck size={14} />}
                  </div>
                  <span>{displayVal}</span>
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

export default MultiSelectDropdown;
