/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import { IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import * as TaskListApi from 'api/task-list-api';
import * as PeopleApi from 'api/people-api';
import { showAlert } from 'helpers/utility-functions';
import Spacing from 'components/common/Spacing';
import Member from 'components/members/Member/Member';
import Loader from 'components/common/Loader/Loader';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import {
  addUsersToPermissionList,
  removeUserFromWorkflow,
  updateUserInWorkflowPermissions,
} from 'api/task-template-api';
import messages from './messages';
import ListMembersSelect from './ListMembersSelect/ListMembersSelect';

import {
  LoaderWrapper,
  MembersListWrapper,
  MemberListItem,
  MemberFullName,
  MemberFullNameWrapper,
  MemberAvatarWrapper,
  Container,
  MemberStatusLabel,
  MemberCreatorLabel,
} from './styled';

const GrantMemberPermissionsListForm = ({ list, onMembersRefresh }) => {
  const [isSavingList, setIsSavingList] = useState(false);
  const [
    allOrganizationMembersFetched,
    setAllOrganizationMembersFetched,
  ] = useState(false);

  const [listMembers, setListMembers] = useState(list.members);
  const [allOrganizationMembers, setAllOrganizationMembers] = useState([]);

  const { taskTemplateIdentifier, template } = list;

  useEffect(() => {
    setAllOrganizationMembersFetched(false);
    PeopleApi.findAllUsersByOrganizationId().then(organizationMembers => {
      setAllOrganizationMembers(organizationMembers);
      setAllOrganizationMembersFetched(true);
    });
  }, []);

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

  const handleInviteMembers = newMembers => {
    if (newMembers.length > 0) {
      setIsSavingList(true);
      const memberIdentifiers = newMembers.map(
        ({ userIdentifier }) => userIdentifier,
      );
      setListMembers([...listMembers, ...newMembers]);
      if (typeof onMembersRefresh === 'function')
        onMembersRefresh([...listMembers, ...newMembers]);
      addUsersToPermissionList(taskTemplateIdentifier, memberIdentifiers)
        .then(() => {
          setIsSavingList(false);
        })
        .catch(error => {
          setListMembers([...listMembers]);
          setIsSavingList(false);
          showAlert({
            status: 'error',
            title: 'Error',
            text: error?.message ?? messages.submit.error,
          });
        });
    }
  };

  const removeUserFromList = member => {
    setIsSavingList(true);
    const newList = listMembers.filter(
      m => m.userIdentifier !== member.userIdentifier,
    );
    setListMembers([...newList]);

    if (typeof onMembersRefresh === 'function') onMembersRefresh([...newList]);

    removeUserFromWorkflow(taskTemplateIdentifier, member.userIdentifier)
      .then(() => {
        setIsSavingList(false);
      })
      .catch(error => {
        setListMembers([...newList, member]);
        setIsSavingList(false);
        showAlert({
          status: 'error',
          title: 'Error',
          text: error?.message ?? messages.submit.error,
        });
      });
  };
  const switchUserAccess = member => {
    setIsSavingList(true);
    const backupedList = [...listMembers];
    const hasEditorAccess = member.memberPermission === 'EDITOR';
    const memberPermission = hasEditorAccess ? 'VIEW' : 'EDITOR';

    const newList = listMembers.flatMap(m =>
      m.userIdentifier === member.userIdentifier
        ? { ...member, memberPermission }
        : m,
    );

    setListMembers([...newList]);

    if (typeof onMembersRefresh === 'function') onMembersRefresh([...newList]);

    updateUserInWorkflowPermissions(
      taskTemplateIdentifier,
      member.userIdentifier,
      memberPermission,
    )
      .then(() => {
        setIsSavingList(false);
      })
      .catch(error => {
        setListMembers([...backupedList]);
        setIsSavingList(false);
        showAlert({
          status: 'error',
          title: 'Error',
          text: error?.message ?? messages.submit.error,
        });
      });
  };

  return (
    <Container>
      {allOrganizationMembersFetched ? (
        <>
          <ListMembersSelect
            disabled={isSavingList}
            availablePeople={organizationMembersNotInTheList}
            isLoadingAvailablePeople={!allOrganizationMembersFetched}
            onAcitonButtonClick={handleInviteMembers}
            disableAddOption
          />
          <Spacing vertical={4} />
          <MembersListWrapper>
            {listMembers.map(member => {
              const hasEditorAccess = member.memberPermission === 'EDITOR';
              const isCreator =
                template.creator.userIdentifier === member.userIdentifier;
              return (
                <MemberListItem key={member.userIdentifier}>
                  <MemberAvatarWrapper>
                    <Member size={38} member={member} />
                  </MemberAvatarWrapper>
                  <MemberFullNameWrapper>
                    <MemberFullName>
                      {member.userName}{' '}
                      {member.userIdentifier ===
                        userProfile?.userIdentifier && <span>&nbsp;(me)</span>}
                    </MemberFullName>
                  </MemberFullNameWrapper>
                  {isCreator && (
                    <MemberCreatorLabel>Creator</MemberCreatorLabel>
                  )}
                  {hasEditorAccess ? 'Editor' : 'View Only'}
                  <OptionsMenu
                    placement="left-start"
                    options={[
                      {
                        name: hasEditorAccess
                          ? 'Disable Editor Access'
                          : 'Enable Editor Access',
                        onClick: () => switchUserAccess(member),
                      },
                      {
                        name: 'Remove from Workflow',
                        onClick: () => removeUserFromList(member),
                      },
                    ]}
                    customButtonComponent={IconButton}
                  >
                    <MoreVert />
                  </OptionsMenu>
                </MemberListItem>
              );
            })}
          </MembersListWrapper>
        </>
      ) : (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      )}
    </Container>
  );
};

export default GrantMemberPermissionsListForm;
