import React, { useState } from 'react';
import { ConfigSection } from './styled';
import DrawerInput from '@/app/components/common/DrawerInput/DrawerInput';
import DrawerSelect from '@/app/components/common/DrawerSelect/DrawerSelect';
import DrawerTextArea from '@/app/components/common/DrawerTextArea/DrawerTextArea';

const CreateNoteNodeDrawer = ({ nodeData = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: nodeData.title || '',
    noteType: nodeData.noteType || '',
    patientId: nodeData.patientId || '',
    patientName: nodeData.patientName || '',
    providerId: nodeData.providerId || '',
    providerName: nodeData.providerName || '',
    content: nodeData.content || '',
    priority: nodeData.priority || 'normal',
    category: nodeData.category || '',
    tags: nodeData.tags || '',
    isPrivate: nodeData.isPrivate || false,
    template: nodeData.template || '',
  });

  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    onUpdate?.({
      ...nodeData,
      [field]: value,
    });
  };

  const noteTypeOptions = [
    { value: '', label: 'Select note type' },
    { value: 'clinical', label: 'Clinical Note' },
    { value: 'progress', label: 'Progress Note' },
    { value: 'discharge', label: 'Discharge Summary' },
    { value: 'consultation', label: 'Consultation Note' },
    { value: 'procedure', label: 'Procedure Note' },
    { value: 'follow-up', label: 'Follow-up Note' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'plan', label: 'Treatment Plan' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const categoryOptions = [
    { value: '', label: 'Select category' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'general', label: 'General Medicine' },
  ];

  const templateOptions = [
    { value: '', label: 'No template' },
    { value: 'soap', label: 'SOAP Note' },
    { value: 'hpi', label: 'History of Present Illness' },
    { value: 'physical-exam', label: 'Physical Examination' },
    { value: 'assessment-plan', label: 'Assessment & Plan' },
    { value: 'discharge', label: 'Discharge Template' },
  ];

  return (
    <>
      <ConfigSection>
        <DrawerInput
          label="Title *"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter note title"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerSelect
          label="Note Type *"
          value={formData.noteType || ''}
          onChange={(e) => handleInputChange('noteType', e.target.value)}
          options={noteTypeOptions}
        />
      </ConfigSection>

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
        <DrawerSelect
          label="Priority"
          value={formData.priority || 'normal'}
          onChange={(e) => handleInputChange('priority', e.target.value)}
          options={priorityOptions}
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerSelect
          label="Category"
          value={formData.category || ''}
          onChange={(e) => handleInputChange('category', e.target.value)}
          options={categoryOptions}
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerInput
          label="Tags"
          value={formData.tags || ''}
          onChange={(e) => handleInputChange('tags', e.target.value)}
          placeholder="Enter tags (comma-separated)"
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerSelect
          label="Template"
          value={formData.template || ''}
          onChange={(e) => handleInputChange('template', e.target.value)}
          options={templateOptions}
        />
      </ConfigSection>

      <ConfigSection>
        <DrawerTextArea
          label="Content *"
          value={formData.content || ''}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="Enter note content..."
          rows={8}
        />
      </ConfigSection>
    </>
  );
};

export default CreateNoteNodeDrawer;
