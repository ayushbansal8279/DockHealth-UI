/* eslint-disable import/extensions */
import React, { useCallback, useEffect, useState } from 'react';
import { AddPlaceholder } from 'components/task/styled';
import { BooleanBox, BooleanSelect, PlaceholderContainer } from './styled';

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
      {!value && (
        <PlaceholderContainer>
          <AddPlaceholder>+ Add</AddPlaceholder>
        </PlaceholderContainer>
      )}
      <BooleanSelect
        name="booleanCustomField"
        value={value}
        onChange={handleChange}
        options={options}
        disableUnderline
        IconComponent={() => <></>}
      />
    </BooleanBox>
  );
};
export default TaskItemBoolean;
