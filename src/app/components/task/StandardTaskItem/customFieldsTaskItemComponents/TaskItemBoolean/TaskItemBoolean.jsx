/* eslint-disable import/extensions */
import React, { useCallback, useEffect, useState } from 'react';
import { BOOL_SELECT_OPTIONS } from 'helpers/custom-fields-helpers';
import { AddPlaceholder } from 'components/task/styled';
import { BooleanBox, BooleanSelect, PlaceholderContainer } from './styled';

const TaskItemBoolean = ({ value: initialValue, onChange }) => {
  const [value, setValue] = useState(initialValue);

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
        options={BOOL_SELECT_OPTIONS}
        disableUnderline
        IconComponent={() => <></>}
      />
    </BooleanBox>
  );
};
export default TaskItemBoolean;
