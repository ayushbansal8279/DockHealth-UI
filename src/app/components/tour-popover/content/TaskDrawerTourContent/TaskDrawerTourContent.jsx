import React from 'react';
import Spacing from 'components/common/Spacing';
import {
  TourContent,
  Title,
  Description,
  NavigationContainer,
  TourButton,
  DotNavigationButton,
  NavigationDotsContainer,
  Dot,
} from 'components/tour-popover/content/styled';

const TaskDrawerTourContent = ({
  steps,
  setStep,
  currentStepIndex,
  onClose,
}) => {
  const { title, description, additionalDescription } = steps[currentStepIndex];

  return (
    <TourContent>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {additionalDescription && (
        <>
          <Spacing vertical={4} />
          <Description>{additionalDescription}</Description>
        </>
      )}
      <NavigationContainer>
        <NavigationDotsContainer>
          {steps.map(({ index }) => (
            <DotNavigationButton key={index} onClick={() => setStep(index)}>
              <Dot isNext={index > currentStepIndex} />
            </DotNavigationButton>
          ))}
        </NavigationDotsContainer>
        {currentStepIndex < steps.length - 1 ? (
          <TourButton onClick={() => setStep(currentStepIndex + 1)}>
            Next
          </TourButton>
        ) : (
          <TourButton onClick={onClose}>Got it</TourButton>
        )}
      </NavigationContainer>
    </TourContent>
  );
};

export default TaskDrawerTourContent;
