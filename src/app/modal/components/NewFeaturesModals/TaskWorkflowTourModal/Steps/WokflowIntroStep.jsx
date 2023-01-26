import React, { useEffect } from 'react';
import WorkflowIntroImage from 'img/tour/task-workflow/workflow-intro.svg';
import Spacing from 'components/common/Spacing';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const WokflowIntroStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Task Workflow modal', 'Workflows Into');
  }, []);

  return (
    <>
      <Image height={310} src={WorkflowIntroImage} alt="Task Workflows" />
      <Spacing vertical={5} />
      <Title>Workflows are here!</Title>
      <Description>
        Workflows are a great way to build a complex set of tasks and subtasks
        which can be easily deployed in any list in Dock.
      </Description>
    </>
  );
};

export default WokflowIntroStep;
