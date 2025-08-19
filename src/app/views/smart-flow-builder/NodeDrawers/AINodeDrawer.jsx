import React, { useState } from 'react';
import { ConfigSection } from './styled';
import DrawerSelect from '@/app/components/common/DrawerSelect/DrawerSelect';
import DrawerTextArea from '@/app/components/common/DrawerTextArea/DrawerTextArea';

const AINodeDrawer = ({ nodeData = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    promptType: nodeData.promptType || 'general',
    customPrompt: nodeData.customPrompt || '',
    outputFormat: nodeData.outputFormat || 'markdown',
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
        <DrawerSelect
          label="Prompt Type"
          value={formData.promptType || 'general'}
          onChange={(e) => handleInputChange('promptType', e.target.value)}
          options={[
            { value: 'general', label: 'General Summary' },
            { value: 'email', label: 'Email Summary' },
            { value: 'clinical', label: 'Clinical Note' },
            { value: 'oneliner', label: 'One Liner' },
            { value: 'nextsteps', label: 'Next Steps' },
            { value: 'journey', label: 'Patient Journey' },
          ]}
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerTextArea
          label="Custom Prompt"
          value={formData.customPrompt || ''}
          onChange={(e) => handleInputChange('customPrompt', e.target.value)}
          placeholder="Enter custom prompt (optional)..."
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerSelect
          label="Output Format"
          value={formData.outputFormat || 'markdown'}
          onChange={(e) => handleInputChange('outputFormat', e.target.value)}
          options={[
            { value: 'markdown', label: 'Markdown' },
            { value: 'html', label: 'HTML' },
            { value: 'text', label: 'Plain Text' },
            { value: 'json', label: 'JSON' },
          ]}
        />
      </ConfigSection>
    </>
  );
};

export default AINodeDrawer;
