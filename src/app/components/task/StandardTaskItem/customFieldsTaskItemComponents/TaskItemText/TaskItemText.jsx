import React, { useCallback, useEffect, useState } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { useBoolean } from 'hooks/useBoolean';
import Input from 'components/common/Input/Input';
import { TextContainer } from './styled';

const TaskItemText = ({
  value: initialValue = '',
  onChange,
  readOnly = false,
  placeholder,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const [isEditing, setEditing, unsetEditing] = useBoolean(false);

  const handleOnChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  const handleBlur = useCallback(
    (event) => {
      if (!readOnly) {
        onChange(event.target.value);
      }
    },
    [onChange, readOnly],
  );

  return (
    <Tooltip placement="top" title={value} hideTooltip={isEditing}>
      <TextContainer>
        <Input
          hiddenLabel
          // characterLimit={characterLimit}
          readOnly={readOnly}
          placeholder={placeholder}
          value={value}
          onChange={handleOnChange}
          onBlur={handleBlur}
          style={{ padding: '0px' }}
        />
      </TextContainer>
    </Tooltip>
  );
};

export default TaskItemText;
