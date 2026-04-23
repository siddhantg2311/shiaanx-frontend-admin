import React, { useState, useMemo } from 'react';
import { FiX, FiCheckCircle, FiFileText } from 'react-icons/fi';
import { MdCheck, MdCalculate, MdLocalShipping, MdMoneyOff } from 'react-icons/md';
import enquiryService from '../../services/enquiryService';
import toast from 'react-hot-toast';
import './AutoQuoteModal.css';

const MasterQuoteModal = ({ isOpen, onClose, enquiryData, onSave }) => {
  const [saving, setSaving] = useState(false);
  
  // Default master quote inputs
  const initialData = enquiryData?.master_quote_data || {};
  const [globalDiscount, setGlobalDiscount] = useState(initialData.globalDiscount || 0);
  const [globalShipping, setGlobalShipping] = useState(initialData.globalShipping || 0);
  const [paymentTerms, setPaymentTerms] = useState(initialData.paymentTerms || '100% Advance against PI');

  const finalizedParts = useMemo(() => {
    return (enquiryData?.parts || []).filter(p => p.auto_quote_status === 'FINALIZED');
  }, [enquiryData]);

  const aggregated = useMemo(() => {
    let materialCost = 0;
    let machiningCost = 0;
    let finishesCost = 0;
    let logisticsCost = 0;
    let extraCosts = 0;

    finalizedParts.forEach(p => {
       const q = p.auto_quote_data || {};
       materialCost += (parseFloat(q.materialCost) || 0);
       machiningCost += (parseFloat(q.totalMachining) || 0) + (parseFloat(q.totalInspection) || 0); // Include inspection in machining/process
       finishesCost += (parseFloat(q.totalFinish) || 0) + (parseFloat(q.totalSecondary) || 0);
       logisticsCost += (parseFloat(q.totalLogistics) || 0);
       extraCosts += (parseFloat(q.totalExtras) || 0) + (parseFloat(q.miscCost) || 0);
    });

    const partsSubTotal = materialCost + machiningCost + finishesCost + logisticsCost + extraCosts;
    const subTotal = partsSubTotal + globalShipping - globalDiscount;
    const gstPercent = 18;
    const gstAmount = subTotal * (gstPercent / 100);
    const grandTotal = subTotal + gstAmount;

    return {
      materialCost,
      machiningCost,
      finishesCost,
      logisticsCost,
      extraCosts,
      partsSubTotal,
      subTotal,
      gstAmount,
      grandTotal
    };
  }, [finalizedParts, globalDiscount, globalShipping]);

  if (!isOpen) return null;

  const handleSave = async (finalize = false) => {
    setSaving(true);
    try {
      const payload = {
        globalDiscount,
        globalShipping,
        paymentTerms,
        ...aggregated
      };
      
      const res = await enquiryService.saveMasterQuote(enquiryData.id, payload, finalize);
      toast.success(finalize ? 'Master Quote Finalized' : 'Master Quote Details Saved');
      if (onSave) onSave(res);
      onClose();
    } catch (error) {
      toast.error('Failed to save Master Quote');
    } finally {
      setSaving(false);
    }
  };

  const isFullyQuoted = enquiryData?.parts?.length > 0 && finalizedParts.length === enquiryData.parts.length;

  return (
    <div className="aq-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="aq-modal" style={{ width: 'min(900px, 95vw)', height: '100%', maxHeight: '85vh' }}>
        {/* Header */}
        <header className="aq-header">
          <div className="aq-header-left">
            <div>
              <p className="aq-header-eyebrow" style={{ color: 'var(--aq-teal)', fontWeight: 700 }}>QUOTATION PROPOSAL</p>
              <h1 className="aq-header-title" style={{ fontSize: '1.4rem' }}>Master Quote - {enquiryData?.enquiry_number}</h1>
            </div>
          </div>
          <div className="aq-header-actions">
            {!isFullyQuoted && (
              <div className="aq-pipeline-badge offline">
                <div className="aq-badge-dot"></div>
                Warning: Not all parts are finalized
              </div>
            )}
            <button className="aq-btn aq-btn-ghost" onClick={onClose} style={{ borderRadius: '50%', padding: '8px' }}><FiX size={20} /></button>
          </div>
        </header>

        {/* Body */}
        <div className="aq-body" style={{ flex: 1, minHeight: 0 }}>
          <aside className="aq-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="aq-grand-total-pill">
              <p className="aq-grand-total-label">Overall Grand Total (Inc. GST)</p>
              <div className="aq-grand-total-value">₹ {aggregated.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--aq-ink)' }}>
                    <span style={{ color: 'var(--aq-muted)', fontWeight: 500 }}>Parts Subtotal</span>
                    <span style={{ fontWeight: 600 }}>₹{aggregated.partsSubTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--aq-ink)' }}>
                    <span style={{ color: 'var(--aq-muted)', fontWeight: 500 }}>Global Shipping</span>
                    <span style={{ fontWeight: 600 }}>+ ₹{globalShipping.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--aq-ink)' }}>
                    <span style={{ color: 'var(--aq-muted)', fontWeight: 500 }}>Global Discount</span>
                    <span style={{ fontWeight: 700, color: 'var(--aq-teal)' }}>- ₹{globalDiscount.toLocaleString()}</span>
                </div>
                
                <div style={{ height: '1px', background: 'var(--aq-line)', margin: '4px 0' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--aq-ink)', fontWeight: 800 }}>
                    <span>Net Subtotal</span>
                    <span>₹{aggregated.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--aq-muted)', fontWeight: 600 }}>
                    <span>+ GST (18%)</span>
                    <span>₹{aggregated.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div style={{ marginTop: 'auto', padding: '0 8px 20px 8px' }}>
              <div className="aq-notice" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', gap: '12px' }}>
                <MdCalculate style={{ fontSize: '1.4rem', flexShrink: 0, color: '#64748b' }} />
                <span style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.4' }}>This quote aggregates <strong>{finalizedParts.length}</strong> finalized parts safely into a single master checkout.</span>
              </div>
            </div>
          </aside>

          <main className="aq-content" style={{ padding: '24px 32px' }}>
            <div className="aq-card" style={{ marginBottom: '24px', overflow: 'hidden' }}>
              <div className="aq-card-head" style={{ padding: '16px 20px', borderBottom: '1px solid var(--aq-line)' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Included Parts Breakdown</h3>
              </div>
              <div className="aq-card-body" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                    <thead>
                        <tr style={{ background: '#fafafa', color: 'var(--aq-muted)' }}>
                            <th style={{ padding: '12px 20px', fontWeight: 600, borderBottom: '1px solid var(--aq-line)' }}>Part Name</th>
                            <th style={{ padding: '12px 20px', fontWeight: 600, borderBottom: '1px solid var(--aq-line)' }}>Qty</th>
                            <th style={{ padding: '12px 20px', fontWeight: 600, borderBottom: '1px solid var(--aq-line)' }}>Material</th>
                            <th style={{ padding: '12px 20px', fontWeight: 600, textAlign: 'right', borderBottom: '1px solid var(--aq-line)' }}>Unit Price</th>
                            <th style={{ padding: '12px 20px', fontWeight: 600, textAlign: 'right', borderBottom: '1px solid var(--aq-line)' }}>Ext. Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {finalizedParts.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--aq-muted)' }}>
                                    No finalized parts available. Generate Insta-Quotes to include them here.
                                </td>
                            </tr>
                        ) : finalizedParts.map((p, idx) => {
                            const unitPrice = p.auto_quote_data?.unitPrice || 0;
                            const extPrice = p.auto_quote_data?.grandTotal || 0;
                            const isLast = idx === finalizedParts.length - 1;
                            return (
                                <tr key={p.id}>
                                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--aq-ink)', borderBottom: isLast ? 'none' : '1px solid #f1f5f9' }}>{p.part_name}</td>
                                    <td style={{ padding: '14px 20px', color: 'var(--aq-muted)', fontWeight: 500, borderBottom: isLast ? 'none' : '1px solid #f1f5f9' }}>{p.quantity} Units</td>
                                    <td style={{ padding: '14px 20px', color: 'var(--aq-muted)', fontWeight: 500, borderBottom: isLast ? 'none' : '1px solid #f1f5f9' }}>{p.materials?.[0]?.name || 'N/A'}</td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600, color: 'var(--aq-muted)', borderBottom: isLast ? 'none' : '1px solid #f1f5f9' }}>₹{unitPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 800, color: 'var(--aq-ink)', borderBottom: isLast ? 'none' : '1px solid #f1f5f9' }}>₹{extPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
              </div>
            </div>

            <div className="aq-card">
                <div className="aq-card-head" style={{ padding: '16px 20px', borderBottom: '1px solid var(--aq-line)' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>Master Settings & Adjustments</h3>
                </div>
                <div className="aq-card-body" style={{ padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="aq-field">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--aq-muted)' }}>
                              <MdMoneyOff size={16} /> Global Discount (₹)
                            </label>
                            <input 
                                type="number" 
                                value={globalDiscount === 0 ? '' : globalDiscount} 
                                onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)} 
                                placeholder="0"
                                min="0"
                                style={{ fontSize: '0.95rem', padding: '12px 16px' }}
                            />
                        </div>
                        <div className="aq-field">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--aq-muted)' }}>
                              <MdLocalShipping size={16} /> Consolidated Shipping (₹)
                            </label>
                            <input 
                                type="number" 
                                value={globalShipping === 0 ? '' : globalShipping} 
                                onChange={(e) => setGlobalShipping(parseFloat(e.target.value) || 0)} 
                                placeholder="0"
                                min="0"
                                style={{ fontSize: '0.95rem', padding: '12px 16px' }}
                            />
                        </div>
                    </div>
                    <div className="aq-field" style={{ marginTop: '24px' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--aq-muted)' }}>Commercial Payment Terms</label>
                        <input 
                            type="text" 
                            value={paymentTerms} 
                            onChange={(e) => setPaymentTerms(e.target.value)} 
                            placeholder="e.g. 50% Advance, 50% Against Dispatch"
                            style={{ fontSize: '0.95rem', padding: '12px 16px' }}
                        />
                    </div>
                </div>
            </div>

          </main>
        </div>

        {/* Footer */}
        <footer className="aq-footer">
          <div className="aq-footer-left">
            <span style={{ fontSize: '0.88rem', color: 'var(--aq-muted)', fontWeight: 500 }}>
              Status: <strong style={{ color: enquiryData?.status === 'QUOTED' ? 'var(--aq-teal)' : 'var(--aq-amber)' }}>{enquiryData?.status === 'QUOTED' ? 'OFFICIAL PROPOSAL' : 'DRAFT'}</strong>
            </span>
          </div>
          <div className="aq-footer-right">
            <button className="aq-btn aq-btn-primary" onClick={() => handleSave(true)} disabled={saving || finalizedParts.length === 0} style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
              <FiCheckCircle style={{ marginRight: '8px' }} /> Finalize & Issue Proposal
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MasterQuoteModal;
