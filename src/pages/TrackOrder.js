import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiCheckCircle, FiEdit2, FiTruck, FiFileText, FiUpload, FiX, FiDownload } from 'react-icons/fi';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import '../styles/TrackOrder.css';

function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const data = await orderService.getDetails(id);
      setOrder(data);
      setNewStatus(data.status);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id, navigate]);

  const handleUpdateStatus = async () => {
      try {
          await orderService.updateStatus(id, newStatus, 'Status updated by admin');
          toast.success('Order status updated');
          setIsEditingStatus(false);
          setIsModalOpen(false);
          fetchOrderDetails();
      } catch (err) {
          toast.error(err.message || 'Failed to update status');
          setIsModalOpen(false);
      }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const submitDocuments = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    try {
      await orderService.uploadDocuments(id, selectedFiles);
      toast.success('Documents uploaded successfully');
      setSelectedFiles([]);
      fetchOrderDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to upload documents');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading timeline...</div>;
  if (!order) return <div style={{ padding: '2rem' }}>Order not found</div>;

  // Define valid transitions (matching backend)
  const validTransitions = {
      'PROCESSING': ['IN_TRANSIT', 'CANCELLED'],
      'IN_TRANSIT': ['DELIVERED', 'CANCELLED'],
      'DELIVERED': [],
      'CANCELLED': []
  };

  const availableNextStatuses = validTransitions[order.status] || [];

  // Combine status history and documents into events
  const events = [
    ...(order.statusHistory || []).map(h => ({ ...h, type: 'STATUS', date: new Date(h.createdAt) })),
    ...(order.enquiry?.documents || []).map(d => ({ ...d, type: 'DOCUMENT', date: new Date(d.createdAt) }))
  ].sort((a, b) => b.date - a.date);
  return (
    <div className="track-order-content" style={{ padding: '2rem' }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <FiArrowLeft size={24} />
        </button>
        <h2 className="page-title" style={{ margin: 0 }}>Order Timeline</h2>
      </div>

      <div className="item-id-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <span className="item-label">Order Number</span>
            <div className="item-value" style={{ marginTop: '0.25rem' }}>{order.order_number}</div>
          </div>
          <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border)' }}></div>
          <div>
            <span className="item-label">Customer</span>
            <div className="item-value" style={{ marginTop: '0.25rem' }}>{order.customer?.name}</div>
          </div>
        </div>
      </div>

      <div className="split-box" style={{ display: 'flex', marginTop: '2.5rem' }}>
        <div className="split-left" style={{ flex: '1.2' }}>
          <h3>Order Journey</h3>
          <div className="timeline-container">
              {events.length > 0 ? (
                  events.map((event, index) => (
                      <div key={event.id} className="timeline-item" style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                          {index !== events.length - 1 && (
                              <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-24px', width: '2px', background: 'var(--border)' }}></div>
                          )}
                          <div className="timeline-marker" style={{ 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '50%', 
                              backgroundColor: event.type === 'STATUS' ? 'var(--primary)' : '#10b981', 
                              border: `6px solid ${event.type === 'STATUS' ? 'var(--primary-light)' : '#d1fae5'}`, 
                              zIndex: 1, 
                              marginTop: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                          }}>
                          </div>
                          <div className="timeline-content" style={{ flex: 1, paddingBottom: '2.5rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      {event.type === 'STATUS' ? <FiClock size={14} color="var(--primary)" /> : <FiFileText size={14} color="#059669" />}
                                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                                          {event.type === 'STATUS' ? event.to_status.replace(/_/g, ' ') : `Document: ${event.file_name}`}
                                      </span>
                                  </div>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                      {event.date.toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                              </div>
                              
                              {event.type === 'STATUS' ? (
                                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{event.change_reason || 'Status updated by system'}</p>
                              ) : (
                                  <div style={{ marginTop: '0.75rem' }}>
                                      <button 
                                          className="blue-box" 
                                          onClick={() => window.open(`http://localhost:8000/${event.file_path}`, '_blank')}
                                          style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', border: 'none', background: '#f0fdf4', color: '#166534', fontWeight: 700 }}
                                      >
                                          <FiDownload size={14} /> View Document ({(event.file_size_kb / 1024).toFixed(2)} MB)
                                      </button>
                                  </div>
                              )}

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800 }}>
                                      {(event.changer?.name || event.uploader?.name || 'S').charAt(0)}
                                  </div>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{event.changer?.name || event.uploader?.name || 'System'}</span>
                              </div>
                          </div>
                      </div>
                  ))
              ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: 'var(--background)', borderRadius: '12px' }}>
                      <FiClock size={20} color="var(--primary)" />
                      <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>No project updates recorded yet.</span>
                  </div>
              )}
          </div>
        </div>
        
        <div className="split-right" style={{ flex: '0.8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Current Control</h3>
              <button 
                  onClick={() => {
                      if (availableNextStatuses.length > 0) {
                          setIsEditingStatus(!isEditingStatus);
                          if (!isEditingStatus) setNewStatus(availableNextStatuses[0]);
                      } else {
                          toast.error('No further status updates are possible for this order.');
                      }
                  }}
                  disabled={availableNextStatuses.length === 0}
                  style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      background: availableNextStatuses.length > 0 ? 'var(--primary-light)' : 'var(--background)', 
                      border: 'none', 
                      color: availableNextStatuses.length > 0 ? 'var(--primary)' : 'var(--text-muted)', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '8px', 
                      cursor: availableNextStatuses.length > 0 ? 'pointer' : 'not-allowed', 
                      fontWeight: 700, 
                      fontSize: '0.875rem' 
                  }}
              >
                  <FiEdit2 size={14} /> Update Status
              </button>
          </div>
          
          <div className="status-control">
            {isEditingStatus ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <select 
                        value={newStatus} 
                        onChange={(e) => setNewStatus(e.target.value)}
                        style={{ width: '100%', borderRadius: '12px' }}
                    >
                        {availableNextStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Confirm
                        </button>
                        <button 
                            onClick={() => setIsEditingStatus(false)}
                            style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #1a4d94 100%)', color: 'white', padding: '2rem', borderRadius: '20px', textAlign: 'center', boxShadow: '0 8px 16px rgba(33, 96, 183, 0.15)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Actual Status</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{order.status.replace(/_/g, ' ')}</div>
                </div>
            )}
            
            <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Upload Documents</h3>
                <div 
                    onClick={() => document.getElementById('file-upload').click()}
                    style={{ border: '2px dashed var(--border)', borderRadius: '16px', padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                    <FiUpload size={32} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)' }}>Click to add files</p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>PDF, JPG, PNG or DWG (Max 10MB)</p>
                    <input id="file-upload" type="file" multiple hidden onChange={handleFileUpload} />
                </div>

                {selectedFiles.length > 0 && (
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {selectedFiles.map((file, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--background)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                                    <FiFileText size={16} color="var(--primary)" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                                </div>
                                <FiX size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => removeFile(idx)} />
                            </div>
                        ))}
                        <button 
                            className="btn-confirm" 
                            disabled={isUploading}
                            onClick={submitDocuments}
                            style={{ marginTop: '0.5rem', width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.7 : 1 }}
                        >
                            {isUploading ? 'Uploading...' : 'Verify & Post Documents'}
                        </button>
                    </div>
                )}
            </div>
            
            <div style={{ marginTop: '2.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'block' }}>Logistics Tracking</label>
                <div className="blue-box" style={{ padding: '1.25rem', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FiTruck size={20} color="var(--primary)" />
                    {order.tracking_number || 'Awaiting tracking ID'}
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-section" style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
        <div className="bottom-left">
          <div className="field-section">
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Expected Delivery Window</label>
            <div className="blue-box" style={{ padding: '1.25rem', fontWeight: 600 }}>
                {order.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : 'To be determined'}
            </div>
          </div>
          <button 
            className="view-timeline-btn" 
            onClick={() => navigate(`/orders/${id}`)}
            style={{ marginTop: '1.5rem', width: '100%' }}
          >
            Go to Full Specifications
          </button>
        </div>
        <div className="bottom-right">
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Technical Method</label>
          <div className="blue-box" style={{ padding: '1.25rem', fontWeight: 600 }}>
              {order.processing_technology}
          </div>
        </div>
      </div>
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleUpdateStatus}
        title="Update Order Status"
        message={`Are you sure you want to change this order status to ${newStatus?.replace(/_/g, ' ')}?`}
        confirmText="Yes, Update"
        cancelText="No, Keep It"
        type={newStatus === 'CANCELLED' ? 'danger' : 'primary'}
      />
    </div>
  );
}

export default TrackOrder;
