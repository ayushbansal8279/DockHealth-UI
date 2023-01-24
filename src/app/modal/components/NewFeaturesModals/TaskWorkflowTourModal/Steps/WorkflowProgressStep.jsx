import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import WorkflowProgressImage from 'img/tour/task-workflow/workflow-progress';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const WorkflowProgressStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Task Workflow modal', 'Workflow Progress');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image height={295} src={WorkflowProgressImage} alt="Workflow Progress" />
      <Spacing vertical={5} />
      <Title>See Your Progress</Title>
      <Description>
        Select which columns you would like to see or hide by clicking the gear
        in the upper right hand corner and selecting what works best for you.
      </Description>
    </>
  );
};

export default WorkflowProgressStep;
