import React, { useState } from 'react';
import { ConfigSection } from './styled';
import DrawerInput from '@/app/components/common/DrawerInput/DrawerInput';
import DrawerSelect from '@/app/components/common/DrawerSelect/DrawerSelect';
import DrawerTextArea from '@/app/components/common/DrawerTextArea/DrawerTextArea';

export default function CallWebhookNodeDrawer({ nodeData, onUpdate }) {
  const [formData, setFormData] = useState({
    url: nodeData?.url || '',
    method: nodeData?.method || 'POST',
    headers: nodeData?.headers || [],
    body: nodeData?.body || '',
    bodyType: nodeData?.bodyType || 'json',
    authentication: nodeData?.authentication || 'none',
    apiKey: nodeData?.apiKey || '',
    timeout: nodeData?.timeout || 5000,
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
          label="Webhook URL"
          value={formData.url || ''}
          onChange={(e) => handleInputChange('url', e.target.value)}
          placeholder="https://api.example.com/webhook"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerSelect
          label="HTTP Method"
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
        <DrawerInput
          label="Timeout (ms)"
          type="number"
          value={formData.timeout || 5000}
          onChange={(e) => handleInputChange('timeout', parseInt(e.target.value))}
          placeholder="5000"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerSelect
          label="Authentication"
          value={formData.authentication || 'none'}
          onChange={(e) => handleInputChange('authentication', e.target.value)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'bearer', label: 'Bearer Token' },
            { value: 'apikey', label: 'API Key' },
            { value: 'basic', label: 'Basic Auth' },
          ]}
        />
      </ConfigSection>

      {formData.authentication !== 'none' && (
        <ConfigSection>
          <DrawerInput
            label="API Key/Token"
            value={formData.apiKey || ''}
            onChange={(e) => handleInputChange('apiKey', e.target.value)}
            placeholder="Enter your API key or token"
            type="password"
          />
        </ConfigSection>
      )}

      <ConfigSection>
        <DrawerTextArea
          label="Headers (JSON)"
          value={JSON.stringify(formData.headers, null, 2)}
          onChange={(e) => {
            try {
              const headers = JSON.parse(e.target.value);
              handleInputChange('headers', headers);
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          placeholder={`Headers (JSON)\n{"Content-Type": "application/json"}`}
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerTextArea
          label="Request Body"
          value={formData.body || ''}
          onChange={(e) => handleInputChange('body', e.target.value)}
          placeholder="Request body content..."
        />
      </ConfigSection>
    </>
  );
}
