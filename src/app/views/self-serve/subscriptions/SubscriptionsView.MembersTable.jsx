import { func } from 'prop-types';
import equals from 'ramda/es/equals';
import find from 'ramda/es/find';
import uniq from 'ramda/es/uniq';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';

import {
  findAllUsersByOrganizationId,
  loading,
} from '../../../actions/people-actions';
import CubesLoader from '../../../components/common/CubesLoader';
import {
  MembersTableContainer,
  MemberTable,
} from './SubscriptionsView.MembersTable.Styled';
import OrganizationMemberRow from './SubscriptionsView.OrganizationMemberRow';
import { H2, H3 } from './SubscriptionsView.Styled';

const renderOrganizationMemberRow = ({
  toggleSelectedUser,
  isUserSelected,
}) => props => {
  const { firstName, lastName, userId } = props;
  const key = `${firstName}${lastName}${userId}`;

  return (
    <OrganizationMemberRow
      key={key}
      toggleSelectedUser={toggleSelectedUser}
      isUserSelected={isUserSelected}
      {...props}
    />
  );
};

const SubscriptionsViewMembersTable = ({ selectedUsers, setSelectedUsers }) => {
  const dispatch = useDispatch();
  const { isFetching, organizationMembers } = useSelector(store => ({
    isFetching: store.peopleState.isFetching,
    organizationMembers: store.peopleState.peoplelist,
  }));

  useMount(() => {
    loading()(dispatch);
    findAllUsersByOrganizationId()(dispatch);
  });

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

  return (
    <MembersTableContainer>
      {isFetching ? (
        <CubesLoader size={40} />
      ) : (
        <>
          <H2>Users</H2>
          <H3>
            There are {organizationMembers?.length ?? 0} users in your
            organization. Invite and confirm the number of users you’d like to
            purchase your subscription for users at anytime
          </H3>
          <MemberTable>
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
                <th>Name</th>
                <th>User Type</th>
                <th>Joined</th>
                <th>Subscription</th>
              </tr>
            </thead>
            <tbody>
              {organizationMembers.map(
                renderOrganizationMemberRow({
                  toggleSelectedUser,
                  isUserSelected,
                }),
              )}
            </tbody>
          </MemberTable>
        </>
      )}
    </MembersTableContainer>
  );
};

SubscriptionsViewMembersTable.propTypes = {
  setSelectedUsers: func.isRequired,
};

export default SubscriptionsViewMembersTable;
