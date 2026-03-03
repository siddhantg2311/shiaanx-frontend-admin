import React from 'react';
import { FiPaperclip } from 'react-icons/fi';

const EnquiryInfo = ({ data, onApprovePO, onRejectPO, onUpdateStatus }) => {
  if (!data) return <div>Loading...</div>;

  const poDocument = data.documents?.find(doc => doc.document_type === 'PURCHASE_ORDER');

  const handleApprove = () => {
    onApprovePO();
  };

  const handleReject = () => {
    const reason = window.prompt("Enter rejection reason:");
    if (reason) onRejectPO(reason);
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Helper date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

  return (
    <div className="enquiry-info-panel"> 
      <div className="info-header">
        <div className="header-top-row">
          <h2 className="info-title">Enquiry #{data.enquiry_number}</h2>
          
          {data.status === 'PO_UPLOADED' && (
            <div className="header-actions">
                <button 
                onClick={handleReject}
                className="btn-cancel-action"
                style={{ border: '1px solid #e53e3e', backgroundColor: '#fff5f5' }}
                >
                Reject PO
                </button>
                <button 
                onClick={handleApprove}
                className="confirm-order-btn"
                style={{ backgroundColor: '#38a169' }}
                >
                Approve & Generate Order
                </button>
            </div>
          )}
        </div>
        <div className="header-status-row">
          <span className={`status-badge ${data.status?.toLowerCase()}`}>
            {formatStatus(data.status)}
          </span>
          <span className="enquiry-id-badge">User: {data.customer?.name}</span>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <label>Created Date</label>
          <p>{formatDate(data.created_at || data.createdAt)}</p>
        </div>

        <div className="info-item">
          <label>Processing Technology</label>
          <p>{data.processing_technology || 'N/A'}</p>
        </div>
        <div className="info-item">
          <label>Material</label>
          <p>{data.material || 'N/A'}</p>
        </div>

        <div className="info-item">
          <label>Finish</label>
          <p>{data.finishes || 'N/A'}</p>
        </div>
        <div className="info-item">
          <label>Quantity</label>
          <p>{data.quantity} Units</p>
        </div>

        <div className="info-item full-width">
          <label>Remarks</label>
          <p>{data.remarks || 'No remarks provided.'}</p>
        </div>

        <div className="info-item full-width">
          <label>Shipping Address</label>
          <p style={{ whiteSpace: 'pre-line' }}>{data.shipping_address || 'N/A'}</p>
        </div>

        <div className="info-item full-width">
          <label>Attached Files</label>
          <div className="info-files">
            {data.documents && data.documents.length > 0 ? (
              data.documents.map((doc, index) => (
                <div key={index} className="file-chip">
                  <FiPaperclip size={14} style={{ marginRight: '6px' }} />
                  {doc.file_name}
                </div>
              ))
            ) : (
              <p style={{ color: '#a0aec0', fontStyle: 'italic' }}>No files uploaded</p>
            )}
          </div>
        </div>
        
        {poDocument && (
           <div className="info-item full-width" style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #38a169', borderRadius: '8px', backgroundColor: '#f0fff4' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#2f855a', fontWeight: 600, marginBottom: '0.4rem' }}>Uploaded Purchase Order</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>{poDocument.file_name}</span>
                <a 
                  href={poDocument.file_path.startsWith('http') ? poDocument.file_path : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${poDocument.file_path}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: '#2f855a', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  View PO
                </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EnquiryInfo;
