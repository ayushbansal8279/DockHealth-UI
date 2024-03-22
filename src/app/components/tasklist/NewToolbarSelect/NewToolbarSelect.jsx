import React, { useCallback, useState } from 'react';
import { MenuItem, Box } from '@mui/material';
import Button from 'components/common/v2/Button/Button';
import zIndex from 'styles/z-index';
import palette from 'styles/palette';
import { Select, SelectWrapper, SelectIcon } from './styled';
import Switch from '@mui/material/Switch';
import { useDispatch } from 'react-redux';
import { getCurrentListTasks } from '@/app/actions/list-details-actions';

const NewToolbarSelect = ({
  options,
  name,
  value,
  icon,
  searchValue,
  focused,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedIncomplete, setCheckedIncomplete] = useState(true);
  const [checkedCompleted, setCheckedCompleted] = useState(false);

  const handleCheckedIncomplete = (event) => {
    setCheckedIncomplete(event.target.checked);
  };

  const handleCheckedCompleted = (event) => {
    setCheckedCompleted(event.target.checked);
  };

  const dispatch = useDispatch();

  const handleChangeTasksStatus = useCallback(() => {
    const status =
      checkedIncomplete && checkedCompleted
        ? ''
        : checkedCompleted
        ? 'COMPLETE'
        : 'INCOMPLETE';
    dispatch(getCurrentListTasks({ status: status }));
  });

  return (
    <SelectWrapper>
      <Select
        onOpen={() => {
          setIsOpen(true);
        }}
        onClose={() => {
          setIsOpen(false);
        }}
        iconcoloractive={restProps.iconColorActive}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          getContentAnchorEl: null,
          style: { zIndex: zIndex.optionsMenu },
        }}
        variant="outlined"
        inputProps={{ name }}
        isOpen={isOpen}
        value={value}
        renderValue={(selectedValue) => {
          const foundOption = options?.find(
            (option) => option.value === selectedValue,
          );
          return (
            <SelectIcon>
              {icon}
              <Box component="span" mx={0.5} />
              {foundOption?.label || ''}
            </SelectIcon>
          );
        }}
        {...restProps}
      >
        <div style={{ display: 'flex' }}>
          <Switch
            onChange={handleCheckedIncomplete}
            checked={checkedIncomplete}
          />
          <MenuItem
            key={options[0].value}
            value={options[0].value}
            disabled={options[0].disabled}
          >
            {options[0].label}
          </MenuItem>
        </div>
        <div style={{ display: 'flex' }}>
          <Switch
            onChange={handleCheckedCompleted}
            checked={checkedCompleted}
          />
          <MenuItem
            key={options[1].value}
            value={options[1].value}
            disabled={options[1].disabled}
          >
            {options[1].label}
          </MenuItem>
        </div>
        <div style={{ padding: '5px' }}>
          <Button
            onClick={() => {
              handleChangeTasksStatus();
            }}
            variant="primary-red"
          >
            Apply
          </Button>
        </div>
      </Select>
    </SelectWrapper>
  );
};

export default NewToolbarSelect;
