import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiSave, FiChevronDown, FiPlus } from 'react-icons/fi';
import { MdOutlineArchitecture, MdNumbers, MdOutlineDescription } from 'react-icons/md';
import enquiryService from '../../services/enquiryService';
import masterAttributeService from '../../services/masterAttributeService';
import toast from 'react-hot-toast';
import './AutoQuoteModal.css';

// ─── Custom Select Component ──────────────────────────────────────────────────
const CustomSelect = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  
  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="aq-field" ref={containerRef} style={{ position: 'relative' }}>
      <label>{label}</label>
      <div 
        className={`custom-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: '#fffdf9',
          border: `1px solid ${isOpen ? 'var(--aq-teal)' : 'rgba(65,50,35,0.18)'}`,
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          minHeight: '42px',
          boxSizing: 'border-box'
        }}
      >
        <span style={{ 
          fontSize: '0.88rem', 
          color: selectedOption ? 'var(--aq-ink)' : 'var(--aq-muted)',
          fontWeight: selectedOption ? '700' : '500'
        }}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <FiChevronDown style={{ 
          color: 'var(--aq-muted)', 
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s'
        }} />
      </div>

      {isOpen && (
        <div 
          className="custom-select-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 5px)',
            left: 0,
            right: 0,
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(30,20,10,0.15)',
            border: '1px solid var(--aq-line)',
            zIndex: 100,
            maxHeight: '250px',
            overflowY: 'auto',
            padding: '6px'
          }}
        >
          {options.length === 0 ? (
            <div style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--aq-muted)', textAlign: 'center' }}>No options available</div>
          ) : (
            options.map(opt => (
              <div 
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                style={{
                  padding: '10px 12px',
                  fontSize: '0.86rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  background: value === opt.id ? 'rgba(27,107,92,0.08)' : 'transparent',
                  color: value === opt.id ? 'var(--aq-teal)' : 'var(--aq-ink)',
                  fontWeight: value === opt.id ? '700' : '500',
                  marginBottom: '2px'
                }}
                onMouseOver={(e) => { if(value !== opt.id) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                onMouseOut={(e) => { if(value !== opt.id) e.currentTarget.style.background = 'transparent'; }}
              >
                {opt.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const AddPartModal = ({ isOpen, onClose, enquiryId, onAdded }) => {
  const [formData, setFormData] = useState({
    part_name: '',
    quantity: 1,
    remarks: '',
    material_ids: [],
    technology_ids: [],
    finish_ids: []
  });

  const [options, setOptions] = useState({
    materials: [],
    technologies: [],
    finishes: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [m, t, f] = await Promise.all([
          masterAttributeService.getMaterials({ limit: 100 }),
          masterAttributeService.getTechnologies({ limit: 100 }),
          masterAttributeService.getFinishes({ limit: 100 })
        ]);
        setOptions({
          materials: m.items || [],
          technologies: t.items || [],
          finishes: f.items || []
        });
      } catch (err) {
        console.error('Failed to fetch options:', err);
      }
    };
    if (isOpen) {
      fetchOptions();
      setFormData({
        part_name: '',
        quantity: 1,
        remarks: '',
        material_ids: [],
        technology_ids: [],
        finish_ids: []
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    if (!formData.part_name) {
      toast.error('Part name is required');
      return;
    }
    try {
      setIsSubmitting(true);
      const updatedEnquiry = await enquiryService.addPart(enquiryId, formData);
      toast.success('Part added successfully');
      onAdded(updatedEnquiry);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to add part');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="aq-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="aq-modal" style={{ width: 'min(650px, 95vw)', height: 'auto', maxHeight: '90vh' }}>
        
        <header className="aq-header">
          <div className="aq-header-left">
            <div className="aq-badge-dot" style={{ backgroundColor: 'var(--aq-teal)', width: 12, height: 12 }}></div>
            <div>
              <p className="aq-header-eyebrow">Part Configuration</p>
              <h2 className="aq-header-title">Add New Part</h2>
            </div>
          </div>
          <button className="aq-btn aq-btn-ghost" onClick={onClose} style={{ borderRadius: '50%', padding: '8px' }}>
            <FiX size={20} />
          </button>
        </header>

        <form onSubmit={handleSaveInfo} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div className="aq-content" style={{ padding: '32px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <MdOutlineArchitecture size={24} style={{ color: 'var(--aq-teal)' }} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--aq-ink)' }}>Design Specifications</h3>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
              <div className="aq-field">
                <label>Part Name *</label>
                <input 
                  value={formData.part_name}
                  onChange={e => setFormData({...formData, part_name: e.target.value})}
                  placeholder="e.g. Back Cover, Main Housing..."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <CustomSelect 
                  label="Technology"
                  options={options.technologies}
                  value={formData.technology_ids[0]}
                  onChange={(val) => setFormData({...formData, technology_ids: [val]})}
                  placeholder="Select Process"
                />

                <CustomSelect 
                  label="Material"
                  options={options.materials}
                  value={formData.material_ids[0]}
                  onChange={(val) => setFormData({...formData, material_ids: [val]})}
                  placeholder="Select Material"
                />

                <CustomSelect 
                  label="Surface Finish"
                  options={options.finishes}
                  value={formData.finish_ids[0]}
                  onChange={(val) => setFormData({...formData, finish_ids: [val]})}
                  placeholder="Select Finish"
                />
              </div>

              <div className="aq-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MdNumbers /> Total Quantity</label>
                <input 
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                  style={{ width: '120px' }}
                />
              </div>

              <div className="aq-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MdOutlineDescription /> Technical Remarks</label>
                <textarea 
                  value={formData.remarks}
                  onChange={e => setFormData({...formData, remarks: e.target.value})}
                  placeholder="Enter specific manufacturing requirements..."
                  style={{ minHeight: '120px' }}
                />
              </div>
            </div>
          </div>

          <footer className="aq-footer">
            <p style={{ fontSize: '0.8rem', color: 'var(--aq-muted)', margin: 0 }}>You can attach CAD files to this part after creating it.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={onClose} className="aq-btn aq-btn-secondary">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="aq-btn aq-btn-primary">
                <FiPlus style={{ marginRight: '6px' }} /> {isSubmitting ? 'Adding...' : 'Add Part'}
              </button>
            </div>
          </footer>
        </form>

      </div>
    </div>
  );
};

export default AddPartModal;
