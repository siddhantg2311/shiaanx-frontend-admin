import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiPackage, FiTruck, FiSearch, FiEdit2, FiPlus } from 'react-icons/fi';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import '../styles/Orders.css';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ total: 0, pages: 0, currentPage: 1 });
  const [openDropdownOrderId, setOpenDropdownOrderId] = useState(null);
  const [modalState, setModalState] = useState({ 
    isOpen: false, 
    orderId: null, 
    nextStatus: null 
  });

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const data = await orderService.list({ page, limit: 10 });
      setOrders(data.items || []);
      setPagination({
          total: data.meta?.totalItems || 0,
          pages: data.meta?.totalPages || 0,
          currentPage: data.meta?.currentPage || 1
      });
    } catch (err) {
      toast.error(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdownOrderId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleConfirmStatusChange = async () => {
    const { orderId, nextStatus } = modalState;
    try {
      await orderService.updateStatus(orderId, nextStatus, 'Status updated via interactive badge');
      toast.success(`Status updated to ${nextStatus}`);
      setModalState({ isOpen: false, orderId: null, nextStatus: null });
      fetchOrders(pagination.currentPage);
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
      setModalState({ ...modalState, isOpen: false });
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'DELIVERED':
        return <FiPackage size={18} />;
      case 'SHIPPED':
      case 'IN_TRANSIT':
        return <FiTruck size={18} />;
      default:
        return <FiShoppingBag size={18} />;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.technology?.name || order.processing_technology || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    processing: orders.filter(o => o.status === 'PROCESSING').length,
    transit: orders.filter(o => o.status === 'IN_TRANSIT' || o.status === 'SHIPPED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length
  };

  if (loading && orders.length === 0) return <div style={{ padding: '2rem' }}>Loading orders...</div>;

  return (
    <div className="orders-content" style={{ padding: '2rem' }}>
        <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#2d3748' }}>All Orders</h1>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/orders/new')}
            style={{ padding: '0.75rem 1.5rem' }}
          >
            <FiPlus size={20} /> New Order
          </button>
        </div>

        <div className="search-bar" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'white', padding: '0.75rem 1rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <FiSearch size={20} color="#999" />
          <input 
            type="text" 
            placeholder="Search orders by number, customer, technology..." 
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="orders-stats">
          <div className="stat-card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="stat-icon processing" style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef3c7', color: '#92400e' }}>
              <FiShoppingBag size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value" style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800 }}>{stats.processing}</span>
              <span className="stat-label" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Processing</span>
            </div>
          </div>
          
          <div className="stat-card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="stat-icon transit" style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#dbeafe', color: '#1e40af' }}>
              <FiTruck size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value" style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800 }}>{stats.transit}</span>
              <span className="stat-label" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>In Transit</span>
            </div>
          </div>
          
          <div className="stat-card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="stat-icon delivered" style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d1fae5', color: '#065f46' }}>
              <FiPackage size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value" style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800 }}>{stats.delivered}</span>
              <span className="stat-label" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Delivered</span>
            </div>
          </div>
        </div>

        <div className="orders-list" style={{ display: 'grid', gap: '1.5rem' }}>
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card" style={{ backgroundColor: 'white', padding: '1.75rem', borderRadius: '20px' }}>
              <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.25rem' }}>
                <div className="order-id-section">
                  <span className="order-id" style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-main)' }}>{order.order_number}</span>
                  <span className="order-date" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div style={{ position: 'relative' }}>
                  {(() => {
                    const allStatuses = ['PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
                    const availableNext = allStatuses.filter(s => s !== order.status);
                    const isDropdownOpen = openDropdownOrderId === order.id;

                    return (
                      <>
                        <div 
                          className={`status-badge ${order.status?.toLowerCase().replace(/_/g, '-')} ${availableNext.length > 0 ? 'interactive' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (availableNext.length > 0) {
                              setOpenDropdownOrderId(isDropdownOpen ? null : order.id);
                            }
                          }}
                          style={{ 
                              padding: '0.6rem 1.25rem', 
                              borderRadius: '12px', 
                              fontSize: '0.75rem', 
                              fontWeight: 800,
                              minWidth: '120px',
                              textAlign: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                              cursor: availableNext.length > 0 ? 'pointer' : 'default',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.2s ease',
                              border: isDropdownOpen ? '2px solid var(--primary)' : '2px solid transparent'
                          }}
                        >
                          {order.status?.replace(/_/g, ' ')}
                          {availableNext.length > 0 && <FiEdit2 size={12} style={{ opacity: 0.6 }} />}
                        </div>

                        {isDropdownOpen && (
                          <div className="custom-dropdown-menu" style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '0.5rem',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            zIndex: 100,
                            minWidth: '180px',
                            border: '1px solid var(--border)',
                            overflow: 'hidden'
                          }}>
                            <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', backgroundColor: '#f9fafb' }}>
                              MOVE TO...
                            </div>
                            {availableNext.map(nextStatus => (
                              <div 
                                key={nextStatus}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  setOpenDropdownOrderId(null);
                                  setModalState({
                                    isOpen: true,
                                    orderId: order.id,
                                    nextStatus: nextStatus
                                  });
                                }}
                                className="dropdown-item"
                                style={{
                                  padding: '0.875rem 1rem',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                  color: 'var(--text-main)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: nextStatus === 'CANCELLED' ? '#ef4444' : 'var(--primary)' }}></span>
                                {nextStatus.replace(/_/g, ' ')}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
              
              <div className="order-details" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem' }}>
                <div className="product-info">
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{order.technology?.name || order.processing_technology || 'Custom Part'}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-muted)' }}>
                    <p style={{ margin: 0, fontSize: '0.925rem' }}><strong>Customer:</strong> <span style={{ color: 'var(--text-main)' }}>{order.customer?.company_name ? `${order.customer.company_name} (${order.customer?.name})` : order.customer?.name}</span></p>
                    <p style={{ margin: 0, fontSize: '0.925rem' }}><strong>Quantity:</strong> <span style={{ color: 'var(--text-main)' }}>{order.quantity}</span></p>
                    <p className="tracking" style={{ margin: 0, fontSize: '0.925rem' }}><strong>Tracking:</strong> <span style={{ color: 'var(--primary)' }}>{order.tracking_number || 'Not Assigned'}</span></p>
                  </div>
                </div>
                <div className="order-price" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <span className="price-label" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Amount</span>
                  <span className="price-value" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em' }}>₹{order.final_amount}</span>
                </div>
              </div>
              
              <div className="order-actions" style={{ 
                display: 'grid', 
                gridTemplateColumns: order.status === 'PROCESSING' ? '1fr 1fr 1fr' : '1fr 1fr', 
                gap: '1rem', 
                marginTop: '1.75rem', 
                borderTop: '1px solid var(--border)', 
                paddingTop: '1.25rem' 
              }}>
                <button className="action-btn secondary" style={{ padding: '0.875rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => navigate(`/orders/${order.id}/track`)}>Timeline</button>
                {order.status === 'PROCESSING' && (
                  <button className="action-btn secondary" style={{ padding: '0.875rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => navigate(`/orders/${order.id}/edit`)}>Edit</button>
                )}
                <button className="action-btn primary" style={{ padding: '0.875rem', borderRadius: '12px', color: 'white', fontWeight: 700, cursor: 'pointer', border: 'none', fontSize: '0.85rem' }} onClick={() => navigate(`/orders/${order.id}`)}>Details</button>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '15px', marginTop: '2rem' }}>
            <FiShoppingBag size={64} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4a5568' }}>No Orders Found</h3>
            <p style={{ color: '#718096' }}>The order list is currently empty.</p>
          </div>
        )}

        <ConfirmationModal 
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ ...modalState, isOpen: false })}
          onConfirm={handleConfirmStatusChange}
          title="Update Order Status"
          message={`Are you sure you want to change this order status to ${modalState.nextStatus?.replace(/_/g, ' ')}?`}
          confirmText="Yes, Update"
          cancelText="No, Keep It"
          type={modalState.nextStatus === 'CANCELLED' ? 'danger' : 'primary'}
        />
    </div>
  );
}

export default Orders;
