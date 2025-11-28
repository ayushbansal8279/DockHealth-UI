import React, { useState } from 'react';
import { ConfigSection } from './styled';
import DrawerInput from '@/app/components/common/DrawerInput/DrawerInput';
import DrawerSelect from '@/app/components/common/DrawerSelect/DrawerSelect';
import DrawerTextArea from '@/app/components/common/DrawerTextArea/DrawerTextArea';

const CreateAppointmentNodeDrawer = ({ nodeData = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    patientId: nodeData.patientId || '',
    patientName: nodeData.patientName || '',
    appointmentType: nodeData.appointmentType || '',
    datetime: nodeData.datetime || '',
    duration: nodeData.duration || 30,
    providerId: nodeData.providerId || '',
    providerName: nodeData.providerName || '',
    location: nodeData.location || '',
    status: nodeData.status || 'scheduled',
    notes: nodeData.notes || '',
    reminders: nodeData.reminders || [],
  });

  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    onUpdate?.({
      ...nodeData,
      [field]: value,
    });
  };

  const appointmentTypeOptions = [
    { value: '', label: 'Select appointment type' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'checkup', label: 'Checkup' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'vaccination', label: 'Vaccination' },
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
    { value: 'tentative', label: 'Tentative' },
  ];

  return (
    <>
      <ConfigSection>
        <DrawerInput
          label="Patient ID"
          value={formData.patientId || ''}
          onChange={(e) => handleInputChange('patientId', e.target.value)}
          placeholder="Enter patient ID"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Patient Name"
          value={formData.patientName || ''}
          onChange={(e) => handleInputChange('patientName', e.target.value)}
          placeholder="Enter patient name"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerSelect
          label="Appointment Type *"
          value={formData.appointmentType || ''}
          onChange={(e) => handleInputChange('appointmentType', e.target.value)}
          options={appointmentTypeOptions}
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Date & Time *"
          type="datetime-local"
          value={formData.datetime || ''}
          onChange={(e) => handleInputChange('datetime', e.target.value)}
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Duration (minutes)"
          type="number"
          value={formData.duration || 30}
          onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
          placeholder="30"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Provider ID"
          value={formData.providerId || ''}
          onChange={(e) => handleInputChange('providerId', e.target.value)}
          placeholder="Enter provider ID"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Provider Name"
          value={formData.providerName || ''}
          onChange={(e) => handleInputChange('providerName', e.target.value)}
          placeholder="Enter provider name"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Location"
          value={formData.location || ''}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Enter appointment location"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerSelect
          label="Status"
          value={formData.status || 'scheduled'}
          onChange={(e) => handleInputChange('status', e.target.value)}
          options={statusOptions}
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerTextArea
          label="Notes"
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Additional appointment notes..."
        />
      </ConfigSection>
    </>
  );
};

export default CreateAppointmentNodeDrawer;
