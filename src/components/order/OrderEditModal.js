import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const OrderEditModal = ({ isOpen, onClose, onSubmit, orderData }) => {
  const [items, setItems] = useState([]);
  const [taxAmount, setTaxAmount] = useState('0');
  const [taxPercent, setTaxPercent] = useState('0');
  const [discountAmount, setDiscountAmount] = useState('0');
  const [expectedDate, setExpectedDate] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (orderData) {
      // Initialize items
      if (orderData.items) {
        setItems(orderData.items.map(item => ({
          enquiry_part_id: item.enquiry_part_id,
          item_name: item.item_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        })));
      }
      
      // Initialize other fields
      setTaxAmount(orderData.tax_amount || '0');
      setDiscountAmount(orderData.discount_amount || '0');
      
      // Format date for input[type="date"] (YYYY-MM-DD)
      if (orderData.expected_delivery_date) {
        const date = new Date(orderData.expected_delivery_date);
        setExpectedDate(date.toISOString().split('T')[0]);
      } else {
        setExpectedDate('');
      }
      
      setAdminNotes(orderData.admin_notes || '');

      // Calculate initial tax percentage
      const basic = parseFloat(orderData.total_amount || 0);
      if (basic > 0 && orderData.tax_amount) {
        const percent = (parseFloat(orderData.tax_amount) / basic) * 100;
        setTaxPercent(percent.toFixed(2));
      }
    }
  }, [orderData]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Recalculate total for this item
    const qty = parseInt(newItems[index].quantity || 0);
    const price = parseFloat(newItems[index].unit_price || 0);
    newItems[index].total_price = (qty * price).toFixed(2);
    
    setItems(newItems);
  };

  const handleAddExtraItem = () => {
    setItems([...items, {
      item_name: '',
      quantity: 1,
      unit_price: '0',
      total_price: '0'
    }]);
  };

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateBasicTotal = () => {
    return items.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0).toFixed(2);
  };

  // Auto-update tax amount when Basic Total changes if a percentage was set
  useEffect(() => {
    if (!isOpen) return;
    const basic = parseFloat(calculateBasicTotal());
    if (taxPercent && parseFloat(taxPercent) > 0) {
        const calculatedAmount = (basic * parseFloat(taxPercent)) / 100;
        setTaxAmount(calculatedAmount.toFixed(2));
    }
  }, [items, taxPercent, isOpen]);

  const handleTaxPercentChange = (percent) => {
    setTaxPercent(percent);
    const basic = parseFloat(calculateBasicTotal());
    const amount = (basic * parseFloat(percent || 0)) / 100;
    setTaxAmount(amount.toFixed(2));
  };

  const handleTaxAmountChange = (amount) => {
    setTaxAmount(amount);
    const basic = parseFloat(calculateBasicTotal());
    if (basic > 0) {
        const percent = (parseFloat(amount || 0) / basic) * 100;
        setTaxPercent(percent.toFixed(2));
    } else {
        setTaxPercent('0');
    }
  };

  if (!isOpen) return null;

  const calculateFinalTotal = () => {
    const basic = parseFloat(calculateBasicTotal());
    const tax = parseFloat(taxAmount || 0);
    const disc = parseFloat(discountAmount || 0);
    return (basic + tax - disc).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      items: items,
      total_amount: calculateBasicTotal(),
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      expected_delivery_date: expectedDate,
      admin_notes: adminNotes
    };
    onSubmit(finalData);
  };

  return (
    <div className="dfm-modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ maxWidth: '850px', width: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', backgroundColor: '#ffffff', border: 'none', padding: 0 }}>
        <div className="modal-header" style={{ flexShrink: 0, padding: '1.25rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: '700' }}>Edit Order <span style={{ color: '#64748b', fontWeight: 500 }}>-</span> <span style={{ color: '#3b82f6' }}>#{orderData?.order_number}</span></h3>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s', padding: '0.5rem', borderRadius: '50%' }} onMouseOver={(e) => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.backgroundColor = '#fee2e2'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body" style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
            {/* Items Table Section */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.05rem', fontWeight: 600 }}>Order Items</h4>
                    <button 
                        type="button" 
                        onClick={handleAddExtraItem}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = '#e2e8f0'; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = '#f1f5f9'; }}
                    >
                        <span>+</span> Add Extra Item
                    </button>
                </div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <tr>
                        <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Item Name</th>
                        <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', width: '80px' }}>Qty</th>
                        <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', width: '160px' }}>Unit Price (₹)</th>
                        <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', width: '120px' }}>Total</th>
                        <th style={{ padding: '0.85rem 1.25rem', width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody style={{ backgroundColor: '#ffffff' }}>
                      {items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: index < items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                          <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.95rem', color: '#334155' }}>
                            <input 
                                type="text"
                                value={item.item_name}
                                placeholder="Item Name"
                                onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', border: item.enquiry_part_id ? 'none' : '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', fontWeight: item.enquiry_part_id ? 600 : 400, backgroundColor: item.enquiry_part_id ? 'transparent' : '#fdfdfd' }}
                                required
                                readOnly={!!item.enquiry_part_id}
                            />
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem', textAlign: 'center' }}>
                            <input 
                                type="number"
                                value={item.quantity}
                                min="1"
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                style={{ width: '60px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', textAlign: 'center' }}
                                required
                            />
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <span style={{ position: 'absolute', left: '0.65rem', color: '#64748b', fontSize: '0.85rem' }}>₹</span>
                              <input 
                                type="number" 
                                style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem 0.5rem 0.5rem 1.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem', color: '#1e293b', outline: 'none', transition: 'all 0.2s', backgroundColor: '#f8fafc' }}
                                placeholder="0.00"
                                value={item.unit_price} 
                                onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)} 
                                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.backgroundColor = '#ffffff'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.backgroundColor = '#f8fafc'; }}
                                required 
                                step="0.01"
                                min="0"
                              />
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right', fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
                            ₹{item.total_price}
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem', textAlign: 'center' }}>
                            {!item.enquiry_part_id && (
                                <button 
                                    type="button"
                                    onClick={() => handleDeleteItem(index)}
                                    title="Remove this item"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
                                    onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                                    onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    <FiX size={16} />
                                </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>

            {/* Calculations Section */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2.5rem' }}>
                <div style={{ width: '380px', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#475569', fontSize: '0.95rem' }}>
                        <span>Total Basic:</span>
                        <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem' }}>₹{calculateBasicTotal()}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <label style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>Tax:</label>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div style={{ position: 'relative', width: '90px' }}>
                                <input 
                                    type="number" 
                                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem 1.5rem 0.5rem 0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', textAlign: 'right', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s', backgroundColor: '#ffffff' }}
                                    placeholder="0"
                                    value={taxPercent} 
                                    onChange={(e) => handleTaxPercentChange(e.target.value)} 
                                    onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; }}
                                    step="0.01"
                                    min="0"
                                />
                                <span style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>%</span>
                            </div>
                            <div style={{ position: 'relative', width: '140px' }}>
                                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 500 }}>₹</span>
                                <input 
                                    type="number" 
                                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem 0.75rem 0.5rem 1.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', textAlign: 'right', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s', backgroundColor: '#ffffff' }}
                                    value={taxAmount} 
                                    onChange={(e) => handleTaxAmountChange(e.target.value)} 
                                    onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; }}
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <label style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>Discount:</label>
                        <div style={{ position: 'relative', width: '160px' }}>
                            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#ef4444', fontWeight: 600 }}>-</span>
                            <input 
                                type="number" 
                                style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem 0.75rem 0.5rem 2rem', border: '1px solid #cbd5e1', borderRadius: '6px', textAlign: 'right', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s', backgroundColor: '#ffffff', color: '#ef4444', fontWeight: 500 }}
                                value={discountAmount} 
                                onChange={(e) => setDiscountAmount(e.target.value)} 
                                onFocus={(e) => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                                step="0.01"
                                min="0"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px dashed #cbd5e1' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>Final Amount:</span>
                        <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#2563eb' }}>₹{calculateFinalTotal()}</span>
                    </div>
                </div>
            </div>

            {/* Other details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
                      <span style={{ marginRight: '6px' }}>📅</span> Expected Delivery Date
                    </label>
                    <input 
                        type="date" 
                        style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem', outline: 'none', color: '#1e293b', backgroundColor: '#ffffff', transition: 'all 0.2s' }}
                        value={expectedDate} 
                        onChange={(e) => setExpectedDate(e.target.value)}
                        onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                    />
                </div>
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
                      <span style={{ marginRight: '6px' }}>📝</span> Admin Notes (Optional)
                    </label>
                    <textarea 
                        style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem', outline: 'none', resize: 'vertical', minHeight: '100px', color: '#1e293b', backgroundColor: '#ffffff', transition: 'all 0.2s', fontFamily: 'inherit' }}
                        value={adminNotes} 
                        onChange={(e) => setAdminNotes(e.target.value)}
                        onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                        placeholder="Add any internal notes, supplier instructions, or specific conditions..."
                    ></textarea>
                </div>
            </div>
          </div>

          <div className="modal-footer" style={{ flexShrink: 0, padding: '1.25rem 2rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.65rem 1.5rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, color: '#475569', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.backgroundColor = '#f8fafc'; e.target.style.color = '#0f172a'; }} onMouseOut={(e) => { e.target.style.backgroundColor = '#ffffff'; e.target.style.color = '#475569'; }}>Cancel</button>
            <button type="submit" style={{ padding: '0.65rem 1.75rem', backgroundColor: '#2563eb', border: 'none', borderRadius: '6px', fontWeight: 600, color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)' }} onMouseOver={(e) => { e.target.style.backgroundColor = '#1d4ed8'; e.target.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.3)'; }} onMouseOut={(e) => { e.target.style.backgroundColor = '#2563eb'; e.target.style.boxShadow = '0 1px 3px rgba(37, 99, 235, 0.3)'; }}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderEditModal;
