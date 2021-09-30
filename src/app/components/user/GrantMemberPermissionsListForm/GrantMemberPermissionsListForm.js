/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import * as OrganizationApi from 'api/organization-api';
import { showAlert } from 'helpers/utility-functions';
import Spacing from 'components/common/Spacing';
import Loader from 'components/common/Loader/Loader';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import {
  addUsersToPermissionList,
  removeUserFromWorkflow,
  updateUserInWorkflowPermissions,
} from 'api/task-template-api';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { isUserGroup } from 'helpers/user-helper';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
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
  const refreshData = useCallback(
    newMembersList => {
      if (typeof onMembersRefresh === 'function') {
        onMembersRefresh(
          newMembersList.map(({ memberPermission, ...user }) => ({
            memberPermission,
            user,
          })),
        );
      }
    },
    [onMembersRefresh],
  );

  useEffect(() => {
    setAllOrganizationMembersFetched(false);
    OrganizationApi.getOrganizationUsersAndUserGroups().then(
      organizationMembers => {
        setAllOrganizationMembers(organizationMembers);
        setAllOrganizationMembersFetched(true);
      },
    );
  }, []);

  const userProfile = useSelector(state => state.userState.userProfile);

  const organizationMembersNotInTheList = useMemo(
    () =>
      allOrganizationMembers.filter(
        organizationMember =>
          !listMembers.some(
            ({ identifier, userIdentifier }) =>
              organizationMember.identifier === identifier ||
              organizationMember.identifier === userIdentifier,
          ),
      ),
    [allOrganizationMembers, listMembers],
  );

  const handleInviteMembers = newMembers => {
    if (newMembers.length > 0) {
      setIsSavingList(true);
      const memberIdentifiers = newMembers.map(({ identifier }) => identifier);
      const newMembersList = [...listMembers, ...newMembers];
      setListMembers(newMembersList);
      addUsersToPermissionList(taskTemplateIdentifier, memberIdentifiers)
        .then(() => {
          refreshData(newMembersList);
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
    const newList = listMembers.filter(m => m.identifier !== member.identifier);
    setListMembers([...newList]);

    removeUserFromWorkflow(taskTemplateIdentifier, member.identifier)
      .then(() => {
        refreshData([...newList]);
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
      m.identifier === member.identifier ? { ...member, memberPermission } : m,
    );

    setListMembers([...newList]);
    refreshData([...newList]);

    updateUserInWorkflowPermissions(
      taskTemplateIdentifier,
      member.identifier,
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

  const membersWithEditorAccess = useMemo(
    () => listMembers.filter(member => member.memberPermission === 'EDITOR'),
    [listMembers],
  );

  const isOnlyOneMemberWithEditorAccess = membersWithEditorAccess.length < 2;

  const disabledOptionsTitle =
    'Grant Editor access to another user before this operation';

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
                template.creator.userIdentifier === member.identifier;
              const editorAccessOptionName = hasEditorAccess
                ? 'Disable Editor Access'
                : 'Enable Editor Access';
              const optionsDisabled =
                isOnlyOneMemberWithEditorAccess && hasEditorAccess;
              return (
                <MemberListItem key={member.identifier}>
                  <MemberAvatarWrapper>
                    {isUserGroup(member) ? (
                      <GroupAvatar group={member} size={38} />
                    ) : (
                      <UserAvatar user={member} size={38} />
                    )}
                  </MemberAvatarWrapper>
                  <MemberFullNameWrapper>
                    <MemberFullName>
                      {member.name}{' '}
                      {member.identifier === userProfile?.userIdentifier && (
                        <span>&nbsp;(me)</span>
                      )}
                    </MemberFullName>
                  </MemberFullNameWrapper>
                  {isCreator && (
                    <MemberCreatorLabel>Creator</MemberCreatorLabel>
                  )}
                  {member.itemType === 'GROUP' && (
                    <MemberCreatorLabel>Group</MemberCreatorLabel>
                  )}
                  {hasEditorAccess ? 'Editor' : 'View Only'}
                  <OptionsMenu
                    placement="left-start"
                    options={[
                      {
                        name: editorAccessOptionName,
                        onClick: () => switchUserAccess(member),
                        disabled: optionsDisabled,
                        tooltipText: optionsDisabled
                          ? disabledOptionsTitle
                          : null,
                      },
                      {
                        name: 'Remove from Workflow',
                        onClick: () => removeUserFromList(member),
                        disabled: optionsDisabled,
                        tooltipText: optionsDisabled
                          ? disabledOptionsTitle
                          : null,
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
