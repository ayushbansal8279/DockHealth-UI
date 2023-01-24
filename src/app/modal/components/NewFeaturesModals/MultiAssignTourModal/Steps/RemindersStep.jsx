import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import ReminderImage from 'img/tour/multi-assign/reminders';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const RemindersStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Multi Assign modal', 'Set a reminder');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image height={295} src={ReminderImage} alt="Set a reminder" />
      <Spacing vertical={5} />
      <Title>Set a reminder</Title>
      <Description>
        Along with setting a due date and time, you can now set an additional
        reminder for yourself so you don’t forget what’s important.
      </Description>
    </>
  );
};

export default RemindersStep;
