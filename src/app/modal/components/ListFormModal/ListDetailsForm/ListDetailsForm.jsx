import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { showAlert } from 'helpers/utility-functions';
import { onTaskListAdded, onTaskListEdited } from 'helpers/ga-event-helper';
import * as TaskListActions from 'actions/task-list-actions';
import { userHasShareTaskFeatureSelector } from 'selectors/user-selectors';
import { Grid } from '@mui/material';
import FormInput from 'components/common/Input/FormInput';
import Spacing from 'components/common/Spacing';
import { useHistory } from 'react-router-dom';
import { createTaskListPath } from 'routing/helpers/paths';
import { Title, ButtonWrapper, Header } from '../styled';
import messages from './messages';
import CheckedCircle from 'img/Checks-Radio-Buttons-Checked.svg';
import BlankCircle from 'img/Checks-Radio-Buttons-Blank.svg';
import {
  CheckboxContainer,
  CheckboxDescription,
  StyledForm,
  ConfirmButton,
  CancelButton,
  PrivacyContainer,
  PrivacyTitle,
} from './styled';
import { taskListsSelector } from 'selectors/task-list-selectors';

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
    isSharedList,
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
            if (nextStep && isSharedList) {
              nextStep();
            } else {
              closeModal();
            }
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
  const [isSharedList, setSharedList] = useState(false);
  const [isPrivateList, setPrivateList] = useState(true);
  const [isConfigureAllowed, setConfigureAllowed] = useState(false);
  const history = useHistory();

  const formMethods = useForm({
    defaultValues: {
      listName: list?.listName,
      listDescription: list?.listDescription,
      restrictCustomization: list ? list?.restrictCustomization : true,
      discoveryEnabled: list ? list?.discoveryEnabled : false,
    },
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit, watch, setValue } = formMethods;

  const restrictCustomizationValue = watch('restrictCustomization');
  const discoveryEnabled = watch('discoveryEnabled');

  const shareTaskAvailable = useSelector(userHasShareTaskFeatureSelector);

  const taskLists = useSelector(taskListsSelector);
  const validateExistingListName = (value) => {
    const activeLists = taskLists
      .map((task) => task.listName)
      .filter((name) => name !== value || !list || list.listName !== value);

    if (activeLists.includes(value)) {
      return 'List Name already exists';
    }
    return validateListName(value);
  };

  const toggleSharedList = () => {
    setPrivateList(false);
    setSharedList(true);
  };
  const togglePrivateList = () => {
    setPrivateList(true);
    setSharedList(false);
  };
  const toggleConfigure = () => {
    setConfigureAllowed(!isConfigureAllowed);
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '&.Mui-focused fieldset': {
        borderColor: 'black',
        borderWidth: '1px',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'grey',
    },
  };

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
            isSharedList,
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
              variant="outlined"
              sx={inputStyle}
              autoFocus
              fullWidth
              label={messages.form.listName.label}
              name="listName"
              required
              placeholder="Add your list name here"
              validate={validateExistingListName}
            />
            <Spacing vertical={4} />
            <FormInput
              variant="outlined"
              sx={inputStyle}
              fullWidth
              label={messages.form.description.label}
              name="listDescription"
              placeholder="Do you want to add a desciption for the list?"
            />
            <Spacing vertical={4} />
            <PrivacyContainer>
              <PrivacyTitle>Privacy</PrivacyTitle>
              <CheckboxContainer>
                <img
                  onClick={toggleSharedList}
                  src={isSharedList ? CheckedCircle : BlankCircle}
                />
                <Spacing horizontal={3} />
                <CheckboxDescription>Sharable List</CheckboxDescription>
                <img
                  onClick={togglePrivateList}
                  src={isPrivateList ? CheckedCircle : BlankCircle}
                />
                <Spacing horizontal={3} />
                <CheckboxDescription>Private List</CheckboxDescription>
              </CheckboxContainer>
            </PrivacyContainer>

            <Spacing vertical={5} />

            <PrivacyContainer>
              <PrivacyTitle>Configuration settings</PrivacyTitle>
              <CheckboxContainer>
                <img
                  onClick={() => {
                    toggleConfigure();
                    setValue(
                      'restrictCustomization',
                      !restrictCustomizationValue,
                    );
                  }}
                  src={isConfigureAllowed ? CheckedCircle : BlankCircle}
                />
                <Spacing horizontal={3} />
                <CheckboxDescription>
                  Allow members to configure list
                </CheckboxDescription>
              </CheckboxContainer>
            </PrivacyContainer>
          </Grid>
          <Grid container direction="row" justifyContent="center">
            <ButtonWrapper>
              <CancelButton fullWidth onClick={closeModal} size="small">
                Cancel
              </CancelButton>
            </ButtonWrapper>
            <Spacing horizontal={4} />
            <ButtonWrapper>
              <ConfirmButton fullWidth type="submit" disabled={isSavingList}>
                Save
              </ConfirmButton>
            </ButtonWrapper>
          </Grid>
        </Grid>
      </FormProvider>
    </StyledForm>
  );
};

export default ListDetailsForm;
