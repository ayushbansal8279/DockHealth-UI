import React from 'react';
import { useDispatch } from 'react-redux';
import Select from 'components/common/Select/Select';
import PriorityFlag from 'img/priority-flag';
import { changeTaskPriority } from 'actions/task-actions';
import { onTaskDrawerTaskPriorityChanged } from 'helpers/ga-event-helper';
import { getPriorityColor, TaskPriority } from 'helpers/task-helpers';
import { PriorityFieldContainer, PriorityFlagContainer, Title } from './styled';
import { PRIORITY_OPTIONS } from './helpers';
import PrioritySelectIcon from 'img/PrioritySelectIcon';
import { Button } from '@mui/material';
import Spacing from 'components/common/Spacing';

const PrioritySection = ({ selectedTask, disabled = false }) => {
  const dispatch = useDispatch();
  const { priority } = selectedTask || {};
  const [open, setOpen] = React.useState(false);

  const handleOptionChange = (event) => {
    const { value } = event.target;

    onTaskDrawerTaskPriorityChanged(value);
    dispatch(changeTaskPriority(selectedTask, value));
  };

  return (
    <PriorityFieldContainer>
      <Title>Priority</Title>
      {/* Required for future Changes */}
      {/* <PriorityFlagContainer>
        <PriorityFlag color={getPriorityColor(priority)} />
      </PriorityFlagContainer> */}

      <Button
        style={{ margin: '10px' }}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Spacing horizontal={4} />
        <PrioritySelectIcon />
        <Spacing horizontal={4} />
        <Select
          size="small"
          variant="standard"
          // label="Priority"
          // name="priority"
          open={open}
          value={priority || TaskPriority.LOW}
          onChange={handleOptionChange}
          options={PRIORITY_OPTIONS}
          disabled={disabled}
        ></Select>
      </Button>
    </PriorityFieldContainer>
  );
};

export default PrioritySection;
