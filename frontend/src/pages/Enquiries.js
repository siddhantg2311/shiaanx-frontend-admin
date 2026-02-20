import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiSearch, FiAlertCircle } from 'react-icons/fi';
import enquiryService from '../services/enquiryService';
import toast from 'react-hot-toast';
import '../styles/Enquiries.css';

function Enquiries() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, ready: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1 });

  useEffect(() => {
    fetchEnquiries();
  }, [page]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const response = await enquiryService.getEnquiries({ limit, offset });
      const items = response.items || [];
      const pagination = response.meta || { totalItems: 0, totalPages: 1 };

      setEnquiries(items);
      setMeta(pagination);
      
      // Calculate simple stats from items
      setStats({
        pending: items.filter(e => e.status?.toLowerCase() === 'pending').length,
        ready: items.filter(e => e.status?.toLowerCase() === 'quoted' || e.status?.toLowerCase() === 'order_generated').length
      });
    } catch (err) {
      toast.error(err.message || 'Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const filteredEnquiries = enquiries.filter(enquiry => 
    enquiry.enquiry_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading-container">Loading enquiries...</div>;
  }

  return (
    <>
      <div className="page-header">
        <div className="header-left">
          <h1>All Enquiries</h1>
          <div className="enquiry-stats">
            <span>Quotes Pending: <strong>{stats.pending}</strong></span>
            <span className="stat-divider">|</span>
            <span>Quotes Ready: <strong>{stats.ready}</strong></span>
          </div>
        </div>
        <div className="header-buttons">
          <button className="new-enquiry-btn" onClick={() => navigate('/make-enquiry')}>
            <FiMessageSquare size={18} />
            Make Enquiry
          </button>
          <button className="new-issues-btn">
            <FiAlertCircle size={18} />
            Flagged Issues
          </button>
        </div>
      </div>

      <div className="search-bar">
        <FiSearch size={20} color="#999" />
        <input 
          type="text" 
          placeholder="Search enquiries by user or enquiry number..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="enquiries-list">
        {filteredEnquiries.length > 0 ? (
          filteredEnquiries.map(enquiry => (
            <div key={enquiry.id} className="enquiry-card">
              <div className="enquiry-header">
                <div>
                  <h3>Enquiry #{enquiry.enquiry_number}</h3>
                  <p className="user-name">User: {enquiry.customer?.name || 'Unknown'}</p>
                </div>
                <span
                  className={`status-badge quote ${enquiry.status.toLowerCase()}`}
                >
                  {formatStatus(enquiry.status)}
                </span>
              </div>
              <p className="enquiry-message">{enquiry.remarks || enquiry.message || 'No remarks provided'}</p>
              <div className="enquiry-footer">
                <div className="footer-left">
                  <span className="enquiry-date">{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                </div>
                <button className="view-btn" onClick={() => navigate(`/enquiries/${enquiry.id}`)}>View Details</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <FiMessageSquare size={64} color="#ccc" />
            <h3>No Enquiries Found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {enquiries.length > 0 && (
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
      )}
    </>
  );
}

export default Enquiries;
