import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import WorkflowLibraryImage from 'img/tour/task-workflow/workflow-library';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const WorkflowLibraryStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Task Workflow modal', 'Workflow Library');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image height={295} src={WorkflowLibraryImage} alt="Workflow Library" />
      <Spacing vertical={5} />
      <Title>Workflow Library</Title>
      <Description>
        The Workflow Library is the home for all of your Workflow templates.
        Create unlimited Workflows, add your tasks, attachments, and assignments
        and re-use them in any list!
      </Description>
    </>
  );
};

export default WorkflowLibraryStep;
