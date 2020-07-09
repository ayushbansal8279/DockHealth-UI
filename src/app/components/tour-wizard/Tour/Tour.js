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
  Dot,
  TourButton,
} from './styled';

const Tour = ({ steps, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const { icon, title, description } = steps[currentStep];
  return (
    <TourContainer>
      <CloseIconButton onClick={onClose} size="small">
        <CloseIcon />
      </CloseIconButton>
      <StepContent>
        <StepImage src={icon} />
        <StepTextWrapper>
          <StepTitle>{title}</StepTitle>
          <StepDescription>{description}</StepDescription>
          <NavigationContainer>
            <div>
              {steps.map((step, index) => (
                <DotNavigationButton onClick={() => setCurrentStep(index)}>
                  <Dot isNext={index > currentStep} />
                </DotNavigationButton>
              ))}
            </div>
            {currentStep < steps.length - 1 ? (
              <TourButton onClick={() => setCurrentStep(currentStep + 1)}>
                Next
              </TourButton>
            ) : (
              <TourButton onClick={onClose}>Got it</TourButton>
            )}
          </NavigationContainer>
        </StepTextWrapper>
      </StepContent>
    </TourContainer>
  );
};

export default Tour;
