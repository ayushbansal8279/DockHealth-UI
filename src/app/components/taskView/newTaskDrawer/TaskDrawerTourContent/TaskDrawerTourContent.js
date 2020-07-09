import React from 'react';
import Spacing from 'components/common/Spacing';
import { TASK_DRAWER_TOUR_STEPS } from './task-drawer-tour-steps';
import {
  TourContent,
  Title,
  Description,
  NavigationContainer,
  TourButton,
  DotNavigationButton,
  NavigationDotsContainer,
  Dot,
  CloseIconButton,
  CloseIcon,
} from './styled';

const TaskDrawerTourContent = ({ setStep, stepIndex, onClose }) => {
  return (
    <TourContent>
      <Title>{TASK_DRAWER_TOUR_STEPS[stepIndex].title}</Title>
      <Description>{TASK_DRAWER_TOUR_STEPS[stepIndex].description}</Description>
      {TASK_DRAWER_TOUR_STEPS[stepIndex].description2 && (
        <>
          <Spacing vertical={4} />
          <Description>
            {TASK_DRAWER_TOUR_STEPS[stepIndex].description2}
          </Description>
        </>
      )}
      <NavigationContainer>
        <NavigationDotsContainer>
          {TASK_DRAWER_TOUR_STEPS.map(({ key }, index) => (
            <DotNavigationButton key={key} onClick={() => setStep(index)}>
              <Dot isNext={index > stepIndex} />
            </DotNavigationButton>
          ))}
        </NavigationDotsContainer>
        {stepIndex < TASK_DRAWER_TOUR_STEPS.length - 1 ? (
          <TourButton onClick={() => setStep(stepIndex + 1)}>Next</TourButton>
        ) : (
          <TourButton onClick={onClose}>Got it</TourButton>
        )}
      </NavigationContainer>
      <CloseIconButton onClick={onClose} size="small">
        <CloseIcon />
      </CloseIconButton>
    </TourContent>
  );
};

export default TaskDrawerTourContent;
