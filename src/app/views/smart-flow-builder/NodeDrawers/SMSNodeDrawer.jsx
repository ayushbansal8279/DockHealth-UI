import React, { useState } from 'react';
import { ConfigSection } from './styled';
import DrawerInput from '@/app/components/common/DrawerInput/DrawerInput';
import DrawerSelect from '@/app/components/common/DrawerSelect/DrawerSelect';
import DrawerTextArea from '@/app/components/common/DrawerTextArea/DrawerTextArea';

const SMSNodeDrawer = ({ nodeData = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    to: nodeData.recipients?.join(', ') || '',
    message: nodeData.message || '',
    template: nodeData.template || '',
  });

  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    onUpdate?.({
      ...nodeData,
      recipients: updated.to.split(',').map((s) => s.trim()),
      message: updated.message,
      template: updated.template,
    });
  };

  const options = [
    { value: '', label: 'No template' },
    { value: 'task-notification', label: 'Task Notification' },
    { value: 'appointment-reminder', label: 'Appointment Reminder' },
    { value: 'follow-up', label: 'Follow-up Message' },
    { value: 'welcome', label: 'Welcome SMS' },
  ];

  return (
    <>
      <ConfigSection>
        <DrawerInput
          label="To (Recipients)"
          value={formData.to || ''}
          onChange={(e) => handleInputChange('to', e.target.value)}
          placeholder="Enter phone numbers (comma-separated)"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerTextArea
          label="Message"
          value={formData.message || ''}
          onChange={(e) => handleInputChange('message', e.target.value)}
          placeholder="Enter SMS message content..."
        />
      </ConfigSection>

      <ConfigSection style={{ marginTop: '10px' }}>
        <DrawerSelect
          label="Template"
          value={formData.template || ''}
          onChange={(e) => handleInputChange('template', e.target.value)}
          options={options}
        />
      </ConfigSection>
    </>
  );
};

export default SMSNodeDrawer;
