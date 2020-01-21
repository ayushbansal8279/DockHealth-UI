import { func } from 'prop-types';
import equals from 'ramda/es/equals';
import filter from 'ramda/es/filter';
import find from 'ramda/es/find';
import includes from 'ramda/es/includes';
import isEmpty from 'ramda/es/isEmpty';
import isNil from 'ramda/es/isNil';
import pick from 'ramda/es/pick';
import propSatisfies from 'ramda/es/propSatisfies';
import reject from 'ramda/es/reject';
import uniq from 'ramda/es/uniq';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBreakpoint, useMount, useSetState } from 'react-use';
import {
  findAllUsersByOrganizationId,
  loading,
} from '../../../actions/people-actions';
import CubesLoader from '../../../components/common/CubesLoader';
import {
  MembersTableContainer,
  MemberTable,
} from './SubscriptionsView.MembersTable.Styled';
import OrganizationMemberRow, {
  EmptyOrganizationMemberRow,
} from './SubscriptionsView.OrganizationMemberRow';
import SubscriptionStatusSwitcher, {
  USER_SUBSCRIPTION_STATUS,
} from './SubscriptionsView.MembersTable.SubscriptionSwitcher';
import RemoveModal from './SubscriptionsView.MembersTable.RemoveModal';

const renderOrganizationMemberRow = ({
  toggleSelectedUser,
  isUserSelected,
  isSmallScreen,
  showJoined,
  showSubscription,
  openDialog,
  setRemovedUserData,
}) => props => {
  const { firstName, lastName, email, userId } = props;
  const key = `${firstName}${lastName}${userId}${email}`;

  return (
    <OrganizationMemberRow
      key={key}
      toggleSelectedUser={toggleSelectedUser}
      isUserSelected={isUserSelected}
      isSmallScreen={isSmallScreen}
      showJoined={showJoined}
      showSubscription={showSubscription}
      openDialog={openDialog}
      setRemovedUserData={setRemovedUserData}
      {...props}
    />
  );
};

const useBreakpoint = createBreakpoint({ sm: 600, md: 960 });

const getFilteredOrganizationMembers = ({
  organizationMembers,
  selectedUsers,
  userSubscriptionStatus,
}) => {
  switch (userSubscriptionStatus) {
    case USER_SUBSCRIPTION_STATUS.SUBSCRIBED:
      return filter(
        ({ userId, email }) => includes({ userId, email }, selectedUsers),
        organizationMembers,
      );

    case USER_SUBSCRIPTION_STATUS.UNSUBSCRIBED:
      return reject(
        ({ userId, email }) => includes({ userId, email }, selectedUsers),
        organizationMembers,
      );
    default:
      return organizationMembers;
  }
};

const SubscriptionsViewMembersTable = ({
  selectedUsers,
  setSelectedUsers,
  showJoined = true,
  showSubscription = true,
  fetchAllUsers = true,
  showTableHeader = true,
}) => {
  const dispatch = useDispatch();
  const { isFetching, organizationMembers } = useSelector(store => ({
    isFetching: store.peopleState.isFetching,
    organizationMembers: store.peopleState.peoplelist,
  }));
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState(
    USER_SUBSCRIPTION_STATUS.ALL,
  );
  const currentBreakPoint = useBreakpoint();
  const [removeDialogState, setRemoveDialogState] = useSetState({
    open: false,
    userId: null,
    email: null,
    orgUserRole: null,
  });

  const openDialog = useCallback(() => {
    setRemoveDialogState({
      open: true,
    });
  }, [setRemoveDialogState]);

  const closeDialog = useCallback(() => {
    setRemoveDialogState({
      open: false,
    });
  }, [setRemoveDialogState]);

  const setRemovedUserData = useCallback(
    ({ userId, email, orgUserRole }) => {
      setRemoveDialogState({
        userId,
        email,
        orgUserRole,
      });
    },
    [setRemoveDialogState],
  );

  useMount(() => {
    if (fetchAllUsers) {
      loading()(dispatch);
      findAllUsersByOrganizationId()(dispatch);
    }
  });

  useEffect(() => {
    const memberUsersProperties = organizationMembers.map(
      pick(['userId', 'email']),
    );

    const existingUsersProperties = reject(
      propSatisfies(isNil, 'userId'),
      memberUsersProperties,
    );

    setSelectedUsers(existingUsersProperties);
  }, [organizationMembers, setSelectedUsers]);

  const toggleSelectedUser = useCallback(
    toggledUser => event => {
      const { checked } = event.target;

      if (checked) {
        setSelectedUsers(uniq([...selectedUsers, toggledUser]));
      } else {
        setSelectedUsers(
          selectedUsers.filter(
            selectedUser => !equals(selectedUser, toggledUser),
          ),
        );
      }
    },
    [selectedUsers, setSelectedUsers],
  );

  const isUserSelected = useCallback(
    selectedUser => find(equals(selectedUser), selectedUsers),
    [selectedUsers],
  );

  const isSmallScreen = currentBreakPoint === 'sm';
  const fileteredOrganizationMembers = getFilteredOrganizationMembers({
    organizationMembers,
    selectedUsers,
    userSubscriptionStatus,
  });

  return (
    <MembersTableContainer>
      {isFetching ? (
        <CubesLoader size={40} />
      ) : (
        <>
          {showTableHeader && (
            <SubscriptionStatusSwitcher
              isSmallScreen={isSmallScreen}
              userSubscriptionStatus={userSubscriptionStatus}
              setUserSubscriptionStatus={setUserSubscriptionStatus}
            />
          )}
          <MemberTable isSmallScreen={isSmallScreen}>
            {!isSmallScreen && (
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th>&nbsp;</th>
                  <th>Name</th>
                  <th>User Type</th>
                  {showJoined && <th>Joined</th>}
                  {showSubscription && <th>Subscription</th>}
                </tr>
              </thead>
            )}
            <tbody>
              {isEmpty(organizationMembers) ? (
                <EmptyOrganizationMemberRow />
              ) : (
                fileteredOrganizationMembers.map(
                  renderOrganizationMemberRow({
                    toggleSelectedUser,
                    isUserSelected,
                    isSmallScreen,
                    showJoined,
                    showSubscription,
                    selectedUsers,
                    openDialog,
                    setRemovedUserData,
                  }),
                )
              )}
            </tbody>
          </MemberTable>
        </>
      )}
      <RemoveModal
        closeDialog={closeDialog}
        toggleSelectedUser={toggleSelectedUser}
        organizationMembers={organizationMembers}
        {...removeDialogState}
      />
    </MembersTableContainer>
  );
};

SubscriptionsViewMembersTable.propTypes = {
  setSelectedUsers: func.isRequired,
};

export default SubscriptionsViewMembersTable;
