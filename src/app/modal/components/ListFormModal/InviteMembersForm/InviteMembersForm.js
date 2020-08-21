import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import PersonIcon from 'img/modals/person';
import PeopleIcon from 'img/modals/people';
import { showAlert } from 'helpers/utility-functions';
import * as TaskListActions from 'actions/tasklist-actions';
import Spacing from 'components/common/Spacing';
import messages from 'components/ListForm/messages';
import initializeListFormHooks from 'components/ListForm/hooks';
import PeoplePicker from 'components/common/PeoplePicker/PeoplePicker';
import { Title, FormWrapper, Header, Description } from '../styled';
import {
  InviteInitialViewWrapper,
  InviteInitialViewContent,
  NavigationActionButton,
  NavigationIcon,
  NavigationText,
  SkipButton,
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

const InviteMembersForm = ({ closeModal, isListEditMode }) => {
  const [newListView, setNewListView] = useState(!isListEditMode);
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

  if (newListView) {
    return (
      <InviteInitialViewWrapper>
        <Header>
          <Title>Would you like to Invite people to this list</Title>
        </Header>
        <InviteInitialViewContent>
          <NavigationActionButton onClick={closeModal}>
            <Spacing vertical={5} />
            <NavigationIcon src={PersonIcon} alt="Just for me" />
            <Spacing vertical={5} />
            <NavigationText>This list is just for me</NavigationText>
          </NavigationActionButton>
          <NavigationActionButton onClick={() => setNewListView(false)}>
            <Spacing vertical={5} />
            <NavigationIcon src={PeopleIcon} alt="Invite others" />
            <Spacing vertical={5} />
            <NavigationText>Invite others to this list</NavigationText>
          </NavigationActionButton>
        </InviteInitialViewContent>
      </InviteInitialViewWrapper>
    );
  }

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
            <Title>Invite Others to this list</Title>
            <Description>
              Invite as many people as you’d like to share it with. The people
              you invite to this list will have access to the tasks, people and
              patients who are part of this list.
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
        <SkipButton type="button" onClick={closeModal}>
          Skip
        </SkipButton>
      </Grid>
    </FormWrapper>
  );
};

export default InviteMembersForm;
