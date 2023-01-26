import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import UndoOptionImage from 'img/tour/multi-assign/undo-option.svg';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const UndoOptionStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Multi Assign modal', 'Undo Option');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image height={295} src={UndoOptionImage} alt="Oops, undo" />
      <Spacing vertical={5} />
      <Title>Oops, undo</Title>
      <Description>
        Don’t worry, if you make a mistake you can click undo to quickly and
        easily restore the previous state.
      </Description>
    </>
  );
};

export default UndoOptionStep;
