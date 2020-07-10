import React, { useState } from 'react';
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

const Tour = ({ steps, onClose, darkTheme }) => {
  const [currentStep, setCurrentStep] = useState(0);

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
