import React, { useState } from 'react';
import { Grid, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { saveTaskList } from 'actions/tasklist-actions';
import Input from 'components/common/Input/Input';
import { useFormContext, FormContext } from 'react-hook-form';
import { showAlert } from 'helpers/utility-functions';
import { RobotoTypography } from 'styles/theme';
import PeoplePicker from 'components/common/PeoplePicker/PeoplePicker';
import {
  CancelButton,
  FormContainer,
  FormLabel,
  FormIconContainer,
  FormDivider,
  StyledButton,
} from './styled';
import initializeListFormHooks from './hooks';
import messages from './messages';

const ADMIN_PICKER = 'ADMIN_PICKER';
const MEMBER_PICKER = 'MEMBER_PICKER';

const InputWithContext = props => {
  const { register, errors } = useFormContext();
  const { name } = props;

  return <Input {...props} ref={register} error={errors?.[name]?.message} />;
};

const onSubmit = ({
  dispatch,
  setListFormOpen,
  taskListIdentifier = null,
}) => data => {
  const taskList = { ...data, taskListIdentifier };

  saveTaskList(taskList)(dispatch)
    .then(() => {
      toggleAlert('Task list saved successfully!', 'success');
      setListFormOpen(false);
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.message ?? 'Failed to save task list, please try again later',
      });
    });
};

const ListForm = ({ setListFormOpen }) => {
  const {
    addAdmin,
    addMember,
    allAdminsWithOwner,
    allMembersValue,
    dispatch,
    formContext,
    formLabelContent,
    handleSubmit,
    listDescriptionValue,
    people,
    peopleListForAdminPicker,
    peopleListForMemberPicker,
    removeAdmin,
    removeMember,
    setValue,
    taskListIdentifier,
  } = initializeListFormHooks();

  const [openedPicker, setOpenedPicker] = useState('');

  return (
    <FormContainer
      onSubmit={handleSubmit(
        onSubmit({ dispatch, setListFormOpen, taskListIdentifier }),
      )}
      autoComplete="off"
      autoCorrect="off"
    >
      {taskListIdentifier && (
        <>
          <Grid container justify="space-between" alignItems="center">
            <FormLabel>
              <RobotoTypography variant="h4">
                {formLabelContent}
              </RobotoTypography>
            </FormLabel>
            <FormIconContainer>
              <IconButton
                color="inherit"
                edge="end"
                onClick={() => setListFormOpen(false)}
              >
                <Close />
              </IconButton>
            </FormIconContainer>
          </Grid>
          <FormDivider />
        </>
      )}
      <FormContext {...formContext}>
        <InputWithContext
          fullWidth
          label={messages.form.listName.label}
          name="listName"
          required
          showError
        />
      </FormContext>

      <Input
        fullWidth
        label={messages.form.description.label}
        name="listDescription"
        onChange={event => setValue('listDescription', event.target.value)}
        placeholder={messages.form.description.placeholder}
        value={listDescriptionValue}
      />
      <PeoplePicker
        addPerson={addAdmin}
        availablePeopleList={peopleListForAdminPicker}
        closePicker={() => setOpenedPicker('')}
        isOpened={openedPicker === ADMIN_PICKER}
        peopleIdentifiers={allAdminsWithOwner}
        peopleLabel={messages.form.admins.label}
        peopleList={people}
        setOpenedPicker={() => setOpenedPicker(ADMIN_PICKER)}
        removePerson={removeAdmin}
      />
      <PeoplePicker
        addPerson={addMember}
        availablePeopleList={peopleListForMemberPicker}
        closePicker={() => setOpenedPicker('')}
        isOpened={openedPicker === MEMBER_PICKER}
        peopleIdentifiers={allMembersValue}
        peopleLabel={messages.form.members.label}
        peopleList={people}
        setOpenedPicker={() => setOpenedPicker(MEMBER_PICKER)}
        removePerson={removeMember}
      />
      <Grid container justify="flex-end" direction="row" wrap="nowrap">
        <CancelButton
          onClick={() => setListFormOpen(false)}
          variant="text"
          type="button"
        >
          {messages.form.cancel}
        </CancelButton>
        <StyledButton variant="contained" type="submit" size="small">
          {messages.form.saveList}
        </StyledButton>
      </Grid>
    </FormContainer>
  );
};

export default ListForm;
