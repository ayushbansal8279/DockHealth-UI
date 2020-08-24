import React, { useState, useMemo, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import PersonIcon from 'img/modals/person';
import PeopleIcon from 'img/modals/people';
import * as TaskListApi from 'api/tasklist-api';
import * as PeopleApi from 'api/people-api';
import { showAlert } from 'helpers/utility-functions';
import * as TaskListActions from 'actions/tasklist-actions';
import Spacing from 'components/common/Spacing';
import messages from 'components/ListForm/messages';
import Member from 'components/members/Member';
import Loader from 'components/common/Loader/Loader';
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

const InviteMembersForm = ({
  closeModal,
  isListEditMode,
  taskList,
  setList,
}) => {
  const dispatch = useDispatch();
  const [newListView, setNewListView] = useState(!isListEditMode);
  const [isSavingList, setIsSavingList] = useState(false);
  const [isUpdatingMembersList, setIsUpdatingMembersList] = useState(false);
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
    if (!newListView && taskList?.taskListIdentifier) {
      if (listMembers.length === 0) {
        setListMembersFetched(false);
      } else {
        setIsUpdatingMembersList(true);
      }

      TaskListApi.getMembersByTaskListId(taskList.taskListIdentifier, 'ALL')
        .then(members => {
          setListMembers(members);
          setListMembersFetched(true);
          setIsUpdatingMembersList(false);
        })
        .catch(() => {
          setIsUpdatingMembersList(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newListView, taskList]);

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

  const handleInviteMembers = members => {
    setIsSavingList(true);
    const newMembersIdentifiers = members.map(
      ({ userIdentifier }) => userIdentifier,
    );
    const requestTaskList = {
      taskListIdentifier: taskList.taskListIdentifier,
      memberIdentifiers: [
        ...taskList.memberIdentifiers,
        ...newMembersIdentifiers,
      ],
      adminIdentifiers: taskList.adminIdentifiers,
    };

    TaskListActions.saveTaskList(requestTaskList)(dispatch)
      .then(updatedList => {
        setList(updatedList);
        setIsSavingList(false);
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
    <FormWrapper>
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
                disabled={isSavingList}
                availablePeople={organizationMembersNotInTheList}
                isLoadingAvailablePeople={!allOrganizationMembersFetched}
                onAcitonButtonClick={handleInviteMembers}
              />
              <Spacing vertical={4} />
              {isUpdatingMembersList && (
                <>
                  <Grid container direction="column" alignItems="center">
                    <Spacing vertical={2} />
                    <Loader />
                    <Spacing vertical={2} />
                  </Grid>
                </>
              )}
              <MembersListWrapper>
                {listMembers.map(member => (
                  <MemberListItem key={member.userIdentifier}>
                    <Member size={38} member={member} />
                    <MemberFullNameWrapper>
                      <MemberFullName>
                        {member.userName}{' '}
                        {member.userIdentifier ===
                          userProfile?.userIdentifier && (
                          <span>&nbsp;(me)</span>
                        )}
                      </MemberFullName>
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
