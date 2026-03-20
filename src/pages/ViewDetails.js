import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiPackage, FiFileText, FiClock, FiTruck, FiEdit2 } from 'react-icons/fi';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';
import '../styles/ViewDetails.css';

function ViewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await orderService.getDetails(id);
        setOrder(data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch order details');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id, navigate]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading order details...</div>;
  if (!order) return <div style={{ padding: '2rem' }}>Order not found</div>;

  return (
    <div className="view-details-content" style={{ padding: '2rem' }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <FiArrowLeft size={24} />
        </button>
        <div className="details-header" style={{ border: 'none', marginBottom: 0, paddingBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h2>Order Details</h2>
          {order.status === 'PROCESSING' && (
            <button 
              className="btn-secondary" 
              onClick={() => navigate(`/orders/${id}/edit`)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem' }}
            >
              <FiEdit2 size={18} /> Edit Order
            </button>
          )}
        </div>
      </div>

      <div className="order-id-display">
        <FiShoppingBag size={20} color="var(--primary)" />
        <span style={{ fontWeight: 800 }}>ORD #{order.order_number}</span>
      </div>

      <div className="details-layout">
        <div className="left-column">
          <div className="detail-section">
            <h3 className="section-title"><FiShoppingBag size={20} /> Project Specifications</h3>
            <div className="data-grid">
              <div className="data-item">
                <label>Technology</label>
                <span>{order.technology?.name || order.processing_technology}</span>
              </div>
              <div className="data-item">
                <label>Material</label>
                <span>{order.materialRef?.name || order.material}</span>
              </div>
              <div className="data-item">
                <label>Finish</label>
                <span>{order.finishRef?.name || order.finishes}</span>
              </div>
              <div className="data-item">
                <label>Quantity</label>
                <span>{order.quantity} Units</span>
              </div>
              <div className="data-item">
                <label>Tracking ID</label>
                <span style={{ color: 'var(--primary)' }}>{order.tracking_number || 'Awaiting Logistics'}</span>
              </div>
              <div className="data-item">
                <label>Expected Arrival</label>
                <span>{order.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString() : 'To be determined'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title"><FiPackage size={20} /> Client Information</h3>
            <div className="data-grid">
              <div className="data-item">
                <label>Customer Name</label>
                <span>{order.customer?.name}</span>
              </div>
              <div className="data-item">
                <label>Inquiry Origin</label>
                <span>{order.enquiry?.enquiry_number || 'Direct Order'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="amount-card">
            <div className="amount-label">Final Investment</div>
            <div className="amount-value">₹{order.final_amount}</div>
          </div>

          <div className="detail-section">
            <h3 className="section-title"><FiFileText size={20} /> Associated Documents</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="info-files" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {order.enquiry?.documents && order.enquiry.documents.filter(doc => doc.document_type !== 'ORDER_DOCUMENT').length > 0 ? (
                  order.enquiry.documents
                    .filter(doc => doc.document_type !== 'ORDER_DOCUMENT')
                    .map((doc, index) => (
                    <div key={index} className="file-item-card" style={{ 
                      padding: '0.75rem 1rem', 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: 'var(--background)', borderRadius: '6px', color: 'var(--primary)' }}>
                          <FiFileText size={18} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: 600, 
                            color: 'var(--text-main)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {doc.file_name}
                          </div>
                          {doc.uploader && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Uploaded by {doc.uploader.name}
                            </div>
                          )}
                        </div>
                      </div>
                      <a 
                        href={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${doc.file_path}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-view-file"
                        style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: 700, 
                          color: 'var(--primary)',
                          textDecoration: 'none',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '6px',
                          border: '1px solid var(--primary)',
                          backgroundColor: 'transparent',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        View
                      </a>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--background)', borderRadius: '12px', border: '1px dotted var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No enquiry documents found.
                  </div>
                )}
              </div>

              {order.remarks && (
                <div style={{ padding: '1rem', backgroundColor: '#fffaf0', borderRadius: '12px', border: '1px solid #feebc8', fontSize: '0.9rem', color: '#744210' }}>
                  <strong>Admin Notes:</strong> {order.remarks}
                </div>
              )}
              
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                Files shown here were uploaded during the enquiry phase.
              </p>
            </div>
          </div>

          <button 
            className="btn-confirm" 
            style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem' }}
            onClick={() => navigate(`/orders/${id}/track`)}
          >
            Open Live Timeline
          </button>
        </div>
      </div>

      <div className="status-history-section">
        <h3 className="section-title" style={{ border: 'none' }}><FiClock size={20} /> Status History</h3>
        <div className="history-timeline">
            {order.statusHistory && order.statusHistory.length > 0 ? (
                [...order.statusHistory]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((history, index) => (
                    <div key={history.id} className={`history-item ${index === 0 ? 'active' : ''}`}>
                        <div className="history-dot"></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 800, color: index === 0 ? 'var(--primary)' : 'var(--text-main)' }}>
                                    {history.to_status.replace(/_/g, ' ')}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    {new Date(history.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{history.change_reason || 'Manual status transition'}</p>
                            {history.changer && (
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginTop: '0.5rem' }}>
                                    Verified by {history.changer.name}
                                </span>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--background)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Initial processing started on {new Date(order.createdAt).toLocaleDateString()}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default ViewDetails;
