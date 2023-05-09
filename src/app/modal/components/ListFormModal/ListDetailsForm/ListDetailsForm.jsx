import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showAlert } from 'helpers/utility-functions';
import { onTaskListAdded, onTaskListEdited } from 'helpers/ga-event-helper';
import * as TaskListActions from 'actions/task-list-actions';
import { Grid } from '@mui/material';
import FormInput from 'components/common/Input/FormInput';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { useHistory } from 'react-router-dom';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { createTaskListPath } from 'routing/helpers/paths';
import { Title, ButtonWrapper, Header } from '../styled';
import messages from './messages';
import { CheckboxContainer, CheckboxDescription, StyledForm } from './styled';

const validateListName = (value) => {
  if (!value || ![...value]?.filter((char) => char !== ' ').length > 0) {
    return 'This field is required';
  }

  return true;
};

const onSubmit =
  ({
    event,
    dispatch,
    nextStep,
    closeModal,
    setIsSavingList,
    onListCreationSuccess,
    setList,
    taskListIdentifier,
    history,
  }) =>
  (data) => {
    event.stopPropagation();
    event.preventDefault();

    setIsSavingList(true);
    dispatch(TaskListActions.saveTaskList({ ...data, taskListIdentifier }))
      .then((updatedList) => {
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
      .catch((error) => {
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
      restrictCustomization: list ? !!list?.restrictCustomization : true,
    },
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit, watch, setValue } = formMethods;

  const restrictCustomizationValue = watch('restrictCustomization');

  return (
    <StyledForm
      onSubmit={(event) =>
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
      <FormProvider {...formMethods}>
        <Grid container direction="column" justifyContent="space-between">
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
            <CheckboxContainer>
              <Checkbox
                size={16}
                onClick={() =>
                  setValue('restrictCustomization', !restrictCustomizationValue)
                }
                isChecked={restrictCustomizationValue}
              />
              <Spacing horizontal={3} />
              <CheckboxDescription>
                Restrict Customization for Members
              </CheckboxDescription>
            </CheckboxContainer>
            <Spacing vertical={4} />
            <span>
              Note: You will need to reconfigure the columns displayed on the
              list when you change the above option.
            </span>
          </Grid>
          <Grid container direction="row" justifyContent="center">
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
      </FormProvider>
    </StyledForm>
  );
};

export default ListDetailsForm;
