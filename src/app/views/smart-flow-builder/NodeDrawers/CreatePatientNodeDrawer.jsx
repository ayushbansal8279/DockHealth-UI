import React, { useState } from 'react';
import { ConfigSection } from './styled';
import DrawerInput from '@/app/components/common/DrawerInput/DrawerInput';
import DrawerSelect from '@/app/components/common/DrawerSelect/DrawerSelect';
import DrawerTextArea from '@/app/components/common/DrawerTextArea/DrawerTextArea';

const CreatePatientNodeDrawer = ({ nodeData = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: nodeData.firstName || '',
    lastName: nodeData.lastName || '',
    email: nodeData.email || '',
    phone: nodeData.phone || '',
    dateOfBirth: nodeData.dateOfBirth || '',
    gender: nodeData.gender || '',
    address: nodeData.address || '',
    emergencyContact: nodeData.emergencyContact || '',
    insuranceInfo: nodeData.insuranceInfo || '',
    notes: nodeData.notes || '',
  });

  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    onUpdate?.({
      ...nodeData,
      [field]: value,
    });
  };

  const genderOptions = [
    { value: '', label: 'Select gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  ];

  return (
    <>
      <ConfigSection>
        <DrawerInput
          label="First Name *"
          value={formData.firstName || ''}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          placeholder="Enter first name"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Last Name *"
          value={formData.lastName || ''}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          placeholder="Enter last name"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="patient@example.com"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Phone"
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth || ''}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerSelect
          label="Gender"
          value={formData.gender || ''}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          options={genderOptions}
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerTextArea
          label="Address"
          value={formData.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter patient address..."
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Emergency Contact"
          value={formData.emergencyContact || ''}
          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
          placeholder="Emergency contact name and phone"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Insurance Information"
          value={formData.insuranceInfo || ''}
          onChange={(e) => handleInputChange('insuranceInfo', e.target.value)}
          placeholder="Insurance provider and policy number"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerTextArea
          label="Notes"
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Additional patient notes..."
        />
      </ConfigSection>
    </>
  );
};

export default CreatePatientNodeDrawer;
