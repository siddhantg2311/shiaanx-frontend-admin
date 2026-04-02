import React, { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiEdit, FiTrash, FiX, FiCheck, FiKey } from 'react-icons/fi';
import userService from '../services/userService';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import CustomDropdown from '../components/forms/CustomDropdown';
import '../styles/Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1 });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'CUSTOMER',
    status: 'active',
    company_name: '',
    gst: '',
    registered_address: ''
  });

  const [passwordFormData, setPasswordFormData] = useState({
    password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const response = await userService.getUsers({ limit, offset });
      const items = response.items || [];
      const pagination = response.meta || { totalItems: 0, totalPages: 1 };
      
      setUsers(items);
      setMeta(pagination);
      setStats({
        total: pagination.totalItems,
        active: items.filter(u => u.status === 'active').length
      });
    } catch (err) {
      toast.error(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      role: 'CUSTOMER',
      status: 'active',
      company_name: '',
      gst: '',
      registered_address: ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setIsEditMode(true);
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      company_name: user.company_name || '',
      gst: user.gst || '',
      registered_address: user.registered_address || ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenChangePasswordModal = (user) => {
    setCurrentUser(user);
    setPasswordFormData({
      password: '',
      confirm_password: ''
    });
    setErrors({});
    setIsChangePasswordModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setErrors({});
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
    setCurrentUser(null);
    setErrors({});
  };

  const validateField = (name, value, isPasswordOnly = false) => {
    let error = '';
    const currentFormData = isPasswordOnly ? passwordFormData : formData;

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Full name is required';
        break;
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email is invalid';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      case 'confirm_password':
        if (value !== currentFormData.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const fieldsToValidate = isEditMode ? ['name', 'email'] : ['name', 'email', 'password', 'confirm_password'];
    
    fieldsToValidate.forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return toast.error('Please fix the errors in the form');
    }

    setIsSubmitting(true);
    try {
      const { password, confirm_password, ...submitData } = formData;
      
      if (isEditMode) {
        await userService.updateUser(currentUser.id, submitData);
        toast.success('User updated successfully');
      } else {
        await userService.createUser({ ...submitData, password });
        toast.success('User created successfully');
      }
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'create'} user`;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    ['password', 'confirm_password'].forEach(key => {
      const error = validateField(key, passwordFormData[key], true);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return toast.error('Please fix the errors in the form');
    }

    setIsSubmitting(true);
    try {
      await userService.changePassword(currentUser.id, {
        password: passwordFormData.password,
        confirm_password: passwordFormData.confirm_password
      });
      toast.success('Password changed successfully');
      handleCloseChangePasswordModal();
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(userToDelete.id);
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading-container">Loading users...</div>;
  }

  return (
    <div className="users-container-wrapper">
      <div className="page-header">
        <div className="header-left">
          <h1>User Management</h1>
          <div className="user-stats">
            <span>Total Users: <strong>{stats.total}</strong></span>
            <span className="stat-divider">|</span>
            <span>Active: <strong>{stats.active}</strong></span>
          </div>
        </div>
        <div className="header-buttons">
          <button className="new-user-btn" onClick={handleOpenAddModal}>
            <FiUsers size={18} />
            Add New User
          </button>
        </div>
      </div>

      <div className="search-bar">
        <FiSearch size={20} color="#999" />
        <input 
          type="text" 
          placeholder="Search users by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Company</th>
              <th>GST</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.user_id || '-'}</strong></td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.company_name || '-'}</td>
                  <td>{user.gst || '-'}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt || user.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-icon-btn edit" onClick={() => handleOpenEditModal(user)} title="Edit User">
                        <FiEdit size={16} />
                      </button>
                      <button className="action-icon-btn key" onClick={() => handleOpenChangePasswordModal(user)} title="Change Password">
                        <FiKey size={16} />
                      </button>
                      <button className="action-icon-btn delete" onClick={() => handleOpenDeleteModal(user)} title="Delete User">
                        <FiTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
          className="page-btn"
        >
          Previous
        </button>
        <span className="page-info">
          Page {page} of {meta.totalPages}
        </span>
        <button 
          disabled={page >= meta.totalPages} 
          onClick={() => setPage(page + 1)}
          className="page-btn"
        >
          Next
        </button>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container glass user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit User' : 'Add New User'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="user-form" autoComplete="off" noValidate>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Enter full name"
                  className={errors.name ? 'error' : ''}
                  required 
                  autoComplete="none"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="Enter email address"
                  className={errors.email ? 'error' : ''}
                  required 
                  autoComplete="none"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company Name</label>
                  <input 
                    type="text" 
                    name="company_name" 
                    value={formData.company_name} 
                    onChange={handleInputChange} 
                    placeholder="Enter company name"
                    autoComplete="none"
                  />
                </div>
                <div className="form-group">
                  <label>GST Number</label>
                  <input 
                    type="text" 
                    name="gst" 
                    value={formData.gst} 
                    onChange={handleInputChange} 
                    placeholder="Enter GST number"
                    autoComplete="none"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Registered Address</label>
                <textarea 
                  name="registered_address" 
                  value={formData.registered_address} 
                  onChange={handleInputChange} 
                  placeholder="Enter registered address"
                  rows="3"
                  className="form-control-textarea"
                />
              </div>
              
              {!isEditMode && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      placeholder="Enter password"
                      className={errors.password ? 'error' : ''}
                      required 
                      autoComplete="new-password"
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input 
                      type="password" 
                      name="confirm_password" 
                      value={formData.confirm_password} 
                      onChange={handleInputChange} 
                      placeholder="Confirm password"
                      className={errors.confirm_password ? 'error' : ''}
                      required 
                      autoComplete="new-password"
                    />
                    {errors.confirm_password && <span className="error-message">{errors.confirm_password}</span>}
                  </div>
                </div>
              )}

              <div className="form-row">
                <CustomDropdown
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  options={[
                    { id: 'CUSTOMER', name: 'Customer' },
                    { id: 'ADMIN', name: 'Admin' },
                    { id: 'VENDOR', name: 'Vendor' }
                  ]}
                  isObject={true}
                  displayKey="name"
                  valueKey="id"
                />
                <CustomDropdown
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={[
                    { id: 'active', name: 'Active' },
                    { id: 'inactive', name: 'Inactive' },
                    { id: 'blocked', name: 'Blocked' }
                  ]}
                  isObject={true}
                  displayKey="name"
                  valueKey="id"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="modal-overlay" onClick={handleCloseChangePasswordModal}>
          <div className="modal-container glass user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button className="close-btn" onClick={handleCloseChangePasswordModal}>
                <FiX size={24} />
              </button>
            </div>
            <p className="modal-subtitle">Changing password for: <strong>{currentUser?.name}</strong></p>
            <form onSubmit={handleChangePasswordSubmit} className="user-form" autoComplete="off" noValidate>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={passwordFormData.password} 
                  onChange={handlePasswordInputChange} 
                  placeholder="Enter new password"
                  className={errors.password ? 'error' : ''}
                  required 
                  autoComplete="new-password"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirm_password" 
                  value={passwordFormData.confirm_password} 
                  onChange={handlePasswordInputChange} 
                  placeholder="Confirm new password"
                  className={errors.confirm_password ? 'error' : ''}
                  required 
                  autoComplete="new-password"
                />
                {errors.confirm_password && <span className="error-message">{errors.confirm_password}</span>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseChangePasswordModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

export default Users;
