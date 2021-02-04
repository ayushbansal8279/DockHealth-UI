/* eslint-disable react-hooks/rules-of-hooks */
import { equals, find, uniq } from 'ramda';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBreakpoint, useToggle } from 'react-use';
import { showGlobalAlert } from 'alert/actions';
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
              dispatch(showGlobalAlert(`${toggledUser?.displayName} removed`));
              getAllUsers();
            },
          );
        } else {
          cancelInviteToOrganization(toggledUser.userIdentifier)(dispatch).then(
            () => {
              getAllUsers();
            },
          );
        }
      }
    },
    [dispatch, getAllUsers, selectedUsers, setSelectedUsers],
  );

  const isUserSelected = useCallback(
    selectedUser => find(equals(selectedUser), selectedUsers),
    [selectedUsers],
  );

  return {
    currentBreakPoint,
    organizationMembers,
    isFetching,
    toggleSelectedUser,
    isUserSelected,
    currentSearch,
    setCurrentSearch,
    isAllUsersSelected,
    toggleAllUsersSelected,
  };
};

export default initializeMembersTableHooks;
