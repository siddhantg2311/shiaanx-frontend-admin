import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EnquiryForm from '../components/forms/EnquiryForm';
import userService from '../services/userService';
import enquiryService from '../services/enquiryService';
import toast from 'react-hot-toast';

function MakeEnquiry() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  
  // Mock vendors for now as backend is not ready
  /* const vendors = [
    { id: '1', name: 'ABC Manufacturing Ltd.' },
    { id: '2', name: 'XYZ Industries' },
    { id: '3', name: 'Tech Parts Ltd' }
  ]; */

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers();
        // The backend returns { count, rows }
        console.log(response);
        
        setUsers(response.items || response);
      } catch (err) {
        toast.error('Failed to fetch customers');
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setErrors({});
      
      const { documents, parts, ...restData } = formData;
      
      // Clean parts data (remove documents as it's handled separately)
      const cleanedParts = parts.map(({ documents, id, ...part }) => part);
      
      // 1. Create Enquiry
      const response = await enquiryService.createEnquiry({ ...restData, parts: cleanedParts });
      const enquiryId = response.id;
      const createdEnquiryItems = response.parts || [];

      // 2. Upload Documents if any
      // Handle overall enquiry documents (though the form currently doesn't have an overall upload, keeping it for robustness)
      if (documents && documents.length > 0) {
        await enquiryService.uploadEnquiryDocuments(enquiryId, documents);
      }

      // Handle part-specific documents
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.documents && part.documents.length > 0) {
          // Find the corresponding created part ID in backend
          // We assume parts are returned in same order or we can match by name/index
          const createdPartId = createdEnquiryItems[i]?.id;
          if (createdPartId) {
            await enquiryService.uploadEnquiryDocuments(enquiryId, part.documents, createdPartId);
          }
        }
      }
      
      toast.success('Enquiry created successfully!');
      navigate('/enquiries');
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
        toast.error('Please fix the errors in the form');
      } else {
        toast.error(err.message || 'Failed to create enquiry');
      }
    }
  };

  const handleCancel = () => {
    navigate('/enquiries');
  };

  return (
    <div className="make-enquiry-page" style={{ padding: '2rem' }}>
      <EnquiryForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        users={users}
        // vendors={vendors}
        errors={errors}
      />
    </div>
  );
}

export default MakeEnquiry;
