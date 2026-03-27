import React, { useState } from 'react';
import { 
  FiPaperclip, FiUpload, FiCheckCircle, FiInfo, FiBox, 
  FiTruck, FiFileText, FiTool, FiCalendar, FiUser, FiPackage,
  FiPlus, FiX
} from 'react-icons/fi';
import enquiryService from '../../services/enquiryService';
import toast from 'react-hot-toast';

const EnquiryInfo = ({ data, onApprovePO, onRejectPO, onUpdateStatus }) => {
  const [quoteFile, setQuoteFile] = useState(null);
  const [isUploadingQuote, setIsUploadingQuote] = useState(false);

  // DFM Modal state
  const [isDfmModalOpen, setIsDfmModalOpen] = useState(false);
  const [dfmFiles, setDfmFiles] = useState([]);
  const [dfmRemarks, setDfmRemarks] = useState('');
  const [isUploadingDfm, setIsUploadingDfm] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) setDfmFiles(prev => [...prev, ...files]);
  };

  if (!data) return <div className="info-card">Loading...</div>;

  const quotes = data.documents?.filter(doc => doc.document_type === 'QUOTE') || [];
  const dfms = data.documents?.filter(doc => doc.document_type === 'DFM') || [];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const getStatusColor = (status) => {
    const positive = ['QUOTED', 'ORDER_GENERATED', 'READY', 'PO_UPLOADED'];
    return positive.includes(status) ? { bg: '#dcfce7', color: '#166534' } : { bg: '#fef3c7', color: '#92400e' };
  };

  const handleQuoteUpload = async () => {
    if (!quoteFile) { toast.error("Please select a file"); return; }
    try {
      setIsUploadingQuote(true);
      await enquiryService.uploadEnquiryDocuments(data.id, [quoteFile], null, 'QUOTE');
      toast.success("Quote uploaded successfully");
      setQuoteFile(null);
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Failed to upload quote");
    } finally {
      setIsUploadingQuote(false);
    }
  };

  const handleDfmUpload = async () => {
    if (dfmFiles.length === 0) { toast.error("Please select at least one file for DFM"); return; }
    try {
      setIsUploadingDfm(true);
      await enquiryService.uploadEnquiryDocuments(data.id, dfmFiles, null, 'DFM', dfmRemarks);
      toast.success("DFM uploaded successfully");
      setDfmFiles([]);
      setDfmRemarks('');
      setIsDfmModalOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Failed to upload DFM");
    } finally {
      setIsUploadingDfm(false);
    }
  };

  const handleApprove = () => {
    onApprovePO();
  };

  const handleReject = async () => {
    try {
      await onRejectPO();
      toast.success("Purchase Order rejected");
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Failed to reject PO");
    }
  };

  const statusColors = getStatusColor(data.status);

  return (
    <div className="enquiry-info-wrapper">
      {/* DFM Upload Modal */}
      {isDfmModalOpen && (
        <div className="dfm-modal-overlay" onClick={() => setIsDfmModalOpen(false)}>
          <div className="dfm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dfm-modal-header">
              <h3><FiTool /> Add DFM Analysis</h3>
              <button 
                className="dfm-modal-close" 
                onClick={() => { setIsDfmModalOpen(false); setDfmFiles([]); setDfmRemarks(''); }}
              >
                <FiX />
              </button>
            </div>
            <div className="dfm-modal-body">
              <div className="dfm-modal-field">
                <label className="dfm-modal-label">DFM Report File <span style={{ color: '#e53e3e' }}>*</span></label>
                <div 
                  className={`dfm-modal-file-zone ${isDragOver ? 'drag-over' : ''} ${dfmFiles.length > 0 ? 'has-file' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <FiUpload size={28} color={isDragOver ? '#16a34a' : '#94a3b8'} />
                  <p className="dfm-zone-title">
                    {isDragOver ? 'Drop files here' : 'Drag & drop or click to browse'}
                  </p>
                  <p className="dfm-zone-hint">PDF, Images, DWG, STEP, or any report format</p>
                  <input 
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) setDfmFiles(prev => [...prev, ...files]);
                    }}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                </div>

                {/* File Previews */}
                {dfmFiles.length > 0 && (
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>SELECTED FILES ({dfmFiles.length})</span>
                      <button 
                        onClick={() => setDfmFiles([])} 
                        style={{ fontSize: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Clear All
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.75rem' }}>
                      {dfmFiles.map((file, idx) => {
                        const isImage = file.type.startsWith('image/');
                        return (
                          <div key={idx} style={{ position: 'relative', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px', backgroundColor: '#f8fafc' }}>
                            <button 
                              onClick={() => setDfmFiles(prev => prev.filter((_, i) => i !== idx))}
                              style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', zIndex: 5, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                            >
                              <FiX size={12} />
                            </button>
                            {isImage ? (
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt="preview" 
                                style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '6px' }} 
                              />
                            ) : (
                              <div style={{ width: '100%', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff', borderRadius: '6px', color: '#2563eb' }}>
                                <FiFileText size={24} />
                              </div>
                            )}
                            <div style={{ fontSize: '0.65rem', color: '#475569', textAlign: 'center', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 2px' }}>
                              {file.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="dfm-modal-field">
                <label className="dfm-modal-label">Remarks for Customer</label>
                <textarea
                  placeholder="Describe findings, changes required, or notes..."
                  value={dfmRemarks}
                  onChange={(e) => setDfmRemarks(e.target.value)}
                  className="dfm-modal-textarea"
                />
              </div>
            </div>
            <div className="dfm-modal-footer">
              <button 
                className="dfm-modal-cancel"
                onClick={() => { setIsDfmModalOpen(false); setDfmFiles([]); setDfmRemarks(''); }}
              >
                Cancel
              </button>
              <button 
                className="dfm-modal-submit"
                onClick={handleDfmUpload}
                disabled={isUploadingDfm || dfmFiles.length === 0}
              >
                {isUploadingDfm ? 'Uploading...' : 'Upload DFM'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="breadcrumb-nav">
        <span className="breadcrumb-item" onClick={() => window.location.href = '/'}>All Items</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item" style={{ fontWeight: 600, color: '#0f172a' }}>{data.enquiry_number}</span>
      </nav>

      <header className="dashboard-header">
        <h1 className="dashboard-title">Enquiry Details</h1>
        <span 
          className="status-pill"
          style={{ backgroundColor: statusColors.bg, color: statusColors.color }}
        >
          {formatStatus(data.status)}
        </span>
      </header>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-main-content">
          {/* General Info Card */}
          <div className="info-card">
             <div className="parameters-grid">
                <div className="param-item">
                  <span className="param-label">Customer</span>
                  <span className="param-value">{data.customer?.name || 'N/A'}</span>
                </div>
                <div className="param-item">
                  <span className="param-label">Created Date</span>
                  <span className="param-value">{formatDate(data.created_at || data.createdAt)}</span>
                </div>
                <div className="param-item">
                  <span className="param-label">Shipping Address</span>
                  <span className="param-value" style={{ fontSize: '0.85rem' }}>{data.shipping_address || 'India'}</span>
                </div>
                <div className="param-item">
                  <span className="param-label">General Remarks</span>
                  <span className="param-value" style={{ fontSize: '0.85rem' }}>{data.remarks || 'No specific notes.'}</span>
                </div>
             </div>
          </div>

          {/* Parts Section - Tabular View */}
          <div className="info-card">
            <h3 className="card-title">
              <FiPackage /> Parts Specification
            </h3>
            <div className="table-responsive">
              <table className="parts-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Part Name</th>
                    <th>Process / Technology</th>
                    <th>Material</th>
                    <th>Qty</th>
                    <th>Surface Finish</th>
                    <th>Files</th>
                  </tr>
                </thead>
                <tbody>
                  {data.parts && data.parts.length > 0 ? (
                    data.parts.map((part, index) => (
                      <tr key={part.id || index}>
                        <td className="col-index">{index + 1}</td>
                        <td className="col-name"><strong>{part.part_name}</strong></td>
                        <td>
                          <span className="tech-badge">
                            {part.technologies?.map(t => t.name).join(', ') || 'N/A'}
                          </span>
                        </td>
                        <td>{part.materials?.map(m => m.name).join(', ') || 'N/A'}</td>
                        <td className="col-qty">{part.quantity} Units</td>
                        <td>As Manufactured</td>
                        <td className="col-files">
                          {part.documents && part.documents.length > 0 ? (
                            <div className="part-file-links">
                              {part.documents.map((doc, dIdx) => (
                                <a 
                                  key={dIdx}
                                  href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${doc.file_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="file-mini-link"
                                  title={doc.file_name}
                                >
                                  <FiPaperclip />
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="no-files">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-table">No parts found for this enquiry</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sticky-panel">
            {/* Cost Summary Card */}
            <div className="cost-summary-card">
                <div className="card-title" style={{ border: 'none', marginBottom: '0.5rem' }}>Pricing Summary</div>
                <div className="cost-row">
                    <span className="cost-label">Base Cost</span>
                    <span className="cost-value">---</span>
                </div>
                <div className="cost-row">
                    <span className="total-cost-label">Total Cost</span>
                    <span className="total-cost-value">{quotes.length > 0 ? 'Quoted' : 'Not Quoted'}</span>
                </div>
                
                {data.status !== 'ORDER_GENERATED' && data.status !== 'CANCELLED' && (
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {data.status === 'PO_UPLOADED' && (
                            <button onClick={handleReject} className="btn-secondary-action" style={{ width: '100%', padding: '0.75rem', color: '#e53e3e', borderColor: '#fc8181', borderRadius: '8px' }}>
                                Reject Purchase Order
                            </button>
                        )}
                        <button onClick={handleApprove} className="confirm-order-btn" style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', fontWeight: 700, fontSize: '1rem' }}>
                            {data.status === 'PO_UPLOADED' ? 'Complete Order' : 'Generate Order'}
                        </button>
                    </div>
                )}
            </div>

            {/* Quotation Management Card */}
            <div className="info-card quote-upload-card">
                <h3 className="card-title"><FiFileText /> Quotation Management</h3>
                <div className="reference-upload-zone quote-zone">
                    {quotes.length > 0 ? (
                        <div className="uploaded-files-list">
                            {quotes.map((q, i) => (
                                <div key={i} className="uploaded-file-item">
                                    <span className="file-name">{q.file_name}</span>
                                    <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${q.file_path}`} target="_blank" rel="noreferrer" className="view-link">VIEW</a>
                                </div>
                            ))}
                        </div>
                    ) : <FiUpload size={24} className="upload-icon" />}
                    <div 
                        className={`quote-drop-zone ${quoteFile ? 'has-file' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
                        onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                        onDrop={(e) => { 
                            e.preventDefault(); 
                            e.currentTarget.classList.remove('drag-over');
                            const file = e.dataTransfer.files[0];
                            if (file) setQuoteFile(file);
                        }}
                        style={{ position: 'relative', borderRadius: '8px', border: '2px dashed #bfdbfe', background: '#f0f7ff', padding: '1.25rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '0.75rem' }}
                    >
                        {quoteFile ? (
                            <>
                                <FiCheckCircle size={22} color="#2563eb" />
                                <p style={{ margin: '0.4rem 0 0.15rem', fontSize: '0.85rem', fontWeight: 700, color: '#1d4ed8', wordBreak: 'break-all' }}>{quoteFile.name}</p>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>Click to change file</p>
                            </>
                        ) : (
                            <>
                                <FiUpload size={22} color="#94a3b8" />
                                <p style={{ margin: '0.4rem 0 0.15rem', fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Drag & drop or click to browse</p>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>PDF, XLSX, or any quote document</p>
                            </>
                        )}
                        <input 
                            type="file" 
                            onChange={(e) => setQuoteFile(e.target.files[0])}
                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                        />
                    </div>
                    <button 
                        onClick={handleQuoteUpload} 
                        disabled={isUploadingQuote || !quoteFile} 
                        className="btn-upload-primary"
                    >
                        {isUploadingQuote ? 'Uploading...' : 'Upload Quotation'}
                    </button>
                </div>
            </div>

            {/* DFM Analysis Card - Modal Triggered */}
            <div className="info-card dfm-upload-card">
                <h3 className="card-title" style={{ justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FiTool /> DFM Analysis
                    </span>
                    <button 
                        className="btn-add-dfm"
                        onClick={() => setIsDfmModalOpen(true)}
                    >
                        <FiPlus size={14} /> Add DFM
                    </button>
                </h3>
                {dfms.length > 0 ? (
                    <div className="dfm-entries-list">
                        {dfms.map((d, i) => (
                            <div key={i} className="dfm-entry">
                                <div className="dfm-entry-header">
                                    <span className="dfm-entry-label">Analysis #{i + 1}</span>
                                    <a 
                                        href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${d.file_path}`} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="view-link dfm"
                                    >
                                        {d.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                            <img 
                                                src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${d.file_path}`} 
                                                alt={d.file_name}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                            />
                                        ) : 'OPEN FILE'}
                                    </a>
                                </div>
                                {d.remarks && (
                                    <p className="dfm-entry-remarks">{d.remarks}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="dfm-empty-state">
                        <FiTool size={28} color="#bbf7d0" />
                        <p>No DFM analysis uploaded yet.</p>
                        <p style={{ fontSize: '0.75rem' }}>Click "Add DFM" to upload one.</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryInfo;
