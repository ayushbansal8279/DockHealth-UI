import equals from 'ramda/src/equals';
import find from 'ramda/src/find';
import uniq from 'ramda/src/uniq';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBreakpoint, useToggle } from 'react-use';
import { showGlobalAlert } from 'alert/actions';
import * as OrganizationApi from 'api/organization-api';
import {
  reactivateUserInOrganization,
  cancelInviteToOrganization,
  removeUserFromOrganization,
} from 'api/organization-api';
import { useQuery } from '@tanstack/react-query';

const useBreakpoint = createBreakpoint({ sm: 600, md: 960 });

const useInitializeMembersTableHooks = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentBreakPoint = useBreakpoint();
  const dispatch = useDispatch();

  const [currentSearch, setCurrentSearchRaw] = useState('');
  const [isAllUsersSelected, toggleAllUsersSelectedRaw] = useToggle(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const {
    data,
    isLoading: isFetching,
    refetch: getAllUsers,
  } = useQuery(
    ['getOrganizationUsers'],
    OrganizationApi.findAllUsersForOrganization,
  );
  const organizationUsers = useMemo(() => data || [], [data]);

  const toggleAllUsersSelected = useCallback(
    (event) => {
      const newAllUsersSelected = event.target.checked;

      if (newAllUsersSelected) {
        setSelectedUsers(
          organizationUsers.map(({ userIdentifier, email }) => ({
            userIdentifier,
            email,
          })),
        );
      } else {
        setSelectedUsers([]);
      }

      toggleAllUsersSelectedRaw(newAllUsersSelected);
    },
    [organizationUsers, setSelectedUsers, toggleAllUsersSelectedRaw],
  );

  const setCurrentSearch = useCallback(
    (search) => {
      setCurrentSearchRaw(search);
      toggleAllUsersSelectedRaw(false);
    },
    [toggleAllUsersSelectedRaw],
  );

  useEffect(() => {
    setSelectedUsers(
      organizationUsers
        .map(({ userIdentifier, email, subscription }) =>
          subscription ? { userIdentifier, email } : null,
        )
        .filter(Boolean),
    );
  }, [organizationUsers, setSelectedUsers]);

  const toggleSelectedUser = useCallback(
    (toggledUser) => (event) => {
      const { checked } = event.target;

      if (checked) {
        setSelectedUsers(uniq([...selectedUsers, toggledUser]));

        reactivateUserInOrganization(toggledUser.userIdentifier).then(() => {
          getAllUsers();
        });
      } else {
        setSelectedUsers(
          selectedUsers.filter(
            (selectedUser) => !equals(selectedUser, toggledUser),
          ),
        );

        if (toggledUser.userIdentifier) {
          removeUserFromOrganization(toggledUser.userIdentifier).then(() => {
            dispatch(showGlobalAlert(`${toggledUser?.displayName} removed`));
            getAllUsers();
          });
        } else {
          cancelInviteToOrganization(toggledUser.userIdentifier).then(() => {
            getAllUsers();
          });
        }
      }
    },
    [dispatch, getAllUsers, selectedUsers, setSelectedUsers],
  );

  const isUserSelected = useCallback(
    (selectedUser) => find(equals(selectedUser), selectedUsers),
    [selectedUsers],
  );

  return {
    selectedUsers,
    currentBreakPoint,
    organizationUsers,
    isFetching,
    toggleSelectedUser,
    isUserSelected,
    currentSearch,
    setCurrentSearch,
    isAllUsersSelected,
    toggleAllUsersSelected,
    getAllUsers,
  };
};

export default useInitializeMembersTableHooks;
