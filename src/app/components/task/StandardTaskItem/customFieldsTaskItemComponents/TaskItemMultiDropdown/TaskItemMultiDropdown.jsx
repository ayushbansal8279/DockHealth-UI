/* eslint-disable import/extensions */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MenuItem,
  ListItemText,
  Checkbox,
  Input,
  Select,
} from '@material-ui/core';
import zIndex from 'styles/z-index';
import { DropdownBox } from './styled';

const TaskItemMultiDropdown = ({ value: initialValue, onChange, field }) => {
  const { options: initialOptions } = field;
  const [value, setValue] = useState(initialValue);
  const options = useMemo(() => {
    return (
      initialOptions?.map(({ identifier, name }) => ({
        label: name,
        value: identifier,
      })) || []
    );
  }, [initialOptions]);

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
    <>
      <DropdownBox>
        <Select
          multiple
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
            style: { zIndex: zIndex.optionsMenu },
          }}
          onChange={handleChange}
          disableUnderline
          options={options}
          value={value ?? []}
          input={<Input />}
          IconComponent={() => <></>}
          renderValue={selectedValue =>
            selectedValue
              .map(selected => {
                return options.find(option => option.value === selected)?.label;
              })
              .join(', ')
          }
        >
          {options?.map(option => {
            return (
              <MenuItem key={option.value} value={option.value}>
                {value.includes(option.value) ? (
                  <Checkbox checked />
                ) : (
                  <Checkbox />
                )}
                <ListItemText primary={option.label} />
              </MenuItem>
            );
          })}
        </Select>
      </DropdownBox>
    </>
  );
};
export default TaskItemMultiDropdown;
