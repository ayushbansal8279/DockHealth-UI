import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ListItemText, MenuItem, Select } from '@mui/material';
import { ColorIndicator, DropdownBox } from './styled';

const TaskItemDropdown = ({
  value: initialValue,
  onChange,
  field: { options: initialOptions, displayOptions },
  readOnly = false,
}) => {
  const isRequired = displayOptions.includes('TASK_REQUIRED');
  const [value, setValue] = useState(initialValue);

  const options = useMemo(() => {
    const o =
      initialOptions?.map(({ identifier, name, color, tag }) => ({
        label: name,
        tag,
        value: identifier,
        color,
      })) || [];

    if (o.length > 0 && !isRequired) {
      o.unshift({ label: 'None', value: null });
    }

    return o;
  }, [initialOptions, isRequired]);

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

  const colorIndicator = options?.find((o) => o.value === value)?.color;

  return (
    <>
      {colorIndicator && <ColorIndicator color={colorIndicator} />}
      <DropdownBox>
        <Select
          key={value}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            height: '26px',
          }}
          name="dropdownCustomField"
          value={value}
          renderValue={(selectedValue) =>
            options.find((option) => option.value === selectedValue)?.tag !== ''
              ? options.find((option) => option.value === selectedValue)?.label
              : options.find((option) => option.value === selectedValue)?.tag
          }
          onChange={handleChange}
          IconComponent={() => <></>}
          disabled={readOnly}
        >
          {options?.map((option) => {
            const { OptionIcon } = option;
            return (
              <MenuItem key={option.value} value={option.value}>
                {option.color && <ColorIndicator color={option.color} />}
                {OptionIcon || null}
                <ListItemText>{option.label}</ListItemText>
              </MenuItem>
            );
          })}
        </Select>
      </DropdownBox>
    </>
  );
};
export default TaskItemDropdown;
