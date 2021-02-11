import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showAlert } from 'helpers/utility-functions';
import * as TaskListActions from 'actions/tasklist-actions';
import { Grid } from '@material-ui/core';
import Input from 'components/common/Input/Input';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { Title, ButtonWrapper, Header } from '../styled';
import messages from './messages';
import { StyledForm } from './styled';

const onSubmit = ({
  event,
  dispatch,
  nextStep,
  closeModal,
  setIsSavingList,
  onListCreationSuccess,
  setList,
  taskListIdentifier,
}) => data => {
  event.stopPropagation();
  event.preventDefault();

  setIsSavingList(true);
  dispatch(TaskListActions.saveTaskList({ ...data, taskListIdentifier }))
    .then(updatedList => {
      if (updatedList) {
        setList(updatedList);
        nextStep();

        if (typeof onListCreationSuccess === 'function')
          onListCreationSuccess(updatedList.taskListIdentifier);
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
  const listNameReference = useRef(null);

  const formContext = useForm({
    defaultValues: {
      listName: list?.listName,
      listDescription: list?.listDescription,
    },
    reValidateMode: 'onSubmit',
  });

  const { register, errors, unregister, handleSubmit, watch } = formContext;

  const listNameValue = watch('listName');
  const listDescriptionValue = watch('listDescription');

  useEffect(() => {
    register(
      {
        name: 'listName',
      },
      {
        validate: value => {
          if (![...value]?.filter(char => char !== ' ').length > 0) {
            return 'This field is required';
          }

          return true;
        },
      },
    );

    register({ name: 'listDescription' });

    if (!list) {
      // eslint-disable-next-line no-unused-expressions
      listNameReference?.current?.focus();
    }

    return () => {
      unregister('listName');
      unregister('listDescription');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          }),
        )(event)
      }
    >
      <Grid container direction="column" justify="space-between">
        <Grid item>
          <Header>
            <Title>{list ? 'Edit a list' : 'Create a list'}</Title>
          </Header>
          <Input
            ref={event => {
              register(event);
              listNameReference.current = event;
            }}
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
        <Grid container direction="row" justify="center">
          <ButtonWrapper>
            <Button
              fullWidth
              variant="outlined"
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
              size="small"
              disabled={isSavingList}
            >
              Next
            </Button>
          </ButtonWrapper>
        </Grid>
      </Grid>
    </StyledForm>
  );
};

export default ListDetailsForm;
