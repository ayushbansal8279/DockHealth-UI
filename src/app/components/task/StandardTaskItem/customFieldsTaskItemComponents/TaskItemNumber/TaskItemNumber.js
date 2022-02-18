import React, { useState } from 'react';
import Input from 'components/common/Input/Input';
import { NumberInputContainer } from './styled';

const TaskItemNumber = ({ value: initialValue = '', onChange }) => {
  const [value, setValue] = useState(initialValue);

  return (
    <NumberInputContainer>
      <Input
        type="number"
        value={value}
        name="numberCustomField"
        onBlur={() => onChange(value)}
        onChange={event => setValue(event.target.value)}
        InputProps={{ disableUnderline: true }}
      />
    </NumberInputContainer>
  );
};

export default TaskItemNumber;
