import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import RecurringTaskScheduleImage from 'img/tour/task-recurring/recurring-schedule.svg';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const RecurringTaskScheduleStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Recurring Tasks modal', 'Recurring Task Schedule');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image
        height={295}
        src={RecurringTaskScheduleImage}
        alt="Recurring Tasks"
      />
      <Spacing vertical={5} />
      <Title>Set it and Forget it!</Title>
      <Description>
        Recurring tasks can now be created that remind you of routine to-dos
        that repeat for as long as you set them for.
      </Description>
    </>
  );
};

export default RecurringTaskScheduleStep;
