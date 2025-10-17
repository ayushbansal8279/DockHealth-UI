import React from 'react';
import { TextField } from '@mui/material';
import { TextFieldStyles } from './styled';

interface EscalationPolicyTextFieldProps {
  label: string;
  fieldName: string;
  fieldType?: 'action' | 'form' | 'trigger';
  actionType?: string;
  actionIndex?: number;
  actionParams?: any;
  updateAction?: (index: number, actionData: any) => void;
  formData?: any;
  setFormData?: (data: any) => void;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  type?: string;
  inputProps?: object;
  required?: boolean;
  width?: string;
  error?: boolean;
  customValue?: string | number;
  customOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EscalationPolicyTextField: React.FC<EscalationPolicyTextFieldProps> = ({
  label,
  fieldName,
  fieldType = 'action',
  actionType,
  actionIndex,
  actionParams,
  updateAction,
  formData,
  setFormData,
  fullWidth = true,
  multiline = false,
  rows,
  placeholder,
  type = 'text',
  inputProps,
  required = false,
  width,
  error = false,
  customValue,
  customOnChange,
}) => {
  const getValue = () => {
    if (customValue !== undefined) return customValue;
    
    switch (fieldType) {
      case 'action':
        return actionParams?.[fieldName] || '';
      case 'form':
        return formData?.[fieldName] || '';
      case 'trigger':
        return formData?.trigger?.[fieldName] || '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (customOnChange) {
      customOnChange(e);
      return;
    }

    const value = type === 'number' ? (parseInt(e.target.value) || 0) : e.target.value;
    
    switch (fieldType) {
      case 'action':
        if (updateAction && actionType && actionIndex !== undefined) {
          if (fieldName === 'recipients') {
            const recipients = e.target.value.split(',').map(email => email.trim()).filter(email => email);
            updateAction(actionIndex, {
              type: actionType,
              params: {
                ...actionParams,
                [fieldName]: recipients,
              },
            });
          } else {
            updateAction(actionIndex, {
              type: actionType,
              params: {
                ...actionParams,
                [fieldName]: value,
              },
            });
          }
        }
        break;
      case 'form':
        if (setFormData && formData) {
          setFormData({ ...formData, [fieldName]: value });
        }
        break;
      case 'trigger':
        if (setFormData && formData) {
          setFormData({ 
            ...formData, 
            trigger: { ...formData.trigger, [fieldName]: value }
          });
        }
        break;
    }
  };

  const displayLabel = required ? `${label} *` : label;
  const fieldValue = getValue();
  
  const displayValue = fieldName === 'recipients' && Array.isArray(fieldValue) 
    ? fieldValue.join(', ') 
    : fieldValue;

  return (
    <TextField
      size="small"
      label={displayLabel}
      value={displayValue}
      onChange={handleChange}
      variant="outlined"
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      placeholder={placeholder}
      type={type}
      inputProps={inputProps}
      error={error}
      sx={{
        ...TextFieldStyles,
        width: width || (fullWidth ? '100%' : 'auto'),
      }}
    />
  );
};

export default EscalationPolicyTextField;
