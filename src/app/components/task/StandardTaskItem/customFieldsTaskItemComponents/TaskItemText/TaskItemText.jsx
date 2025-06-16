import React, { useCallback, useEffect, useState, useRef } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { useBoolean } from 'hooks/useBoolean';
import { TextContainer, TextValue, AddPlaceholder } from './styled';
import { stringToRegex } from '@/app/helpers/custom-fields-helpers';
import InputAdornment from '@mui/material/InputAdornment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { StyledCompactTextField } from '../styled';

const TaskItemText = ({
  value: initialValue = '',
  onChange,
  readOnly = false,
  validationRegex,
  validationRegexDescription,
  placeholder,
}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);
  const inputReference = useRef(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const [isEditing, setEditing, unsetEditing] = useBoolean(false);
  const validationDescription =
    validationRegexDescription || 'Not satisfying validation regex';

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing) {
      inputReference.current?.focus();
    }
  }, [isEditing]);

  const handleClick = useCallback(
    (event) => {
      if (!readOnly) {
        setEditing(true);
      }
    },
    [readOnly, setEditing],
  );

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
    return isMatch ? null : validationDescription;
  };

  const handleOnChange = useCallback((event) => {
    const newValue = event.target.value;
    setValue(newValue);

    const validationError = validateWithRegex(newValue);
    setError(validationError);
  }, []);

  const handleBlur = useCallback(() => {
    if (!readOnly && !error && initialValue !== value) {
      onChange(value);
    }

    setEditing(false);
  }, [readOnly, initialValue, value, onChange, validationRegex, error]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        inputReference.current?.blur();
        handleBlur();
      }
    },
    [handleBlur],
  );

  return (
    <>
      {!isEditing && (
        <>
          {value && value !== '' && (
            <Tooltip placement="top" title={value}>
              <TextValue onClick={handleClick}>{value}</TextValue>
            </Tooltip>
          )}
          {!(value && value !== '') && (
            <TextValue onClick={handleClick}>
              <AddPlaceholder>+ Add</AddPlaceholder>
            </TextValue>
          )}
        </>
      )}
      {isEditing && (
        <TextContainer>
          <StyledCompactTextField
            variant="filled"
            hiddenLabel
            readOnly={readOnly}
            placeholder={placeholder}
            value={value}
            onChange={handleOnChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            autofocus
            inputRef={inputReference}
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
        </TextContainer>
      )}
    </>
  );
};

export default TaskItemText;
