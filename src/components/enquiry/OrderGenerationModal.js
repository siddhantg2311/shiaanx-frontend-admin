import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const OrderGenerationModal = ({ isOpen, onClose, onSubmit, enquiryData }) => {
  const [formData, setFormData] = useState({
    quantity: enquiryData?.quantity || 1,
    total_amount: '',
    tax_amount: '0',
    discount_amount: '0',
    expected_delivery_date: '',
    admin_notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Generate Order</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Quantity</label>
              <input 
                type="number" 
                name="quantity" 
                value={formData.quantity} 
                onChange={handleChange} 
                required 
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label>Total Amount (Basic)</label>
              <input 
                type="number" 
                name="total_amount" 
                placeholder="0.00"
                value={formData.total_amount} 
                onChange={handleChange} 
                required 
                step="0.01"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label>Tax Amount</label>
                    <input 
                        type="number" 
                        name="tax_amount" 
                        value={formData.tax_amount} 
                        onChange={handleChange} 
                        step="0.01"
                    />
                </div>
                <div className="form-group">
                    <label>Discount Amount</label>
                    <input 
                        type="number" 
                        name="discount_amount" 
                        value={formData.discount_amount} 
                        onChange={handleChange} 
                        step="0.01"
                    />
                </div>
            </div>

            <div className="form-group">
              <label>Expected Delivery Date</label>
              <input 
                type="date" 
                name="expected_delivery_date" 
                value={formData.expected_delivery_date} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Admin Notes</label>
              <textarea 
                name="admin_notes" 
                value={formData.admin_notes} 
                onChange={handleChange} 
                rows="3"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-confirm">Generate Order</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderGenerationModal;
