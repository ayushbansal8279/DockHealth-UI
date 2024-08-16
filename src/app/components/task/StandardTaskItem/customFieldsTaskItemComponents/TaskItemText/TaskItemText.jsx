import React, { useCallback, useEffect, useState, useRef } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { useBoolean } from 'hooks/useBoolean';
import Input from 'components/common/Input/Input';
import { TextContainer, TextValue, AddPlaceholder } from './styled';

const TaskItemText = ({
  value: initialValue = '',
  onChange,
  readOnly = false,
  placeholder,
  disabled = false,
}) => {
  const [value, setValue] = useState(initialValue);

  const inputReference = useRef(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const [isEditing, setEditing, unsetEditing] = useBoolean(false);

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

  const handleOnChange = useCallback(
    (event) => {
      setValue(event.target.value);
      setEditing(true);
    },
    [setEditing],
  );

  const handleBlur = useCallback(
    (event) => {
      if (!readOnly && initialValue !== event.target.value) {
        onChange(event.target.value);
      }
      setEditing(false);
    },
    [onChange, readOnly, setEditing, initialValue],
  );

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
          <Input
            hiddenLabel
            // characterLimit={characterLimit}
            readOnly={readOnly}
            disabled = {disabled}
            placeholder={placeholder}
            value={value}
            onChange={handleOnChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            style={{ padding: '0px' }}
            autofocus
            inputRef={inputReference}
          />
        </TextContainer>
      )}
    </>
  );
};

export default TaskItemText;
