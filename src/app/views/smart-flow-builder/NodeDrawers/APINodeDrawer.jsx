import React, { useState } from 'react';
import { ConfigSection } from './styled';
import DrawerInput from '@/app/components/common/DrawerInput/DrawerInput';
import DrawerSelect from '@/app/components/common/DrawerSelect/DrawerSelect';
import DrawerTextArea from '@/app/components/common/DrawerTextArea/DrawerTextArea';

const APINodeDrawer = ({ nodeData = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    baseUrl: nodeData?.baseUrl || '',
    endpoint: nodeData?.endpoint || '',
    method: nodeData?.method || 'GET',
    headers: nodeData?.headers || [],
    queryParams: nodeData?.queryParams || [],
    body: nodeData?.body || '',
    authentication: nodeData?.authentication || 'none',
    apiKey: nodeData?.apiKey || '',
    timeout: nodeData?.timeout || 10000,
    retries: nodeData?.retries || 3,
  });

  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    onUpdate?.({
      ...nodeData,
      [field]: value,
    });
  };

  return (
    <>
      <ConfigSection>
        <DrawerInput
          label="Base URL"
          value={formData.baseUrl || ''}
          onChange={(e) => handleInputChange('baseUrl', e.target.value)}
          placeholder="https://api.example.com"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Endpoint"
          value={formData.endpoint || ''}
          onChange={(e) => handleInputChange('endpoint', e.target.value)}
          placeholder="/users"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerSelect
          label="HTTP Method"
          value={formData.method || 'GET'}
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
          value={formData.timeout || 10000}
          onChange={(e) => handleInputChange('timeout', parseInt(e.target.value))}
          placeholder="10000"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Retries"
          type="number"
          value={formData.retries || 3}
          onChange={(e) => handleInputChange('retries', parseInt(e.target.value))}
          placeholder="3"
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
            { value: 'oauth', label: 'OAuth' },
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
          label="Query Parameters (JSON)"
          value={JSON.stringify(formData.queryParams, null, 2)}
          onChange={(e) => {
            try {
              const queryParams = JSON.parse(e.target.value);
              handleInputChange('queryParams', queryParams);
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          placeholder={`Query Parameters (JSON)\n{"limit": 10, "offset": 0}`}
        />
      </ConfigSection>

      {formData.method !== 'GET' && (
        <ConfigSection>
          <DrawerTextArea
            label="Request Body"
            value={formData.body || ''}
            onChange={(e) => handleInputChange('body', e.target.value)}
            placeholder="Request body content..."
          />
        </ConfigSection>
      )}
    </>
  );
};

export default APINodeDrawer;
