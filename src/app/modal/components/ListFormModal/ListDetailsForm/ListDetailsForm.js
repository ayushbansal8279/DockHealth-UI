import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showAlert } from 'helpers/utility-functions';
import { onTaskListAdded, onTaskListEdited } from 'helpers/ga-event-helper';
import * as TaskListActions from 'actions/task-list-actions';
import { Grid } from '@material-ui/core';
import FormInput from 'components/common/Input/FormInput';
import Spacing from 'components/common/Spacing.tsx';
import Button from 'components/common/Button/Button';
import { useHistory } from 'react-router-dom';
import { createTaskListPath } from '../../../../routing/helpers/paths';
import { Title, ButtonWrapper, Header } from '../styled';
import messages from './messages';
import { StyledForm } from './styled';

const validateListName = value => {
  if (!value || ![...value]?.filter(char => char !== ' ').length > 0) {
    return 'This field is required';
  }

  return true;
};

const onSubmit = ({
  event,
  dispatch,
  nextStep,
  closeModal,
  setIsSavingList,
  onListCreationSuccess,
  setList,
  taskListIdentifier,
  history,
}) => data => {
  event.stopPropagation();
  event.preventDefault();

  setIsSavingList(true);
  dispatch(TaskListActions.saveTaskList({ ...data, taskListIdentifier }))
    .then(updatedList => {
      history.push(createTaskListPath(updatedList.taskListIdentifier));
      if (updatedList) {
        setList(updatedList);

        const isNewList = !taskListIdentifier;

        if (isNewList) {
          if (typeof onListCreationSuccess === 'function') {
            onListCreationSuccess(updatedList.taskListIdentifier);
          }
          onTaskListAdded();
          nextStep();
        } else {
          onTaskListEdited();
          closeModal();
        }
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

const ListDetailsForm = ({
  closeModal,
  onListCreationSuccess,
  nextStep,
  list,
  setList,
}) => {
  const dispatch = useDispatch();
  const [isSavingList, setIsSavingList] = useState(false);
  const history = useHistory();

  const formMethods = useForm({
    defaultValues: {
      listName: list?.listName,
      listDescription: list?.listDescription,
    },
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit } = formMethods;

  return (
    <StyledForm
      onSubmit={event =>
        handleSubmit(
          onSubmit({
            event,
            dispatch,
            nextStep,
            closeModal,
            setIsSavingList,
            onListCreationSuccess,
            setList,
            taskListIdentifier: list?.taskListIdentifier,
            history,
          }),
        )(event)
      }
    >
      <FormContext {...formMethods}>
        <Grid container direction="column" justify="space-between">
          <Grid item>
            <Header>
              <Title>{list ? 'Edit a list' : 'Create a list'}</Title>
            </Header>
            <FormInput
              autoFocus
              fullWidth
              label={messages.form.listName.label}
              name="listName"
              required
              placeholder="Add your list name here"
              validate={validateListName}
            />
            <Spacing vertical={4} />
            <FormInput
              fullWidth
              label={messages.form.description.label}
              name="listDescription"
              placeholder="Do you want to add a desciption for the list?"
            />
            <Spacing vertical={4} />
          </Grid>
          <Grid container direction="row" justify="center">
            <ButtonWrapper>
              <Button
                fullWidth
                variant="secondary"
                onClick={closeModal}
                size="small"
              >
                Cancel
              </Button>
            </ButtonWrapper>
            <Spacing horizontal={3} />
            <ButtonWrapper>
              <Button
                fullWidth
                type="submit"
                disabled={isSavingList}
                size="small"
              >
                Save
              </Button>
            </ButtonWrapper>
          </Grid>
        </Grid>
      </FormContext>
    </StyledForm>
  );
};

export default ListDetailsForm;
