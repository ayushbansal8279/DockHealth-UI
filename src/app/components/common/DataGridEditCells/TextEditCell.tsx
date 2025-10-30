import React, { useState, useEffect, useCallback } from 'react';
import { TextField } from '@mui/material';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';
import { stringToRegex } from '@/app/helpers/custom-fields-helpers';
import palette from '@/app/styles/palette';

export default function TextEditCell({
  id,
  field,
  value,
  name,
  column,
  setErrors,
  errors,
}: GridRenderEditCellParams<any, string | undefined>) {
  const apiRef = useGridApiContext();
  const { validationRegex, validationRegexDescription } = column;
  const [error, setError] = useState<string>('');

  const regex = validationRegex ? stringToRegex(validationRegex) : null;

  const validateValue = useCallback(
    (inputValue: string) => {
      if (!regex || !inputValue) {
        setError('');
        return true;
      }

      const isValid = regex.test(inputValue);
      setError(isValid ? '' : validationRegexDescription || 'Invalid format');
      return isValid;
    },
    [regex, validationRegexDescription, field],
  );

  useEffect(() => {
    if (error) {
      setErrors([...errors, { field, error }]);
    } else {
      setErrors(errors.filter((err: any) => err.field !== field));
    }
  }, [error]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    validateValue(newValue);

    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue,
    });
  };

  return (
    <TextField
      fullWidth
      value={value || ''}
      onChange={handleChange}
      placeholder={name}
      error={!!error}
      helperText={error}
      sx={{
        '& .MuiOutlinedInput-notchedOutline': {
          border: error ? `1px solid ${palette.error}` : 'none',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          outline: 'none',
          border: error ? `2px solid ${palette.error}` : 'none',
        },
        '&.Mui-focused': {
          backgroundColor: 'transparent',
        },
        '& .MuiFormHelperText-root': {
          position: 'absolute',
          bottom: '2px',
          fontSize: '0.75rem',
        },
      }}
    />
  );
}
