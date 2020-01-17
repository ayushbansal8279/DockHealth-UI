import { func } from 'prop-types';
import equals from 'ramda/es/equals';
import find from 'ramda/es/find';
import isEmpty from 'ramda/es/isEmpty';
import uniq from 'ramda/es/uniq';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBreakpoint, useMount } from 'react-use';

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
import { H2, H3 } from './SubscriptionsView.Styled';

const renderOrganizationMemberRow = ({
  toggleSelectedUser,
  isUserSelected,
  isSmallScreen,
  showJoined,
  showSubscription,
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
      {...props}
    />
  );
};

const useBreakpoint = createBreakpoint({ sm: 600, md: 960 });

const SubscriptionsViewMembersTable = ({
  selectedUsers,
  setSelectedUsers,
  showJoined = true,
  showSubscription = true,
  fetchAllUsers = true,
}) => {
  const dispatch = useDispatch();
  const { isFetching, organizationMembers } = useSelector(store => ({
    isFetching: store.peopleState.isFetching,
    organizationMembers: store.peopleState.peoplelist,
  }));

  const currentBreakPoint = useBreakpoint();
  const isSmallScreen = currentBreakPoint === 'sm';

  useMount(() => {
    if (fetchAllUsers) {
      loading()(dispatch);
      findAllUsersByOrganizationId()(dispatch);
    }
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
                organizationMembers.map(
                  renderOrganizationMemberRow({
                    toggleSelectedUser,
                    isUserSelected,
                    isSmallScreen,
                    showJoined,
                    showSubscription,
                  }),
                )
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
