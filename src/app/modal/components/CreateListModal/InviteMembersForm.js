import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { showAlert } from 'helpers/utility-functions';
import * as TaskListActions from 'actions/tasklist-actions';
import Spacing from 'components/common/Spacing';
import messages from 'components/ListForm/messages';
import initializeListFormHooks from 'components/ListForm/hooks';
import Button from 'components/common/Button/Button';
import PeoplePicker from 'components/common/PeoplePicker/PeoplePicker';
import {
  Title,
  ButtonsWrapper,
  FormWrapper,
  Header,
  Description,
} from './styled';

const ADMIN_PICKER = 'ADMIN_PICKER';
const MEMBER_PICKER = 'MEMBER_PICKER';

const onSubmit = ({
  dispatch,
  event,
  closeModal,
  isSavingList,
  setIsSavingList,
  taskListIdentifier = null,
}) => data => {
  const taskList = { ...data, taskListIdentifier };

  event.stopPropagation();
  event.preventDefault();

  if (isSavingList) return;

  setIsSavingList(true);
  dispatch(TaskListActions.saveTaskList(taskList))
    .then(() => {
      setIsSavingList(false);
      closeModal();
    })
    .catch(error => {
      setIsSavingList(false);
      showAlert({
        status: 'error',
        title: 'Error',
        text: error?.message ?? messages.submit.error,
      });
    });
};

const InviteMembersForm = ({ closeModal }) => {
  const [pickerOpened, setPickerOpened] = useState(null);
  const [isSavingList, setIsSavingList] = useState(false);

  const {
    addAdmin,
    addMember,
    allAdminsWithOwner,
    allMembersValue,
    currentUser,
    dispatch,
    handleSubmit,
    people,
    peopleListForAdminPicker,
    peopleListForMemberPicker,
    removeAdmin,
    removeMember,
    taskListIdentifier,
  } = initializeListFormHooks();

  const { orgUserRole } = currentUser;

  return (
    <FormWrapper
      onSubmit={event =>
        handleSubmit(
          onSubmit({
            dispatch,
            taskListIdentifier,
            event,
            closeModal,
            setIsSavingList,
            isSavingList,
          }),
        )(event)
      }
    >
      <Grid container direction="column" justify="space-between">
        <Grid item>
          <Header>
            <Title>Invite people to the list</Title>
            <Description>
              You can keep your list to yourself or invite as many people as
              you’d like to share it with. The people you invite to this list
              will have access to the tasks, people and patients on this list.
            </Description>
          </Header>
          <PeoplePicker
            addPerson={addAdmin}
            availablePeopleList={peopleListForAdminPicker}
            closePicker={() => setPickerOpened(null)}
            currentUserRole={orgUserRole}
            isOpen={pickerOpened === ADMIN_PICKER}
            peopleIdentifiers={allAdminsWithOwner}
            peopleLabel={messages.form.admins.label}
            peopleList={people}
            setOpenedPicker={() => setPickerOpened(ADMIN_PICKER)}
            removePerson={removeAdmin}
            taskListIdentifier={taskListIdentifier}
            tooltipDescritpion={messages.form.admins.tooltip}
          />
          <Spacing vertical={4} />
          <PeoplePicker
            addPerson={addMember}
            availablePeopleList={peopleListForMemberPicker}
            closePicker={() => setPickerOpened(null)}
            currentUserRole={orgUserRole}
            isOpen={pickerOpened === MEMBER_PICKER}
            peopleIdentifiers={allMembersValue}
            peopleLabel={messages.form.members.label}
            peopleList={people}
            setOpenedPicker={() => setPickerOpened(MEMBER_PICKER)}
            removePerson={removeMember}
            taskListIdentifier={taskListIdentifier}
            tooltipDescritpion={messages.form.members.tooltip}
          />
        </Grid>
        <Spacing vertical={4} />
        <Grid>
          <ButtonsWrapper>
            <Button variant="outlined" onClick={closeModal}>
              Skip for now
            </Button>
            <Spacing horizontal={4} />
            <Button type="submit">Invite to list</Button>
          </ButtonsWrapper>
        </Grid>
      </Grid>
    </FormWrapper>
  );
};

export default InviteMembersForm;
