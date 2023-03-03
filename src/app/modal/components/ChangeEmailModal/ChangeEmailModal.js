import React, { useState } from 'react';
import {
  ChangeMobileNumberModalContainer,
  Title,
  StepContainer,
} from './styled';
import { CloseIconButton, CloseIcon } from '../styled';
import ChangeEmailStep from './ChangeEmailStep';
import ConfirmEmailStep from './ConfirmEmailStep';

const ModalStep = {
  CHANGE_EMAIL: 1,
  CONFIRM: 2,
};

const ChangeMobileNumberModal = ({
  closeModal,
  userProfile,
  onUpdateSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(ModalStep.CHANGE_EMAIL);
  const [newEmail, setNewEmail] = useState('');

  const renderCurrentStep = () => {
    switch (currentStep) {
      case ModalStep.CHANGE_EMAIL:
        return (
          <ChangeEmailStep
            userProfile={userProfile}
            closeModal={closeModal}
            goToNextStep={() => setCurrentStep(ModalStep.CONFIRM)}
            setNewPhoneNumber={setNewEmail}
          />
        );

      case ModalStep.CONFIRM:
        return (
          <ConfirmEmailStep
            closeModal={closeModal}
            goToPreviousStep={() => setCurrentStep(ModalStep.CHANGE_EMAIL)}
            newPhoneNumber={newEmail}
            onUpdateSuccess={onUpdateSuccess}
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
      <Title>Change your Email</Title>
      <StepContainer>{renderCurrentStep()}</StepContainer>
    </ChangeMobileNumberModalContainer>
  );
};

export default ChangeMobileNumberModal;
