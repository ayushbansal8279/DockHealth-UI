import React, { useState } from 'react';
import Button from 'components/common/Button/Button';
import {
  ButtonWrapper,
  ModalWrapper,
  TopLabel,
  StepsContainer,
  Step,
} from './styled';
import { CloseIconButton, CloseIcon } from '../styled';
import {
  PresenceIndicatorsStep,
  PeopleMentionsStep,
  PatientsMentionsStep,
  MentionsCards,
} from './Steps';

const TOUR_STEPS_COMPONENTS = [
  PresenceIndicatorsStep,
  PeopleMentionsStep,
  PatientsMentionsStep,
  MentionsCards,
];

const MentionsTourModal = ({ closeModal }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const CurrentStepComponent = TOUR_STEPS_COMPONENTS[currentStep];

  return (
    <ModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      {currentStep === 0 && <TopLabel>New features!</TopLabel>}
      <div>
        <CurrentStepComponent />
      </div>
      <div>
        <ButtonWrapper>
          {currentStep === TOUR_STEPS_COMPONENTS.length - 1 ? (
            <Button fullWidth onClick={closeModal}>
              Got it
            </Button>
          ) : (
            <Button fullWidth onClick={() => setCurrentStep(step => step + 1)}>
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

export default MentionsTourModal;
