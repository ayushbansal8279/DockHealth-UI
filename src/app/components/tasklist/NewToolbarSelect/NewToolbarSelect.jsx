import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Popover } from '@mui/material';
import Button from 'components/common/v2/Button/Button';
import {
  SelectWrapper,
  SelectIcon,
  OptionsMenu,
  ButtonContainer,
  ButtonLabel,
  RotatableChevronButtonWrapper,
  BoxContainer,
  RotatableChevronButtonLabel,
  PopoverWrapper,
} from './styled';
import Switch from '@mui/material/Switch';
import { useDispatch } from 'react-redux';
import { getCurrentListTasks } from '@/app/actions/list-details-actions';
import { updateTaskStatusToFilter } from 'actions/task-list-actions';
import RotatableChevron from '../../common/RotatableChevron/RotatableChevron';
import palette from '@/app/styles/palette';

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
  const buttonRef = useRef(null);

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
      <BoxContainer>
        <ButtonContainer
          ref={buttonRef}
          variant="text"
          onClick={() => setIsOpen(true)}
          size="large"
        >
          <SelectIcon>{icon}</SelectIcon>
          <ButtonLabel variant="body1" component="span">
            {value}
          </ButtonLabel>
        </ButtonContainer>
        <Box display="flex" width="3px">
          <RotatableChevronButtonWrapper
            variant="text"
            onClick={() => setIsOpen(true)}
            size="large"
          >
            <RotatableChevronButtonLabel
              variant="body1"
              component="span"
            >
              <RotatableChevron rotated={isOpen} color={palette.white} />
            </RotatableChevronButtonLabel>
          </RotatableChevronButtonWrapper>
        </Box>
      </BoxContainer>
      <Popover
        anchorEl={buttonRef?.current}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <PopoverWrapper>
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
        </PopoverWrapper>
      </Popover>
    </SelectWrapper>
  );
};

export default NewToolbarSelect;
