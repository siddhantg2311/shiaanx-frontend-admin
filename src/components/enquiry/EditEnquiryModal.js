import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiMapPin, FiUser, FiInfo, FiChevronDown } from 'react-icons/fi';
import { MdOutlineEmail, MdOutlineUpdate } from 'react-icons/md';
import enquiryService from '../../services/enquiryService';
import toast from 'react-hot-toast';
import './AutoQuoteModal.css';

const EditEnquiryModal = ({ isOpen, onClose, enquiryData, onUpdate }) => {
  const [formData, setFormData] = useState({
    shipping_address: '',
    remarks: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (enquiryData) {
      setFormData({
        shipping_address: enquiryData.shipping_address || '',
        remarks: enquiryData.remarks || '',
      });
    }
  }, [enquiryData]);

  if (!isOpen || !enquiryData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const updated = await enquiryService.updateEnquiry(enquiryData.id, formData);
      toast.success('Enquiry updated successfully');
      onUpdate(updated);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to update enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="aq-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="aq-modal" style={{ width: 'min(650px, 95vw)', height: 'auto', maxHeight: '90vh' }}>
        <header className="aq-header">
          <div className="aq-header-left">
            <div className="aq-badge-dot" style={{ backgroundColor: 'var(--aq-amber)', width: 12, height: 12 }}></div>
            <div>
              <p className="aq-header-eyebrow">Enquiry Management</p>
              <h2 className="aq-header-title">Edit Details #{enquiryData.enquiry_number}</h2>
            </div>
          </div>
          <button className="aq-btn aq-btn-ghost" onClick={onClose} style={{ borderRadius: '50%', padding: '8px' }}>
            <FiX size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} style={{ overflowY: 'auto' }}>
          <div className="aq-content" style={{ padding: '32px' }}>
            
            {/* Customer Brief Card */}
            <div className="aq-card" style={{ marginBottom: '24px', background: 'var(--aq-soft)', padding: '20px', borderLeft: '4px solid var(--aq-teal)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ background: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <FiUser size={24} style={{ color: 'var(--aq-teal)' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--aq-ink)' }}>{enquiryData.customer?.name}</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--aq-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MdOutlineEmail size={14} /> {enquiryData.customer?.email}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
              <div className="aq-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiMapPin size={16} /> Shipping Address
                </label>
                <textarea 
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                  placeholder="Enter full logistics destination..."
                  style={{ minHeight: '100px' }}
                />
              </div>

              <div className="aq-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiInfo size={16} /> General Remarks
                </label>
                <textarea 
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Special instructions or customer requirements..."
                  style={{ minHeight: '120px' }}
                />
              </div>
            </div>
          </div>

          <footer className="aq-footer" style={{ borderTop: '1px solid var(--aq-line)', background: 'var(--aq-panel)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--aq-muted)', fontSize: '0.75rem' }}>
              <MdOutlineUpdate size={16} /> Last change logged for audit
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="aq-btn aq-btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="aq-btn aq-btn-primary" style={{ padding: '10px 24px' }}>
                <FiSave /> {isSubmitting ? 'Saving...' : 'Sync Changes'}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default EditEnquiryModal;
