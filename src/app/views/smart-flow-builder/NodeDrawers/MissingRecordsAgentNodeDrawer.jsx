import React, { useState } from 'react';
import { ConfigSection } from './styled';
import DrawerTextArea from '@/app/components/common/DrawerTextArea/DrawerTextArea';
import Checkbox from '@/app/components/common/Checkbox/Checkbox';
import styled from 'styled-components';

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxLabel = styled.span`
  font-size: 14px;
  color: #374151;
  cursor: pointer;
`;

const MissingRecordsAgentNodeDrawer = ({ nodeData = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    requiredDocuments: nodeData.requiredDocuments || '',
    requiredPatientInfo: nodeData.requiredPatientInfo || {
      demographics: false,
      medicalHistory: false,
      medications: false,
      allergies: false,
      insurance: false,
      emergencyContacts: false,
      consentForms: false,
      labResults: false,
      imagingReports: false,
      treatmentPlans: false,
    },
  });

  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    onUpdate?.({
      ...nodeData,
      [field]: value,
    });
  };

  const handleCheckboxChange = (field) => {
    const updatedRequiredPatientInfo = {
      ...formData.requiredPatientInfo,
      [field]: !formData.requiredPatientInfo[field],
    };
    
    const updated = {
      ...formData,
      requiredPatientInfo: updatedRequiredPatientInfo,
    };
    
    setFormData(updated);

    onUpdate?.({
      ...nodeData,
      requiredPatientInfo: updatedRequiredPatientInfo,
    });
  };

  const patientInfoOptions = [
    { key: 'demographics', label: 'Demographics Information' },
    { key: 'medicalHistory', label: 'Medical History' },
    { key: 'medications', label: 'Current Medications' },
    { key: 'allergies', label: 'Allergies' },
    { key: 'insurance', label: 'Insurance Information' },
    { key: 'emergencyContacts', label: 'Emergency Contacts' },
    { key: 'consentForms', label: 'Consent Forms' },
    { key: 'labResults', label: 'Lab Results' },
    { key: 'imagingReports', label: 'Imaging Reports' },
    { key: 'treatmentPlans', label: 'Treatment Plans' },
  ];

  return (
    <>
      <ConfigSection>
        <DrawerTextArea
          label="Required Documents"
          value={formData.requiredDocuments || ''}
          onChange={(e) => handleInputChange('requiredDocuments', e.target.value)}
          placeholder="Enter a list of required documents that need to be gathered..."
        />
      </ConfigSection>

      <ConfigSection>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '8px'
          }}>
            Required Patient Information
          </label>
          <CheckboxContainer>
            {patientInfoOptions.map((option) => (
              <CheckboxItem key={option.key}>
                <Checkbox
                  size={16}
                  isChecked={formData.requiredPatientInfo[option.key] || false}
                  onClick={() => handleCheckboxChange(option.key)}
                />
                <CheckboxLabel onClick={() => handleCheckboxChange(option.key)}>
                  {option.label}
                </CheckboxLabel>
              </CheckboxItem>
            ))}
          </CheckboxContainer>
        </div>
      </ConfigSection>
    </>
  );
};

export default MissingRecordsAgentNodeDrawer;
