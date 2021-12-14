import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import Select from 'components/common/Select/Select';
import PriorityFlag from 'img/priority-flag';
import { changeTaskPriority } from 'actions/task-actions';
import { onTaskDrawerTaskPriorityChanged } from 'helpers/ga-event-helper';
import { getPriorityColor, TaskPriority } from 'helpers/task-helpers';
import { PriorityFieldContainer, PriorityFlagContainer } from './styled';
import { PRIORITY_OPTIONS } from './helpers';

const PrioritySection = () => {
  const dispatch = useDispatch();
  const selectedTask = useSelector(selectedTaskSelector);
  const { taskIdentifier, priority } = selectedTask || {};

  const [currentTaskPriority, setCurrentTaskPriority] = useState(null);

  useEffect(() => {
    setCurrentTaskPriority(priority);
  }, [priority]);

  const handleOptionChange = event => {
    const { value } = event.target;
    onTaskDrawerTaskPriorityChanged(value);

    const nextValue = value !== TaskPriority.NONE ? value : null;

    setCurrentTaskPriority(nextValue);
    dispatch(changeTaskPriority(taskIdentifier, nextValue));
  };

  return (
    <PriorityFieldContainer>
      <PriorityFlagContainer>
        <PriorityFlag color={getPriorityColor(currentTaskPriority)} />
      </PriorityFlagContainer>
      <Select
        label="Priority"
        name="priority"
        value={currentTaskPriority || TaskPriority.NONE}
        onChange={handleOptionChange}
        options={PRIORITY_OPTIONS}
      />
    </PriorityFieldContainer>
  );
};

export default PrioritySection;
