import React, { useEffect } from 'react';
import RecurringTaskIntroImage from 'img/tour/task-recurring/recurring-intro';
import Spacing from 'components/common/Spacing';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const RecurringTaskIntroStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Recurring Task modal', 'Recurring Task Into');
  }, []);

  return (
    <>
      <Image height={310} src={RecurringTaskIntroImage} alt="Recurring Tasks" />
      <Spacing vertical={5} />
      <Title>Recurring Tasks are here!</Title>
      <Description>
        Now you can create tasks that repeat as often as you’d like. Remembering
        to do things on a schedule just got easier!
      </Description>
    </>
  );
};

export default RecurringTaskIntroStep;
