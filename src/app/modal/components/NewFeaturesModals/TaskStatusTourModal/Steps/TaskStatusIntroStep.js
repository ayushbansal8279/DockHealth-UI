import React, { useEffect } from 'react';
import TaskStatusIntroImage from 'img/tour/task-status/task-status-intro';
import Spacing from 'components/common/Spacing';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const TaskStatusIntroStep = () => {
  useEffect(() => {
    onTourModalStepEnter(
      'Custom Task Statuses modal',
      'Custom Task Statuses Into',
    );
  }, []);

  return (
    <>
      <Spacing vertical={5} />
      <Image
        height={310}
        src={TaskStatusIntroImage}
        alt="Custom Task Statuses"
      />
      <Spacing vertical={5} />
      <Title>Customize Task Statuses</Title>
      <Description>
        Now you can customize or create new task statuses that suit your
        workflows.
      </Description>
    </>
  );
};

export default TaskStatusIntroStep;
