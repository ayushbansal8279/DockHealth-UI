/* eslint-disable react-hooks/rules-of-hooks */
import { equals, find, uniq } from 'ramda';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBreakpoint, useSetState, useToggle } from 'react-use';
import {
  addUserToOrganization,
  cancelInviteToOrganization,
  removeUserFromOrganization,
} from 'actions/people-actions';

const useBreakpoint = createBreakpoint({ sm: 600, md: 960 });

const initializeMembersTableHooks = ({
  getAllUsers,
  setSelectedUsers,
  selectedUsers,
}) => {
  const { isFetching, organizationMembers } = useSelector(store => ({
    isFetching: store.peopleState.isFetching,
    organizationMembers: store.peopleState.peoplelist ?? [],
  }));
  const currentBreakPoint = useBreakpoint();
  const dispatch = useDispatch();

  const [currentSearch, setCurrentSearchRaw] = useState('');
  const [isAllUsersSelected, toggleAllUsersSelectedRaw] = useToggle(false);

  const [currentSortingProperty, setCurrentSortingProperty] = useState('');

  const [currentSortingOrder, setCurrentSortingOrder] = useState('asc');

  const toggleAllUsersSelected = useCallback(
    event => {
      const newAllUsersSelected = event.target.checked;

      if (newAllUsersSelected) {
        setSelectedUsers(
          organizationMembers.map(({ userIdentifier, email }) => ({
            userIdentifier,
            email,
          })),
        );
      } else {
        setSelectedUsers([]);
      }

      toggleAllUsersSelectedRaw(newAllUsersSelected);
    },
    [organizationMembers, setSelectedUsers, toggleAllUsersSelectedRaw],
  );

  const setCurrentSearch = useCallback(
    search => {
      setCurrentSearchRaw(search);
      toggleAllUsersSelectedRaw(false);
    },
    [toggleAllUsersSelectedRaw],
  );

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
        addUserToOrganization(toggledUser.userIdentifier)(dispatch).then(() => {
          getAllUsers();
        });
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

  const setSortingProperty = useCallback(
    sortingProperty => {
      if (currentSortingProperty === sortingProperty) {
        setCurrentSortingOrder(currentSortingOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setCurrentSortingOrder('asc');
      }

      setCurrentSortingProperty(sortingProperty);
    },
    [currentSortingOrder, currentSortingProperty],
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
    currentSearch,
    setCurrentSearch,
    isAllUsersSelected,
    toggleAllUsersSelected,
    currentSortingProperty,
    currentSortingOrder,
    setCurrentSortingProperty,
    setCurrentSortingOrder,
    setSortingProperty,
  };
};

export default initializeMembersTableHooks;
