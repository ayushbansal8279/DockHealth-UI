/* eslint-disable import/extensions */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AddPlaceholder } from 'components/task/styled';
import {
  ColorIndicator,
  DropdownBox,
  DropdownSelect,
  PlaceholderContainer,
} from './styled';

const TaskItemPriority = ({
  value: initialValue,
  onChange,
  field: { options: initialOptions },
  readOnly = false,
}) => {
  const [value, setValue] = useState(initialValue);

  const options = useMemo(
    () =>
      initialOptions?.map(({ identifier, name, color }) => ({
        label: name,
        value: identifier,
        color,
      })) || [],
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

  const colorIndicator = options?.find(o => o.value === value)?.color;

  return (
    <>
      {colorIndicator && <ColorIndicator color={colorIndicator} />}
      <DropdownBox>
        {!value && (
          <PlaceholderContainer>
            <AddPlaceholder>+ Add</AddPlaceholder>
          </PlaceholderContainer>
        )}
        <DropdownSelect
          name="dropdownpriority"
          value={value}
          onChange={handleChange}
          options={options.sort((a, b) => a?.label?.localeCompare(b?.label))}
          disableUnderline
          IconComponent={() => <></>}
          disabled={readOnly}
        />
      </DropdownBox>
    </>
  );
};
export default TaskItemPriority;
