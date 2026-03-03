import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EnquiryInfo from '../components/enquiry/EnquiryInfo';
import EnquiryChat from '../components/enquiry/EnquiryChat';
import OrderGenerationModal from '../components/enquiry/OrderGenerationModal';
import enquiryService from '../services/enquiryService';
import toast from 'react-hot-toast';
import '../styles/EnquiryDetails.css';

const EnquiryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enquiryData, setEnquiryData] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        const data = await enquiryService.getEnquiryDetails(id);
        setEnquiryData(data);
        setLoading(false);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch enquiry details');
        navigate('/enquiries');
      }
    };

    fetchEnquiry();
  }, [id, navigate]);

  const handleApprovePO = async (orderData) => {
    try {
      setIsOrderModalOpen(false);
      setLoading(true);
      const orderService = (await import('../services/orderService')).default;
      await orderService.generateFromEnquiry({
          enquiry_id: id,
          ...orderData
      });
      
      const updatedData = await enquiryService.getEnquiryDetails(id);
      setEnquiryData(updatedData);
      toast.success("Order generated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to generate order");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectPO = async (reason) => {
    try {
      setLoading(true);
      await enquiryService.rejectPO(id, reason);
      
      const updatedData = await enquiryService.getEnquiryDetails(id);
      setEnquiryData(updatedData);
      toast.success("PO rejected successfully");
    } catch (err) {
      toast.error(err.message || "Failed to reject PO");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status, reason) => {
      try {
          setLoading(true);
          await enquiryService.updateEnquiryStatus(id, status, reason);
          const updatedData = await enquiryService.getEnquiryDetails(id);
          setEnquiryData(updatedData);
          toast.success(`Enquiry status updated to ${status}`);
      } catch (err) {
          toast.error(err.message || "Failed to update status");
      } finally {
          setLoading(false);
      }
  }
  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading enquiry details...</div>;
  }

  return (
    <div className="enquiry-details-container">
      <EnquiryInfo 
        data={enquiryData} 
        onApprovePO={() => setIsOrderModalOpen(true)}
        onRejectPO={handleRejectPO}
        onUpdateStatus={handleUpdateStatus}
      />
      <EnquiryChat 
        enquiryId={id} 
        initialMessages={enquiryData.messages || []} 
      />

      <OrderGenerationModal 
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSubmit={handleApprovePO}
        enquiryData={enquiryData}
      />
    </div>
  );
};

export default EnquiryDetails;
