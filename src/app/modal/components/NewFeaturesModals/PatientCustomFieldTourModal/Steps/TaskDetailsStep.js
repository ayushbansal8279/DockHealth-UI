import React, { useEffect } from 'react';
import TaskDetailsImage from 'img/tour/patient-custom-field/task-details';
import Spacing from 'components/common/Spacing';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const TaskDetailsStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Patient Custom Fields modal', 'Task Details');
  }, []);

  return (
    <>
      <Spacing vertical={5} />
      <Image height={310} src={TaskDetailsImage} alt="Task Details" />
      <Spacing vertical={5} />
      <Title>Task Details</Title>
      <Description>
        Capture more details for a task in this new section in the task drawer.
      </Description>
    </>
  );
};

export default TaskDetailsStep;
