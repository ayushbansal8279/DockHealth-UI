/* eslint-disable import/extensions */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DropdownBox, DropdownSelect } from './styled';

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
      <DropdownSelect
        name="dropdownCustomField"
        value={value}
        onChange={handleChange}
        options={options}
      />
    </DropdownBox>
  );
};
export default TaskItemDropdown;
