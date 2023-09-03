import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { isUserGuestOrDockLite } from 'helpers/user-helper';
import { ListFormModalWrapper } from './styled';
import { CloseIconButton, CloseIcon } from '../styled';
import ListDetailsForm from './ListDetailsForm/ListDetailsForm';
import InviteMembersForm from './InviteMembersForm/InviteMembersForm';

const ModalSteps = {
  LIST_DETAILS: 0,
  INVITE_PEOPLE: 1,
};

const ListFormModal = ({ closeModal, onListCreationSuccess, list = null }) => {
  const currentUser = useSelector(userProfileSelector);
  const isGuestOrDockLite = isUserGuestOrDockLite(currentUser);
  const [editedList, setEditedList] = useState(list);
  const [currentStep, setCurrentStep] = useState(ModalSteps.LIST_DETAILS);

  const isListEditMode = !!list;

  const renderStep = useCallback(() => {
    switch (currentStep) {
      // eslint-disable-next-line unicorn/switch-case-braces
      case ModalSteps.LIST_DETAILS:
        return (
          <ListDetailsForm
            list={editedList}
            setList={setEditedList}
            closeModal={closeModal}
            nextStep={
              isGuestOrDockLite
                ? undefined
                : () => setCurrentStep(ModalSteps.INVITE_PEOPLE)
            }
            onListCreationSuccess={onListCreationSuccess}
          />
        );

      // eslint-disable-next-line unicorn/switch-case-braces
      case ModalSteps.INVITE_PEOPLE:
        return (
          <InviteMembersForm
            closeModal={closeModal}
            isListEditMode={isListEditMode}
            list={editedList}
          />
        );

      // eslint-disable-next-line unicorn/switch-case-braces
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
    </ListFormModalWrapper>
  );
};

export default ListFormModal;
