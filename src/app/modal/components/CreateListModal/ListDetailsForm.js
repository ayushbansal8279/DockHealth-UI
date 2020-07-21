import React, { useState } from 'react';
import { showAlert } from 'helpers/utility-functions';
import * as TaskListActions from 'actions/tasklist-actions';
import { Grid } from '@material-ui/core';
import Input from 'components/common/Input/Input';
import Spacing from 'components/common/Spacing';
import messages from 'components/ListForm/messages';
import initializeListFormHooks from 'components/ListForm/hooks';
import Button from 'components/common/Button/Button';
import { Title, ButtonsWrapper, FormWrapper, Header } from './styled';

const onSubmit = ({
  event,
  dispatch,
  nextStep,
  closeModal,
  isSavingList,
  setIsSavingList,
}) => data => {
  const taskList = { ...data };
  event.preventDefault();
  event.stopPropagation();

  if (isSavingList) return;

  setIsSavingList(true);
  dispatch(TaskListActions.saveTaskList(taskList))
    .then(updatedList => {
      if (updatedList) {
        nextStep();
        dispatch(TaskListActions.setTaskListAsCurrentList(updatedList));
        setIsSavingList(false);
      }
    })
    .catch(error => {
      setIsSavingList(false);
      showAlert({
        status: 'error',
        title: 'Error',
        text: error?.message ?? messages.submit.error,
      });
      closeModal();
    });
};

const ListDetailsForm = ({ closeModal, nextStep }) => {
  const [isSavingList, setIsSavingList] = useState(false);
  const {
    register,
    errors,
    dispatch,
    handleSubmit,
    listNameValue,
    listDescriptionValue,
    taskListIdentifier,
  } = initializeListFormHooks();

  return (
    <FormWrapper
      onSubmit={event =>
        handleSubmit(
          onSubmit({
            dispatch,
            event,
            nextStep,
            closeModal,
            isSavingList,
            setIsSavingList,
          }),
        )(event)
      }
    >
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
          <Spacing vertical={4} />
        </Grid>
        <Grid>
          <ButtonsWrapper>
            <Button variant="outlined" onClick={closeModal}>
              Cancel
            </Button>
            <Spacing horizontal={4} />
            <Button type="submit">
              {taskListIdentifier ? 'Update' : 'Create'}
            </Button>
          </ButtonsWrapper>
        </Grid>
      </Grid>
    </FormWrapper>
  );
};

export default ListDetailsForm;
