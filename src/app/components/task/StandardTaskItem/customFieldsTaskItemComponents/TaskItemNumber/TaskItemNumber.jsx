import React, { useEffect, useState } from 'react';
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

  return (
    <NumberInputContainer>
      <Input
        type="number"
        value={value}
        name="numberCustomField"
        onBlur={() => onChange(value)}
        onChange={(event) => setValue(event.target.value)}
        InputProps={{ disableUnderline: true }}
        readOnly={readOnly}
      />
    </NumberInputContainer>
  );
};

export default TaskItemNumber;
