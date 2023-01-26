import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import SpeedOptimizationImage from 'img/tour/task-density/new-columns.png';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const NewColumnsStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Task density modal', 'New columns');
  }, []);

  return (
    <>
      <Image height={245} src={SpeedOptimizationImage} alt="New columns" />
      <Spacing vertical={5} />
      <Title>Two New Columns</Title>
      <Description>
        We’ve updated the designation for subtasks and given the icon its own
        column. Press the icon to open the subtasks when they are collapsed.
        We’ve also relocated due date into its own column which you will soon be
        able to sort.
      </Description>
    </>
  );
};

export default NewColumnsStep;
