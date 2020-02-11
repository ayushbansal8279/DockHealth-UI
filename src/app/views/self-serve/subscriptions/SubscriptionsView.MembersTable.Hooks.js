/* eslint-disable react-hooks/rules-of-hooks */
import equals from 'ramda/es/equals';
import find from 'ramda/es/find';
import uniq from 'ramda/es/uniq';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBreakpoint, useSetState } from 'react-use';
import {
  cancelInviteToOrganization,
  removeUserFromOrganization,
} from '../../../actions/people-actions';

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
  const currentBreakPoint = useBreakpoint();
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedUsers(
      organizationMembers
        .map(({ userIdentifier, email, subscription }) =>
          subscription ? { userIdentifier, email } : null,
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

        if (toggledUser.userIdentifier) {
          removeUserFromOrganization(toggledUser.userIdentifier)(dispatch).then(
            () => {
              getAllUsers();
            },
          );
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
    userIdentifier: null,
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
    ({ userIdentifier, email, orgUserRole }) => {
      setRemoveDialogState({
        userIdentifier,
        email,
        orgUserRole,
      });
    },
    [setRemoveDialogState],
  );

  return {
    currentBreakPoint,
    organizationMembers,
    isFetching,
    toggleSelectedUser,
    isUserSelected,
    closeDialog,
    removeDialogState,
    openDialog,
    setRemovedUserData,
  };
};

export default initializeMembersTableHooks;
