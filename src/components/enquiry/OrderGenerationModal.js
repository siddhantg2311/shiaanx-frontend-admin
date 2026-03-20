import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const OrderGenerationModal = ({ isOpen, onClose, onSubmit, enquiryData }) => {
  const [items, setItems] = useState([]);
  const [taxAmount, setTaxAmount] = useState('0');
  const [discountAmount, setDiscountAmount] = useState('0');
  const [expectedDate, setExpectedDate] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (enquiryData?.parts) {
      setItems(enquiryData.parts.map(part => ({
        enquiry_part_id: part.id,
        item_name: part.part_name,
        quantity: part.quantity,
        unit_price: '0',
        total_price: '0'
      })));
    } else if (enquiryData) {
        // Fallback for single part if parts array missing
        setItems([{
            item_name: 'Order Item',
            quantity: enquiryData.quantity || 1,
            unit_price: '0',
            total_price: '0'
        }]);
    }
  }, [enquiryData]);

  if (!isOpen) return null;

  const handleItemPriceChange = (index, price) => {
    const newItems = [...items];
    newItems[index].unit_price = price;
    newItems[index].total_price = (parseFloat(price || 0) * parseInt(newItems[index].quantity)).toFixed(2);
    setItems(newItems);
  };

  const calculateBasicTotal = () => {
    return items.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0).toFixed(2);
  };

  const calculateFinalTotal = () => {
    const basic = parseFloat(calculateBasicTotal());
    const tax = parseFloat(taxAmount || 0);
    const disc = parseFloat(discountAmount || 0);
    return (basic + tax - disc).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      enquiry_id: enquiryData.id,
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
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h3>Generate Order - Enquiry #{enquiryData?.enquiry_number}</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                <h4 style={{ marginBottom: '1rem', color: '#4a5568' }}>Order Items (from Enquiry Parts)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1.5fr', gap: '1rem', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#718096' }}>
                    <div>Part Name</div>
                    <div>Qty</div>
                    <div>Unit Price</div>
                    <div>Total</div>
                </div>
                {items.map((item, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1.5fr', gap: '1rem', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <div style={{ fontSize: '0.95rem' }}>{item.item_name}</div>
                        <div>{item.quantity}</div>
                        <input 
                            type="number" 
                            className="form-control"
                            style={{ padding: '0.4rem' }}
                            placeholder="0.00"
                            value={item.unit_price} 
                            onChange={(e) => handleItemPriceChange(index, e.target.value)} 
                            required 
                            step="0.01"
                        />
                        <div style={{ fontWeight: 500 }}>₹{item.total_price}</div>
                    </div>
                ))}
            </div>

            <div style={{ borderTop: '2px solid #edf2f7', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                    <span style={{ width: '150px', fontWeight: 500 }}>Total Basic:</span>
                    <span style={{ width: '100px', textAlign: 'right', fontWeight: 600 }}>₹{calculateBasicTotal()}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ width: '150px', margin: 0 }}>Tax Amount:</label>
                    <input 
                        type="number" 
                        className="form-control"
                        style={{ width: '100px', padding: '0.4rem', textAlign: 'right' }}
                        value={taxAmount} 
                        onChange={(e) => setTaxAmount(e.target.value)} 
                        step="0.01"
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ width: '150px', margin: 0 }}>Discount:</label>
                    <input 
                        type="number" 
                        className="form-control"
                        style={{ width: '100px', padding: '0.4rem', textAlign: 'right' }}
                        value={discountAmount} 
                        onChange={(e) => setDiscountAmount(e.target.value)} 
                        step="0.01"
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid #eee' }}>
                    <span style={{ width: '150px', fontWeight: 700, fontSize: '1.1rem' }}>Final Amount:</span>
                    <span style={{ width: '100px', textAlign: 'right', fontWeight: 800, fontSize: '1.1rem', color: '#2160b7' }}>₹{calculateFinalTotal()}</span>
                </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                <label>Expected Delivery Date</label>
                <input 
                    type="date" 
                    className="form-control"
                    value={expectedDate} 
                    onChange={(e) => setExpectedDate(e.target.value)} 
                />
                </div>
                <div className="form-group">
                <label>Admin Notes</label>
                <textarea 
                    className="form-control"
                    value={adminNotes} 
                    onChange={(e) => setAdminNotes(e.target.value)} 
                    rows="2"
                ></textarea>
                </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-confirm">Generate Order</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderGenerationModal;
