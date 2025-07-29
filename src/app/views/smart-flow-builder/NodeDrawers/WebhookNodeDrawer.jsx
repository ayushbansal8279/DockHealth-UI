import React, { useState } from 'react';
import { ConfigSection } from './styled';
import DrawerInput from '@/app/components/common/DrawerInput/DrawerInput';
import DrawerSelect from '@/app/components/common/DrawerSelect/DrawerSelect';
import DrawerTextArea from '@/app/components/common/DrawerTextArea/DrawerTextArea';

export default function WebhookNodeDrawer({ nodeData, onUpdate }) {
  const [formData, setFormData] = useState({
    url: nodeData?.url || '',
    method: nodeData?.method || 'POST',
    headers: nodeData?.headers || [],
    body: nodeData?.body || '',
    bodyType: nodeData?.bodyType || 'json',
    authentication: nodeData?.authentication || 'none',
    apiKey: nodeData?.apiKey || '',
  });

  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };
  return (
    <>
      <ConfigSection>
        <DrawerInput
          label="URL"
          value={formData.url || ''}
          onChange={(e) => handleInputChange('url', e.target.value)}
          placeholder="https://api.example.com/webhook"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerSelect
          label="Method"
          value={formData.method || 'POST'}
          onChange={(e) => handleInputChange('method', e.target.value)}
          options={[
            { value: 'GET', label: 'GET' },
            { value: 'POST', label: 'POST' },
            { value: 'PUT', label: 'PUT' },
            { value: 'PATCH', label: 'PATCH' },
            { value: 'DELETE', label: 'DELETE' },
          ]}
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerTextArea
          label="Headers (JSON)"
          value={formData.headers}
          onChange={(e) => {
            try {
              const headers = JSON.parse(e.target.value);
              handleInputChange('headers', headers);
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          placeholder={`Headers (JSON)\n{"Authorization": "Bearer token", "Content-Type": "application/json"}`}
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerTextArea
          value={formData.body || ''}
          onChange={(e) => handleInputChange('body', e.target.value)}
          placeholder="Request body content..."
        />
      </ConfigSection>
    </>
  );
}
