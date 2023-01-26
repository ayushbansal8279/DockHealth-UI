import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import MultiMentionAssignImage from 'img/tour/multi-mention-assign/multi-mention-assign.svg';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const MultiMentionAssignStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Multi Mention Assign modal', 'Multi Mention Assign');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image
        height={295}
        src={MultiMentionAssignImage}
        alt="Multi Mention Assign"
      />
      <Spacing vertical={5} />
      <Title>Automatically assign using @name</Title>
      <Description>
        When you’re creating a task, use the “@” symbol to call one or multiple
        people to automatically assign.
      </Description>
    </>
  );
};

export default MultiMentionAssignStep;
