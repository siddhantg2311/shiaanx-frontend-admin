import React from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'primary' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container glass" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX size={20} />
        </button>
        
        <div className="modal-content">
          <div className={`modal-icon ${type}`}>
            <FiAlertCircle size={24} />
          </div>
          <h3 className="modal-title">{title || 'Confirm Action'}</h3>
          <p className="modal-message">{message || 'Are you sure you want to proceed?'}</p>
        </div>
        
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            {cancelText || 'Cancel'}
          </button>
          <button className={`btn-confirm ${type}`} onClick={onConfirm}>
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
