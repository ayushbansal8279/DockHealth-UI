/* eslint-disable import/extensions */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AddPlaceholder } from 'components/task/styled';
import { DropdownBox, DropdownSelect, PlaceholderContainer } from './styled';

const TaskItemDropdown = ({
  value: initialValue,
  onChange,
  field: { options: initialOptions },
}) => {
  const [value, setValue] = useState(initialValue);
  const options = useMemo(
    () =>
      initialOptions?.map(({ identifier, name }) => ({
        label: name,
        value: identifier,
      })),
    [initialOptions],
  );

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
    <DropdownBox>
      {!value && (
        <PlaceholderContainer>
          <AddPlaceholder>+ Add</AddPlaceholder>
        </PlaceholderContainer>
      )}
      <DropdownSelect
        name="dropdownCustomField"
        value={value}
        onChange={handleChange}
        options={options}
        disableUnderline
        IconComponent={() => <></>}
      />
    </DropdownBox>
  );
};
export default TaskItemDropdown;
