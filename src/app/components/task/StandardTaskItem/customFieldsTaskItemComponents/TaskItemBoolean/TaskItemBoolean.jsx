/* eslint-disable import/extensions */
import React, { useCallback, useEffect, useState } from 'react';
import { BooleanBox, BooleanSelect } from './styled';

const TaskItemBoolean = ({ value: initialValue, onChange }) => {
  const [value, setValue] = useState(initialValue);
  const options = [
    {
      label: 'Yes',
      value: 'yes',
    },
    {
      label: 'No',
      value: 'no',
    },
  ];

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = useCallback(
    ({ target }) => {
      setValue(target.value);
      onChange(target.value);
    },
    [onChange],
  );

  return (
    <BooleanBox>
      <BooleanSelect
        name="booleanCustomField"
        value={value}
        onChange={handleChange}
        options={options}
      />
    </BooleanBox>
  );
};
export default TaskItemBoolean;
