import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import Select from 'components/common/Select/Select';
import PriorityFlag from 'img/priority-flag';
import { changeTaskPriority } from 'actions/task-actions';
import { onTaskDrawerTaskPriorityChanged } from 'helpers/ga-event-helper';
import { getPriorityColor, TaskPriority } from 'helpers/task-helpers';
import { PriorityFieldContainer, PriorityFlagContainer } from './styled';
import { PRIORITY_OPTIONS } from './helpers';

const PrioritySection = ({ disabled = false }) => {
  const dispatch = useDispatch();
  const selectedTask = useSelector(selectedTaskSelector);
  const { priority } = selectedTask || {};

  const handleOptionChange = event => {
    const { value } = event.target;

    onTaskDrawerTaskPriorityChanged(value);
    dispatch(changeTaskPriority(selectedTask, value));
  };

  return (
    <PriorityFieldContainer>
      <PriorityFlagContainer>
        <PriorityFlag color={getPriorityColor(priority)} />
      </PriorityFlagContainer>
      <Select
        label="Priority"
        name="priority"
        value={priority || TaskPriority.NONE}
        onChange={handleOptionChange}
        options={PRIORITY_OPTIONS}
        disabled={disabled}
      />
    </PriorityFieldContainer>
  );
};

export default PrioritySection;
