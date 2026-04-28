import React from 'react';
import { MdClose } from 'react-icons/md';
import { FiBox } from 'react-icons/fi';
import CadViewer from './CadViewer';

const getFileUrl = (filePath) => {
  if (!filePath) return '#';
  if (filePath.startsWith('http')) return filePath;
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  try {
    const origin = new URL(apiUrl).origin;
    const cleanPath = filePath.replace(/^(\.\.\/)+/, '').replace(/^\.\//,'');
    return `${origin}/${cleanPath}`;
  } catch {
    return `${apiUrl}/${filePath}`;
  }
};

const CADViewerModal = ({ isOpen, onClose, part }) => {
  if (!isOpen || !part) return null;

  const cadFile = part.documents?.find(d => 
    ['.step', '.stp', '.iges', '.igs'].some(ext => d.file_name?.toLowerCase().endsWith(ext))
  );

  return (
    <div className="aq-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="aq-modal" style={{ width: '90vw', maxWidth: '1200px', height: '85vh' }}>
        <header className="aq-header">
          <div className="aq-header-left">
            <div>
              <p className="aq-header-eyebrow">3D Visualization</p>
              <h1 className="aq-header-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiBox /> {part.part_name}
              </h1>
            </div>
          </div>
          <div className="aq-header-actions">
            <button className="aq-btn aq-btn-ghost" onClick={onClose}><MdClose size={24} /></button>
          </div>
        </header>

        <div className="aq-full-body" style={{ flex: 1, padding: 0, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {cadFile ? (
            <CadViewer 
              fileUrl={getFileUrl(cadFile.file_path)} 
              fileName={cadFile.file_name} 
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px', color: '#64748b' }}>
              <FiBox size={60} style={{ opacity: 0.2 }} />
              <p style={{ fontSize: '1.2rem' }}>No CAD file available for this part.</p>
            </div>
          )}
        </div>
        
        <footer className="aq-footer">
           <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
             Supported formats: .STEP, .STP, .IGES, .IGS
           </p>
           <button className="aq-btn aq-btn-secondary" onClick={onClose}>Close Viewer</button>
        </footer>
      </div>
    </div>
  );
};

export default CADViewerModal;
