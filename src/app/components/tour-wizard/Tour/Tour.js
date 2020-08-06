import React, { useState, useEffect } from 'react';
import {
  onTourModalStepEnter,
  onAutoTourModalStepEnter,
} from 'helpers/ga-event-helper';
import {
  TourContainer,
  StepContent,
  StepImage,
  StepTextWrapper,
  StepTitle,
  StepDescription,
  CloseIconButton,
  CloseIcon,
  NavigationContainer,
  DotNavigationButton,
  NavigationDotsContainer,
  Dot,
  TourButton,
} from './styled';

const Tour = ({ modalName, modalAutoTriggered, steps, onClose, darkTheme }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (modalAutoTriggered) {
      onAutoTourModalStepEnter(modalName, steps[currentStep]?.title);
    } else {
      onTourModalStepEnter(modalName, steps[currentStep]?.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const { icon, title, description } = steps[currentStep];
  return (
    <TourContainer darkTheme={darkTheme}>
      <CloseIconButton onClick={onClose} size="small">
        <CloseIcon />
      </CloseIconButton>
      <StepContent>
        <StepImage src={icon} />
        <StepTextWrapper>
          <StepTitle>{title}</StepTitle>
          <StepDescription>{description}</StepDescription>
        </StepTextWrapper>
      </StepContent>
      <NavigationContainer>
        <NavigationDotsContainer>
          {steps.map(({ key }, index) => (
            <DotNavigationButton
              key={key}
              onClick={() => setCurrentStep(index)}
            >
              <Dot isNext={index > currentStep} />
            </DotNavigationButton>
          ))}
        </NavigationDotsContainer>
        {currentStep < steps.length - 1 ? (
          <TourButton onClick={() => setCurrentStep(currentStep + 1)}>
            Next
          </TourButton>
        ) : (
          <TourButton onClick={onClose}>Got it</TourButton>
        )}
      </NavigationContainer>
    </TourContainer>
  );
};

export default Tour;
