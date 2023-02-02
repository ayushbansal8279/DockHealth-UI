import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import TaskStatusEditImage from 'img/tour/task-status/task-status-edit.svg';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const TaskStatusEditStep = () => {
  useEffect(() => {
    onTourModalStepEnter(
      'Custom Task Statuses modal',
      'Custom Task Statuses Edit',
    );
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image
        height={295}
        src={TaskStatusEditImage}
        alt="Custom Task Statuses"
      />
      <Spacing vertical={5} />
      <Title>Edit Task Statuses</Title>
      <Description>
        Add new, edit the existing name or color, change the order or delete a
        status as needed.
      </Description>
    </>
  );
};

export default TaskStatusEditStep;
