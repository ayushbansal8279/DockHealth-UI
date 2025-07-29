import React, { useState } from 'react';
import { ConfigSection } from './styled';
import DrawerInput from '@/app/components/common/DrawerInput/DrawerInput';
import DrawerSelect from '@/app/components/common/DrawerSelect/DrawerSelect';
import DrawerTextArea from '@/app/components/common/DrawerTextArea/DrawerTextArea';

const EmailNodeDrawer = ({ nodeData = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    to: nodeData.recipients?.join(', ') || '',
    subject: nodeData.subject || '',
    body: nodeData.htmlContent || '',
    template: nodeData.template || '',
  });

  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    onUpdate?.({
      ...nodeData,
      recipients: updated.to.split(',').map((s) => s.trim()),
      subject: updated.subject,
      htmlContent: updated.body,
      template: updated.template,
    });
  };
  const options = [
    { value: '', label: 'No option' },
    { value: 'task-notification', label: 'Task Notification' },
    { value: 'summary-report', label: 'Summary Report' },
    { value: 'reminder', label: 'Reminder' },
    { value: 'welcome', label: 'Welcome Email' },
  ];

  return (
    <>
      <ConfigSection>
        <DrawerInput
          label="To (Recipients)"
          value={formData.to || ''}
          onChange={(e) => handleInputChange('to', e.target.value)}
          placeholder="Enter email addresses (comma-separated)"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Subject"
          value={formData.subject || ''}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          placeholder="Enter email subject"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerTextArea
          value={formData.body || ''}
          onChange={(e) => handleInputChange('body', e.target.value)}
          placeholder="Enter email content..."
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

export default EmailNodeDrawer;
