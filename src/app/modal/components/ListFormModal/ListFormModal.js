import React, { useState, useCallback } from 'react';
import { ListFormModalWrapper, StepCounter, Step } from './styled';
import { CloseIconButton, CloseIcon } from '../styled';
import ListDetailsForm from './ListDetailsForm/ListDetailsForm';
import InviteMembersForm from './InviteMembersForm/InviteMembersForm';

const ModalSteps = {
  LIST_DETAILS: 0,
  INVITE_PEOPLE: 1,
};

const ListFormModal = ({ closeModal, onListCreationSuccess, list = null }) => {
  const [editedList, setEditedList] = useState(list);
  const [currentStep, setCurrentStep] = useState(ModalSteps.LIST_DETAILS);

  const isListEditMode = !!list;

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case ModalSteps.LIST_DETAILS:
        return (
          <ListDetailsForm
            list={editedList}
            setList={setEditedList}
            closeModal={closeModal}
            nextStep={() => setCurrentStep(ModalSteps.INVITE_PEOPLE)}
            onListCreationSuccess={onListCreationSuccess}
          />
        );

      case ModalSteps.INVITE_PEOPLE:
        return (
          <InviteMembersForm
            closeModal={closeModal}
            isListEditMode={isListEditMode}
            list={editedList}
            setList={setEditedList}
          />
        );

      default:
        return <></>;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, editedList]);

  return (
    <ListFormModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      {renderStep(currentStep)}
      <StepCounter>
        {Object.values(ModalSteps).map(value => (
          <Step
            key={value}
            isCurrent={currentStep >= value}
            onClick={() => editedList && setCurrentStep(value)}
            isDisabled={!editedList}
          />
        ))}
      </StepCounter>
    </ListFormModalWrapper>
  );
};

export default ListFormModal;
