import React, { useState } from 'react';
import Button from 'components/common/Button/Button';
import {
  ButtonWrapper,
  ModalWrapper,
  TopLabel,
  StepsContainer,
  Step,
  StepContainer,
} from '../styled';
import { CloseIconButton, CloseIcon } from '../../styled';
import {
  WokflowIntroStep,
  WorkflowLibraryStep,
  WorkflowUseStep,
  WorkflowProgressStep,
} from './Steps';

const TOUR_STEPS_COMPONENTS = [
  WokflowIntroStep,
  WorkflowLibraryStep,
  WorkflowUseStep,
  WorkflowProgressStep,
];

const TaskWorkflowTourModal = ({ closeModal }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const CurrentStepComponent = TOUR_STEPS_COMPONENTS[currentStep];

  return (
    <ModalWrapper height={667}>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      {currentStep >= 0 && currentStep < 4 && (
        <TopLabel>New features!</TopLabel>
      )}
      <StepContainer>
        <CurrentStepComponent />
      </StepContainer>
      <div>
        <ButtonWrapper>
          {currentStep === TOUR_STEPS_COMPONENTS.length - 1 ? (
            <Button fullWidth onClick={closeModal}>
              Got it
            </Button>
          ) : (
            <Button
              fullWidth
              onClick={() => setCurrentStep((step) => step + 1)}
            >
              Next
            </Button>
          )}
        </ButtonWrapper>
        <StepsContainer>
          {TOUR_STEPS_COMPONENTS.map((_, index) => (
            <Step
              type="button"
              isActive={index === currentStep}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </StepsContainer>
      </div>
    </ModalWrapper>
  );
};

export default TaskWorkflowTourModal;
