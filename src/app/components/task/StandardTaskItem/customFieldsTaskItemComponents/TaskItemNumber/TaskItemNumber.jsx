import React, { useCallback, useEffect, useState } from 'react';
import { NumberInputContainer } from './styled';
import { InputAdornment } from '@mui/material';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { stringToRegex } from '@/app/helpers/custom-fields-helpers';
import { StyledCompactTextField } from '../styled';

const TaskItemNumber = ({
  value: initialValue = '',
  onChange,
  validationRegex,
  readOnly = false,
}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const validateWithRegex = (value) => {
    if (!validationRegex) {
      return null;
    }
    const regex = stringToRegex(validationRegex);
    if (!value) {
      return null;
    }
    if (!(regex instanceof RegExp)) {
      return null;
    }
    const isMatch = regex.test(value);
    return isMatch ? null : 'Not satisfying validation regex';
  };

  const handleOnChange = useCallback((event) => {
    setValue(event.target.value);
    const validationError = validateWithRegex(event.target.value);
    setError(validationError);
  }, []);

  const handleBlur = useCallback(() => {
    if (!readOnly && !error) {
      onChange(value);
    }
  }, [onChange, readOnly, value, error, validationRegex]);

  return (
    <NumberInputContainer>
      <StyledCompactTextField
        type="number"
        variant="filled"
        hiddenLabel
        value={value}
        onBlur={handleBlur}
        onChange={handleOnChange}
        readOnly={readOnly}
        error={error}
        InputProps={{
          endAdornment: error ? (
            <InputAdornment position="end">
              <Tooltip title={error}>
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ color: 'error.main', cursor: 'pointer' }}
                />
              </Tooltip>
            </InputAdornment>
          ) : null,
        }}
      />
    </NumberInputContainer>
  );
};

export default TaskItemNumber;
