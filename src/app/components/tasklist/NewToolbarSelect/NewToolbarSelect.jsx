import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Button from 'components/common/v2/Button/Button';
import zIndex from 'styles/z-index';
import { Select, SelectWrapper, SelectIcon, OptionsMenu } from './styled';
import Switch from '@mui/material/Switch';
import { useDispatch } from 'react-redux';
import { getCurrentListTasks } from '@/app/actions/list-details-actions';
import { updateTaskStatusToFilter } from 'actions/task-list-actions';

const NewToolbarSelect = ({
  options,
  name,
  icon,
  searchValue,
  focused,
  taskListIdentifier,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedIncomplete, setCheckedIncomplete] = useState(true);
  const [checkedCompleted, setCheckedCompleted] = useState(false);
  const [value, setValue] = useState('Incomplete Task');

  const handleCheckedIncomplete = (e) => {
    setCheckedIncomplete(e.target.checked);
  };
  const handleCheckedCompleted = (e) => setCheckedCompleted(e.target.checked);

  const dispatch = useDispatch();

  const handleChangeTasksStatus = useCallback(() => {
    const status =
      checkedIncomplete && checkedCompleted
        ? ''
        : checkedCompleted
        ? 'COMPLETE'
        : 'INCOMPLETE';
    dispatch(updateTaskStatusToFilter(status));
    dispatch(getCurrentListTasks());
    setValue(
      checkedIncomplete && checkedCompleted
        ? 'All Tasks'
        : checkedIncomplete
        ? 'Incomplete Task'
        : checkedCompleted
        ? 'Completed Task'
        : 'Incomplete Task',
    );
    setIsOpen(false);
  }, [checkedCompleted, checkedIncomplete, dispatch]);

  useEffect(() => {
    setCheckedIncomplete(true);
    setCheckedCompleted(false);
  }, [taskListIdentifier]);

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
          return (
            <SelectIcon>
              {icon}
              <Box component="span" mx={0.5} />
              {selectedValue}
            </SelectIcon>
          );
        }}
      >
        {isOpen && (
          <>
            <div style={{ display: 'flex' }}>
              <Switch
                onChange={handleCheckedIncomplete}
                checked={checkedIncomplete}
              />
              <OptionsMenu>{options[0].label}</OptionsMenu>
            </div>
            <div style={{ display: 'flex' }}>
              <Switch
                onChange={handleCheckedCompleted}
                checked={checkedCompleted}
              />
              <OptionsMenu>{options[1].label}</OptionsMenu>
            </div>
            <hr style={{ margin: '6px 0px' }} />
            <OptionsMenu>
              <Button onClick={handleChangeTasksStatus} variant="primary-red">
                Apply
              </Button>
            </OptionsMenu>
          </>
        )}
      </Select>
    </SelectWrapper>
  );
};

export default NewToolbarSelect;
