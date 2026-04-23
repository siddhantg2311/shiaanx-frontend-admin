import React, { useState, useEffect } from 'react';
import { FiSliders, FiPlus, FiEdit, FiTrash, FiX, FiCheck } from 'react-icons/fi';
import masterAttributeService from '../services/masterAttributeService';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import '../styles/MasterAttributes.css';

const TABS = {
  TECHNOLOGY: 'TECHNOLOGY',
  MATERIAL: 'MATERIAL',
  FINISH: 'FINISH'
};

function MasterAttributes() {
  const [activeTab, setActiveTab] = useState(TABS.TECHNOLOGY);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', is_active: true, rate: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === TABS.TECHNOLOGY) {
        response = await masterAttributeService.getTechnologies({ limit: 100 });
      } else if (activeTab === TABS.MATERIAL) {
        response = await masterAttributeService.getMaterials({ limit: 100 });
      } else {
        response = await masterAttributeService.getFinishes({ limit: 100 });
      }
      setItems(response.items || []);
    } catch (err) {
      toast.error(`Failed to fetch ${activeTab.toLowerCase()}s`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentItem(null);
    setFormData({ name: '', description: '', is_active: true, rate: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      is_active: item.is_active,
      rate: item.rate || 0
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Name is required');

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        if (activeTab === TABS.TECHNOLOGY) await masterAttributeService.updateTechnology(currentItem.id, formData);
        else if (activeTab === TABS.MATERIAL) await masterAttributeService.updateMaterial(currentItem.id, formData);
        else await masterAttributeService.updateFinish(currentItem.id, formData);
        toast.success(`${activeTab} updated successfully`);
      } else {
        if (activeTab === TABS.TECHNOLOGY) await masterAttributeService.createTechnology(formData);
        else if (activeTab === TABS.MATERIAL) await masterAttributeService.createMaterial(formData);
        else await masterAttributeService.createFinish(formData);
        toast.success(`${activeTab} created successfully`);
      }
      handleCloseModal();
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (activeTab === TABS.TECHNOLOGY) await masterAttributeService.deleteTechnology(itemToDelete.id);
      else if (activeTab === TABS.MATERIAL) await masterAttributeService.deleteMaterial(itemToDelete.id);
      else await masterAttributeService.deleteFinish(itemToDelete.id);
      
      toast.success(`${activeTab} deleted successfully`);
      setIsDeleteModalOpen(false);
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="master-attributes-container">
      <div className="page-header">
        <div className="header-left">
          <h1>Master Attributes</h1>
          <p className="subtitle">Manage dropdown options for Enquiries and Orders</p>
        </div>
        <button className="add-btn" onClick={handleOpenAddModal}>
          <FiPlus size={18} />
          Add {activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}
        </button>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === TABS.TECHNOLOGY ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.TECHNOLOGY)}
        >
          Technologies
        </button>
        <button 
          className={`tab-btn ${activeTab === TABS.MATERIAL ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.MATERIAL)}
        >
          Materials
        </button>
        <button 
          className={`tab-btn ${activeTab === TABS.FINISH ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.FINISH)}
        >
          Finishes
        </button>
      </div>

      <div className="attributes-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="attributes-grid">
            {items.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Rate ({activeTab === TABS.TECHNOLOGY ? '₹/hr' : activeTab === TABS.MATERIAL ? '₹/kg' : '₹/unit'})</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td className="rate-cell"><strong>₹ {parseFloat(item.rate || 0).toLocaleString()}</strong></td>
                      <td className="desc-cell">{item.description || '-'}</td>
                      <td>
                        <span className={`status-badge ${item.is_active ? 'active' : 'inactive'}`}>
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn edit" onClick={() => handleOpenEditModal(item)}>
                            <FiEdit size={16} />
                          </button>
                          <button className="action-btn delete" onClick={() => handleOpenDeleteModal(item)}>
                            <FiTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No items found for {activeTab.toLowerCase()}</div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit' : 'Add'} {activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}</h2>
              <button className="close-btn" onClick={handleCloseModal}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="attribute-form">
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. CNC Machining"
                  required
                />
              </div>
              <div className="form-group">
                <label>Rate ({activeTab === TABS.TECHNOLOGY ? '₹ / hour' : activeTab === TABS.MATERIAL ? '₹ / kg' : '₹ / unit'})</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.rate} 
                  onChange={e => setFormData({...formData, rate: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter details..."
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <div className="status-chips">
                  <div 
                    className={`status-chip active ${formData.is_active ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, is_active: true})}
                  >
                    <FiCheck size={16} /> Active
                  </div>
                  <div 
                    className={`status-chip inactive ${!formData.is_active ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, is_active: false})}
                  >
                    <FiX size={16} /> Inactive
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Attribute"
        message={`Are you sure you want to delete "${itemToDelete?.name}"?`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}

export default MasterAttributes;
