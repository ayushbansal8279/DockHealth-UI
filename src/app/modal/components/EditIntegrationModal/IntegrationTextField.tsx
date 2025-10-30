import React from 'react';
import { TextField } from '@mui/material';
import { TextFieldStyles } from './styled';

interface IntegrationTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  width?: string;
}

const IntegrationTextField: React.FC<IntegrationTextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error = false,
  helperText,
  fullWidth = true,
  width,
}) => {
  const displayLabel = required ? `${label} *` : label;

  return (
    <TextField
      size="small"
      label={displayLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      fullWidth={fullWidth}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      sx={{
        ...TextFieldStyles,
        width: width || (fullWidth ? '100%' : 'auto'),
      }}
    />
  );
};

export default IntegrationTextField;

