import React, { useState, useMemo, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import PersonIcon from 'img/modals/person';
import PeopleIcon from 'img/modals/people';
import * as TaskListApi from 'api/tasklist-api';
import * as PeopleApi from 'api/people-api';
import { showAlert } from 'helpers/utility-functions';
import * as TaskListActions from 'actions/tasklist-actions';
import { findAllUsersByOrganizationId } from 'actions/people-actions';
import Spacing from 'components/common/Spacing';
import messages from 'components/ListForm/messages';
import Member from 'components/members/Member';
import Loader from 'components/common/Loader/Loader';
import initializeListFormHooks from 'components/ListForm/hooks';
// import PeoplePicker from 'components/common/PeoplePicker/PeoplePicker';
import { Title, FormWrapper, Header, Description } from '../styled';
import ListMembersSelect from '../ListMembersSelect/ListMembersSelect';
import {
  InviteInitialViewWrapper,
  InviteInitialViewContent,
  NavigationActionButton,
  NavigationIcon,
  NavigationText,
  SkipButton,
  LoaderWrapper,
  MembersListWrapper,
  MemberListItem,
  MemberFullName,
  MemberFullNameWrapper,
} from './styled';

// const ADMIN_PICKER = 'ADMIN_PICKER';
// const MEMBER_PICKER = 'MEMBER_PICKER';

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

const InviteMembersForm = ({
  closeModal,
  isListEditMode,
  taskListIdentifier,
}) => {
  const dispatch = useDispatch();
  const [newListView, setNewListView] = useState(!isListEditMode);
  const [isSavingList, setIsSavingList] = useState(false);
  const [listMembers, setListMembers] = useState([]);
  const [listMembersFetched, setListMembersFetched] = useState(false);

  const [allOrganizationMembers, setAllOrganizationMembers] = useState([]);
  const [
    allOrganizationMembersFetched,
    setAllOrganizationMembersFetched,
  ] = useState(false);

  useEffect(() => {
    if (!newListView) {
      setAllOrganizationMembersFetched(false);
      PeopleApi.findAllUsersByOrganizationId().then(organizationMembers => {
        setAllOrganizationMembers(organizationMembers);
        setAllOrganizationMembersFetched(true);
      });
    }
  }, [newListView]);

  useEffect(() => {
    if (!newListView && taskListIdentifier) {
      setListMembersFetched(false);
      TaskListApi.getMembersByTaskListId(taskListIdentifier, 'ALL').then(
        members => {
          setListMembers(members);
          setListMembersFetched(true);
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newListView, taskListIdentifier]);

  const userProfile = useSelector(state => state.userState.userProfile);

  const organizationMembersNotInTheList = useMemo(
    () =>
      allOrganizationMembers.filter(
        organizationMember =>
          !listMembers.some(
            ({ userIdentifier }) =>
              organizationMember.userIdentifier === userIdentifier,
          ),
      ),
    [allOrganizationMembers, listMembers],
  );

  // const {
  //   addAdmin,
  //   addMember,
  //   allAdminsWithOwner,
  //   allMembersValue,
  //   currentUser,
  //   dispatch,
  //   handleSubmit,
  //   people,
  //   peopleListForAdminPicker,
  //   peopleListForMemberPicker,
  //   removeAdmin,
  //   removeMember,
  //   taskListIdentifier,
  // } = initializeListFormHooks();

  // const { orgUserRole } = currentUser;

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
      onSubmit={
        event => {}
        // handleSubmit(
        //   onSubmit({
        //     dispatch,
        //     taskListIdentifier: list.taskListIdentifier,
        //     event,
        //     closeModal,
        //     setIsSavingList,
        //     isSavingList,
        //   }),
        // )(event)
      }
    >
      <Grid container direction="column" justify="space-between">
        <Grid container item>
          <Header>
            <Title>Invite Others to this list</Title>
            <Description>
              Invite as many people as you’d like to share it with. The people
              you invite to this list will have access to the tasks, people and
              patients who are part of this list.
            </Description>
          </Header>
          {allOrganizationMembersFetched && listMembersFetched ? (
            <>
              <ListMembersSelect
                currentUser={userProfile}
                availablePeople={organizationMembersNotInTheList}
              />
              <Spacing vertical={4} />
              <MembersListWrapper>
                {listMembers.map(member => (
                  <MemberListItem>
                    <Member
                      key={member.userIdentifier}
                      size={38}
                      member={member}
                    />
                    <MemberFullNameWrapper>
                      <MemberFullName>{member.userName}</MemberFullName>
                    </MemberFullNameWrapper>
                  </MemberListItem>
                ))}
              </MembersListWrapper>
            </>
          ) : (
            <LoaderWrapper>
              <Loader />
            </LoaderWrapper>
          )}
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
