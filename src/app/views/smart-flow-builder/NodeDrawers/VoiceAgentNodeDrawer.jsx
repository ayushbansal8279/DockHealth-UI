import React, { useState } from 'react';
import { ConfigSection } from './styled';
import DrawerSelect from '@/app/components/common/DrawerSelect/DrawerSelect';
import DrawerTextArea from '@/app/components/common/DrawerTextArea/DrawerTextArea';

const VoiceAgentNodeDrawer = ({ nodeData = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    recipientType: nodeData.recipientType || 'patient',
    voiceCallPrompt: nodeData.voiceCallPrompt || '',
    informationToCollect: nodeData.informationToCollect || '',
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
          label="Recipient Type"
          value={formData.recipientType || 'patient'}
          onChange={(e) => handleInputChange('recipientType', e.target.value)}
          options={[
            { value: 'patient', label: 'Patient' },
            { value: 'provider', label: 'Healthcare Provider' },
            { value: 'caregiver', label: 'Caregiver' },
            { value: 'family', label: 'Family Member' },
            { value: 'emergency', label: 'Emergency Contact' },
            { value: 'custom', label: 'Custom Recipient' },
          ]}
        />
      </ConfigSection>
      <ConfigSection>
        <h7>Voice Prompt</h7>
        <DrawerTextArea
          label="Voice Prompt"
          value={formData.voiceCallPrompt || ''}
          onChange={(e) => handleInputChange('voiceCallPrompt', e.target.value)}
          placeholder="Enter the voice call script or prompt that the agent should use..."
        />
      </ConfigSection>

      <ConfigSection>
        <h7>Information to Collect</h7>
        <DrawerTextArea
          label="Information to collect"
          value={formData.informationToCollect || ''}
          onChange={(e) => handleInputChange('informationToCollect', e.target.value)}
          placeholder="Enter the information that should be collected during the voice call..."
        />
      </ConfigSection>
    </>
  );
};

export default VoiceAgentNodeDrawer;
