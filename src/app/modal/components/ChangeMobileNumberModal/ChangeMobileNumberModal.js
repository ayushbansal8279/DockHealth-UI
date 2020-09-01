import React, { useState } from 'react';
import {
  ChangeMobileNumberModalContainer,
  Title,
  StepContainer,
} from './styled';
import { CloseIconButton, CloseIcon } from '../styled';
import ChangeNumberStep from './ChangeNumberStep';
import ConfirmNumberStep from './ConfirmNumberStep';

const ModalStep = {
  CHANGE_MOBILE_PHONE: 1,
  CONFIRM: 2,
};

const ChangeMobileNumberModal = ({ closeModal }) => {
  const [currentStep, setCurrentStep] = useState(ModalStep.CHANGE_MOBILE_PHONE);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  const renderCurrentStep = () => {
    switch (currentStep) {
      case ModalStep.CHANGE_MOBILE_PHONE:
        return (
          <ChangeNumberStep
            goToNextStep={() => setCurrentStep(ModalStep.CONFIRM)}
            setNewPhoneNumber={setNewPhoneNumber}
          />
        );

      case ModalStep.CONFIRM:
        return (
          <ConfirmNumberStep
            closeModal={closeModal}
            goToPreviousStep={() =>
              setCurrentStep(ModalStep.CHANGE_MOBILE_PHONE)
            }
            newPhoneNumber={newPhoneNumber}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ChangeMobileNumberModalContainer>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>Change your mobile number</Title>
      <StepContainer>{renderCurrentStep()}</StepContainer>
    </ChangeMobileNumberModalContainer>
  );
};

export default ChangeMobileNumberModal;
