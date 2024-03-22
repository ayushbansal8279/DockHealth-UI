import equals from 'ramda/src/equals';
import find from 'ramda/src/find';
import uniq from 'ramda/src/uniq';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBreakpoint, useToggle } from 'react-use';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import * as OrganizationApi from 'api/organization-api';
import {
  reactivateUserInOrganization,
  cancelInviteToOrganization,
  removeUserFromOrganization,
} from 'api/organization-api';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

const useBreakpoint = createBreakpoint({ sm: 600, md: 960 });

const useInitializeMembersTableHooks = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentBreakPoint = useBreakpoint();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [currentSearch, setCurrentSearchRaw] = useState('');
  const [isAllUsersSelected, toggleAllUsersSelectedRaw] = useToggle(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const {
    data,
    isLoading: isFetching,
    refetch: getAllUsers,
  } = useQuery({
    queryKey: ['getOrganizationUsers'],
    queryFn: OrganizationApi.findAllUsersForOrganization,
  });

  const changeUserOrganizationRoleMutation = useMutation({
    mutationFn: ({ userIdentifier: id, role }) =>
      OrganizationApi.changeUserOrganizationRole(id, role),
    onSuccess: (_, { userIdentifier: id, role }) => {
      queryClient.setQueryData(['getOrganizationUsers'], (oldData) =>
        oldData
          ? oldData.map((user) =>
              user.identifier === id ? { ...user, orgUserRole: role } : user,
            )
          : oldData,
      );
      dispatch(showGlobalAlert(`User's role changed successfully`));
    },
    onError: () => dispatch(showGlobalErrorAlert()),
  });

  const changeUserRole = changeUserOrganizationRoleMutation.mutate;
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
    changeUserRole,
  };
};

export default useInitializeMembersTableHooks;
