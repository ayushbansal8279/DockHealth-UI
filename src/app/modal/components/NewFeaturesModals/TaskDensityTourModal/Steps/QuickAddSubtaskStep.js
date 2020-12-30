import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import QuickAddSubtaskImage from 'img/tour/task-density/quick-add-subtask';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const QuickAddSubtaskStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Task density modal', 'Quick add subtask');
  }, []);

  return (
    <>
      <Image height={285} src={QuickAddSubtaskImage} alt="Quick add subtask" />
      <Spacing vertical={5} />
      <Title>Adding a Subtask is Easier</Title>
      <Description>
        Now you can quickly add multiple subtasks from the within the task
        drawer.
      </Description>
    </>
  );
};

export default QuickAddSubtaskStep;
