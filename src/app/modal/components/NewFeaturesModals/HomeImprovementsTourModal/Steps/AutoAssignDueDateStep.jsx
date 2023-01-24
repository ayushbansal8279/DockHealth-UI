import React, { useEffect } from 'react';
import AutoAssignDueDateImage from 'img/tour/home-improvements/auto-assign-due-date';
import Spacing from 'components/common/Spacing';
import { onMentionsTourModalEvent } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const AutoAssignDueDateStep = () => {
  useEffect(() => {
    onMentionsTourModalEvent('Home Improvements modal', 'Auto Assign Due Date');
  }, []);

  return (
    <>
      <Image
        height={310}
        src={AutoAssignDueDateImage}
        alt="Auto Assign a Due Date"
      />
      <Spacing vertical={5} />
      <Title>Auto Assign a Due Date from your Home Screen</Title>
      <Description>
        Add a task within a group on your home screen and the due date is
        automatically set for you.
      </Description>
    </>
  );
};

export default AutoAssignDueDateStep;
