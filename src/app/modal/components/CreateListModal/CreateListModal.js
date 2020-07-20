import React, { useState, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import Input from 'components/common/Input/Input';
import Spacing from 'components/common/Spacing';
import messages from 'components/ListForm/messages';
import initializeListFormHooks from 'components/ListForm/hooks';
import Button from 'components/common/Button/Button';
import {
  CreateListModalWrapper,
  Title,
  StepCounter,
  Step,
  ButtonsWrapper,
  FormWrapper,
  Header,
  Description,
} from './styled';
import { CloseIconButton, CloseIcon } from '../styled';

const ModalSteps = {
  LIST_DETAILS: 0,
  INVITE_PEOPLE: 1,
};

const CreateListModal = ({ closeModal }) => {
  const [currentStep, setCurrentStep] = useState(ModalSteps.LIST_DETAILS);
  const [taskListIdentifier, setTaskListIdentifier] = useState(null);

  const {
    register,
    errors,
    addAdmin,
    addMember,
    allAdminsWithOwner,
    allMembersValue,
    currentUser,
    dispatch,
    formContext,
    formLabelContent,
    handleSubmit,
    listNameValue,
    listDescriptionValue,
    people,
    peopleListForAdminPicker,
    peopleListForMemberPicker,
    removeAdmin,
    removeMember,
  } = initializeListFormHooks();

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case ModalSteps.LIST_DETAILS:
        return (
          <Grid container direction="column" justify="space-between">
            <Grid item>
              <Header>
                <Title>Create a list</Title>
              </Header>
              <Input
                ref={register}
                fullWidth
                label={messages.form.listName.label}
                name="listName"
                required
                showError
                centerizedLabelOnStart
                placeholder="Add your list name here"
                value={listNameValue}
                error={errors?.['listName']?.message}
              />
              <Spacing vertical={4} />
              <Input
                ref={register}
                fullWidth
                label={messages.form.description.label}
                name="listDescription"
                centerizedLabelOnStart
                placeholder="Do you want to add a desciption for the list?"
                value={listDescriptionValue}
                error={errors?.['listDescription']?.message}
              />
            </Grid>
            <Grid>
              <ButtonsWrapper>
                <Button variant="outlined" onClick={closeModal}>
                  Cancel
                </Button>
                <Spacing horizontal={4} />
                <Button type="submit">Next</Button>
              </ButtonsWrapper>
            </Grid>
          </Grid>
        );

      case ModalSteps.INVITE_PEOPLE:
        return (
          <Grid container direction="column" justify="space-between">
            <Grid item>
              <Header>
                <Title>Invite people to the list</Title>
                <Description>
                  You can keep your list to yourself or invite as many people as
                  you’d like to share it with. The people you invite to this
                  list will have access to the tasks, people and patients on
                  this list.
                </Description>
              </Header>
            </Grid>
            <Grid>
              <ButtonsWrapper>
                <Button variant="outlined" onClick={closeModal} type="submit">
                  Skip for now
                </Button>
                <Spacing horizontal={4} />
                <Button type="submit">Invite to list</Button>
              </ButtonsWrapper>
            </Grid>
          </Grid>
        );

      default:
        return <></>;
    }
  }, [
    currentStep,
    closeModal,
    register,
    errors,
    listDescriptionValue,
    listNameValue,
  ]);

  const onSubmit = ({ dispatch, event, taskListIdentifier = null }) => data => {
    const taskList = { ...data, taskListIdentifier };
    debugger;

    if (currentStep === ModalSteps.LIST_DETAILS) {
      event.preventDefault();
      event.stopPropagation();
      setCurrentStep(ModalSteps.INVITE_PEOPLE);
    }

    console.log('taskList', taskList);

    // saveTaskList(taskList)(dispatch)
    //   .then(() => {
    //     dispatch(AlertActions.showGlobalAlert(messages.submit.success));
    //   })
    //   .catch(error => {
    //     showAlert({
    //       status: 'error',
    //       title: 'Error',
    //       text: error?.message ?? messages.submit.error,
    //     });
    //   });
  };

  return (
    <CreateListModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <FormWrapper
        onSubmit={event =>
          handleSubmit(onSubmit({ dispatch, taskListIdentifier, event }))(event)
        }
      >
        {renderStep(currentStep)}
      </FormWrapper>
      <StepCounter>
        {Object.values(ModalSteps).map(value => (
          <Step
            key={value}
            isFilled={currentStep >= value}
            onClick={() => setCurrentStep(value)}
          />
        ))}
      </StepCounter>
    </CreateListModalWrapper>
  );
};

export default CreateListModal;
