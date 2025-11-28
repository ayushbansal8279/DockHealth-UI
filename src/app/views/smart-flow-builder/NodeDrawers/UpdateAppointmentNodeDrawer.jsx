import React, { useState } from 'react';
import { ConfigSection } from './styled';
import DrawerInput from '@/app/components/common/DrawerInput/DrawerInput';
import DrawerSelect from '@/app/components/common/DrawerSelect/DrawerSelect';
import DrawerTextArea from '@/app/components/common/DrawerTextArea/DrawerTextArea';

const UpdateAppointmentNodeDrawer = ({ nodeData = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    appointmentId: nodeData.appointmentId || '',
    updateType: nodeData.updateType || '',
    newDateTime: nodeData.newDateTime || '',
    newDuration: nodeData.newDuration || '',
    newProviderId: nodeData.newProviderId || '',
    newProviderName: nodeData.newProviderName || '',
    newLocation: nodeData.newLocation || '',
    newStatus: nodeData.newStatus || '',
    reason: nodeData.reason || '',
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

  const updateTypeOptions = [
    { value: '', label: 'Select update type' },
    { value: 'reschedule', label: 'Reschedule' },
    { value: 'change-provider', label: 'Change Provider' },
    { value: 'change-location', label: 'Change Location' },
    { value: 'change-status', label: 'Change Status' },
    { value: 'change-duration', label: 'Change Duration' },
    { value: 'cancel', label: 'Cancel' },
  ];

  const statusOptions = [
    { value: '', label: 'Select status' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' },
    { value: 'rescheduled', label: 'Rescheduled' },
  ];

  return (
    <>
      <ConfigSection>
        <DrawerInput
          label="Appointment ID *"
          value={formData.appointmentId || ''}
          onChange={(e) => handleInputChange('appointmentId', e.target.value)}
          placeholder="Enter appointment ID"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerSelect
          label="Update Type *"
          value={formData.updateType || ''}
          onChange={(e) => handleInputChange('updateType', e.target.value)}
          options={updateTypeOptions}
        />
      </ConfigSection>

      {(formData.updateType === 'reschedule' || formData.updateType === '') && (
        <ConfigSection>
          <DrawerInput
            label="New Date & Time"
            type="datetime-local"
            value={formData.newDateTime || ''}
            onChange={(e) => handleInputChange('newDateTime', e.target.value)}
          />
        </ConfigSection>
      )}

      {(formData.updateType === 'change-duration' || formData.updateType === '') && (
        <ConfigSection>
          <DrawerInput
            label="New Duration (minutes)"
            type="number"
            value={formData.newDuration || ''}
            onChange={(e) => handleInputChange('newDuration', e.target.value)}
            placeholder="30"
          />
        </ConfigSection>
      )}

      {(formData.updateType === 'change-provider' || formData.updateType === '') && (
        <>
          <ConfigSection>
            <DrawerInput
              label="New Provider ID"
              value={formData.newProviderId || ''}
              onChange={(e) => handleInputChange('newProviderId', e.target.value)}
              placeholder="Enter new provider ID"
            />
          </ConfigSection>

          <ConfigSection>
            <DrawerInput
              label="New Provider Name"
              value={formData.newProviderName || ''}
              onChange={(e) => handleInputChange('newProviderName', e.target.value)}
              placeholder="Enter new provider name"
            />
          </ConfigSection>
        </>
      )}

      {(formData.updateType === 'change-location' || formData.updateType === '') && (
        <ConfigSection>
          <DrawerInput
            label="New Location"
            value={formData.newLocation || ''}
            onChange={(e) => handleInputChange('newLocation', e.target.value)}
            placeholder="Enter new location"
          />
        </ConfigSection>
      )}

      {(formData.updateType === 'change-status' || formData.updateType === '') && (
        <ConfigSection>
          <DrawerSelect
            label="New Status"
            value={formData.newStatus || ''}
            onChange={(e) => handleInputChange('newStatus', e.target.value)}
            options={statusOptions}
          />
        </ConfigSection>
      )}

      <ConfigSection>
        <DrawerInput
          label="Reason for Update"
          value={formData.reason || ''}
          onChange={(e) => handleInputChange('reason', e.target.value)}
          placeholder="Enter reason for update"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerTextArea
          label="Notes"
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Additional notes about the update..."
        />
      </ConfigSection>
    </>
  );
};

export default UpdateAppointmentNodeDrawer;
