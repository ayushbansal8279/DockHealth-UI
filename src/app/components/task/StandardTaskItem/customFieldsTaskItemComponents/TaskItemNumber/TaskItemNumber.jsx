import React, { useCallback, useEffect, useState } from 'react';
import Input from 'components/common/Input/Input';
import { NumberInputContainer } from './styled';

const TaskItemNumber = ({
  value: initialValue = '',
  onChange,
  readOnly = false,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

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
    <NumberInputContainer>
      <Input
        type="number"
        value={value}
        name="numberCustomField"
        onBlur={handleBlur}
        onChange={handleOnChange}
        InputProps={{ disableUnderline: true }}
        readOnly={readOnly}
      />
    </NumberInputContainer>
  );
};

export default TaskItemNumber;
