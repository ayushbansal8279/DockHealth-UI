import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import RightClickImage from 'img/tour/right-click/right-click.png';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const RightClickStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Right click modal', 'Right click');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image height={295} src={RightClickImage} alt="Right Click" />
      <Spacing vertical={5} />
      <Title>Right Click</Title>
      <Description>
        Place your cursor over a task and right click your mouse to see easy to
        access options.
      </Description>
    </>
  );
};

export default RightClickStep;
