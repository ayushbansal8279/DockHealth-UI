import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import MultiAssignImage from 'img/tour/multi-assign/multi-assign.png';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const MultiAssignStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Multi Assign modal', 'Multi Assign');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image height={295} src={MultiAssignImage} alt="Multi Assign" />
      <Spacing vertical={5} />
      <Title>Assign Multiple People</Title>
      <Description>
        Assign multiple people to one task either in the task drawer or from the
        list view.
      </Description>
    </>
  );
};

export default MultiAssignStep;
