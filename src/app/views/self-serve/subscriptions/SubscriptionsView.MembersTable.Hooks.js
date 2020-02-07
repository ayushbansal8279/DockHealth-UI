/* eslint-disable react-hooks/rules-of-hooks */
import equals from 'ramda/es/equals';
import find from 'ramda/es/find';
import uniq from 'ramda/es/uniq';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBreakpoint, useSetState } from 'react-use';
import {
  removeUserFromOrganization,
  cancelInviteToOrganization,
} from '../../../actions/people-actions';
import { USER_SUBSCRIPTION_STATUS } from './SubscriptionsView.MembersTable.SubscriptionSwitcher';

const useBreakpoint = createBreakpoint({ sm: 600, md: 960 });

const initializeMembersTableHooks = ({
  getAllUsers,
  setSelectedUsers,
  selectedUsers,
}) => {
  const { isFetching, organizationMembers } = useSelector(store => ({
    isFetching: store.peopleState.isFetching,
    organizationMembers: store.peopleState.peoplelist,
  }));
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState(
    USER_SUBSCRIPTION_STATUS.ALL,
  );
  const currentBreakPoint = useBreakpoint();
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedUsers(
      organizationMembers
        .map(({ userId, email, subscription }) =>
          subscription ? { userId, email } : null,
        )
        .filter(Boolean),
    );
  }, [organizationMembers, setSelectedUsers]);

  const toggleSelectedUser = useCallback(
    toggledUser => event => {
      const { checked } = event.target;

      if (checked) {
        setSelectedUsers(uniq([...selectedUsers, toggledUser]));

        // TODO add user reactivation action here
      } else {
        setSelectedUsers(
          selectedUsers.filter(
            selectedUser => !equals(selectedUser, toggledUser),
          ),
        );

        if (toggledUser.userId) {
          removeUserFromOrganization(toggledUser.userId)(dispatch).then(() => {
            getAllUsers();
          });
        } else {
          cancelInviteToOrganization(toggledUser.email)(dispatch).then(() => {
            getAllUsers();
          });
        }
      }
    },
    [dispatch, getAllUsers, selectedUsers, setSelectedUsers],
  );

  const isUserSelected = useCallback(
    selectedUser => find(equals(selectedUser), selectedUsers),
    [selectedUsers],
  );

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

  return {
    currentBreakPoint,
    organizationMembers,
    userSubscriptionStatus,
    isFetching,
    setUserSubscriptionStatus,
    toggleSelectedUser,
    isUserSelected,
    closeDialog,
    removeDialogState,
    openDialog,
    setRemovedUserData,
  };
};

export default initializeMembersTableHooks;
