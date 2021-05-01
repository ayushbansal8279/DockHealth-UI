import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import WorkflowUseImage from 'img/tour/task-workflow/workflow-use';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const WorkflowUseStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Task Workflow modal', 'Workflow Use');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image height={295} src={WorkflowUseImage} alt="Use a Workflow" />
      <Spacing vertical={5} />
      <Title>Deploy Workflows in a List</Title>
      <Description>
        Easily add a Workflow to a list right from the &quot;add task&quot; bar.
        Once created, you can add patient context and modify as needed.
      </Description>
    </>
  );
};

export default WorkflowUseStep;
