import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import TaskDensityImage from 'img/tour/task-density/task-density';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const TaskDensityStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Task density modal', 'Task density');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image height={295} src={TaskDensityImage} alt="Task density" />
      <Spacing vertical={5} />
      <Title>See more before a scroll</Title>
      <Description>
        We’ve refactored your list pages so you can see more of your tasks
        before you need to scroll.
      </Description>
    </>
  );
};

export default TaskDensityStep;
