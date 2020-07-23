import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { CreateListModalWrapper, StepCounter, Step } from './styled';
import { CloseIconButton, CloseIcon } from '../styled';
import ListDetailsForm from './ListDetailsForm';
import InviteMembersForm from './InviteMembersForm';

const ModalSteps = {
  LIST_DETAILS: 0,
  INVITE_PEOPLE: 1,
};

const CreateListModal = ({ closeModal, onListCreationSuccess }) => {
  const [currentStep, setCurrentStep] = useState(ModalSteps.LIST_DETAILS);
  const currentList = useSelector(store => store.taskListState.currentList);

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case ModalSteps.LIST_DETAILS:
        return (
          <ListDetailsForm
            closeModal={closeModal}
            nextStep={() => setCurrentStep(ModalSteps.INVITE_PEOPLE)}
            onListCreationSuccess={onListCreationSuccess}
          />
        );

      case ModalSteps.INVITE_PEOPLE:
        return <InviteMembersForm closeModal={closeModal} />;

      default:
        return <></>;
    }
  }, [currentStep, closeModal, onListCreationSuccess]);

  return (
    <CreateListModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      {renderStep(currentStep)}
      <StepCounter>
        {Object.values(ModalSteps).map(value => (
          <Step
            key={value}
            isFilled={currentStep >= value}
            onClick={() => currentList && setCurrentStep(value)}
            isDisabled={!currentList}
          />
        ))}
      </StepCounter>
    </CreateListModalWrapper>
  );
};

export default CreateListModal;
