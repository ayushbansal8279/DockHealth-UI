import Grid from '@material-ui/core/Grid';
import { func } from 'prop-types';
import {
  filter,
  includes,
  isEmpty,
  reject,
  ascend,
  prop,
  sortWith,
} from 'ramda';
import React from 'react';
import CubesLoader from '../../../components/common/CubesLoader';
import initializeMembersTableHooks from './SubscriptionsView.MembersTable.Hooks';
import InviteButton from './SubscriptionsView.MembersTable.InviteButton';
import RemoveModal from './SubscriptionsView.MembersTable.RemoveModal';
import {
  MembersTableContainer,
  MemberTable,
} from './SubscriptionsView.MembersTable.Styled';
import SubscriptionStatusSwitcher, {
  USER_SUBSCRIPTION_STATUS,
} from './SubscriptionsView.MembersTable.SubscriptionSwitcher';
import OrganizationMemberRow, {
  EmptyOrganizationMemberRow,
} from './SubscriptionsView.OrganizationMemberRow';

const renderOrganizationMemberRow = ({
  toggleSelectedUser,
  isUserSelected,
  isSmallScreen,
  showJoined,
  showSubscription,
  openDialog,
  setRemovedUserData,
  chosenSubscriptionPlan,
}) => props => {
  const { firstName, lastName, email, userIdentifier } = props;
  const key = `${firstName}${lastName}${userIdentifier}${email}`;

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
      chosenSubscriptionPlan={chosenSubscriptionPlan}
      {...props}
    />
  );
};

const roleSortWages = new Proxy(
  {
    owner: 1,
    admin: 2,
    member: 3,
    none: 4,
  },
  {
    get: (target, path = '') => target[path.toLowerCase()] ?? target.none,
  },
);

const roleSortMethod = (person1, person2) =>
  roleSortWages[(person1?.orgUserRole)] - roleSortWages[(person2?.orgUserRole)];
const lastNameSortMethod = ascend(prop('lastName'));
const firstNameSortMethod = ascend(prop('firstName'));

const combinedMemberSortMethod = sortWith([
  roleSortMethod,
  lastNameSortMethod,
  firstNameSortMethod,
]);

const getFilteredOrganizationMembers = ({
  organizationMembers,
  selectedUsers,
  userSubscriptionStatus,
}) => {
  const sortedOrganizationMembers =
    organizationMembers |> combinedMemberSortMethod;

  switch (userSubscriptionStatus) {
    case USER_SUBSCRIPTION_STATUS.SUBSCRIBED:
      return filter(
        ({ userIdentifier, email }) =>
          includes({ userIdentifier, email }, selectedUsers),
        sortedOrganizationMembers,
      );

    case USER_SUBSCRIPTION_STATUS.UNSUBSCRIBED:
      return reject(
        ({ userIdentifier, email }) =>
          includes({ userIdentifier, email }, selectedUsers),
        sortedOrganizationMembers,
      );
    default:
      return sortedOrganizationMembers;
  }
};

const SubscriptionsViewMembersTable = ({
  selectedUsers,
  setSelectedUsers,
  getAllUsers = () => {},
  showJoined = true,
  showSubscription = true,
  showTableHeader = true,
  chosenSubscriptionPlan,
}) => {
  const {
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
  } = initializeMembersTableHooks({
    setSelectedUsers,
    selectedUsers,
    getAllUsers,
  });

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
            <Grid container justify="space-between" alignItems="center">
              <Grid item sm={12} md={6}>
                <SubscriptionStatusSwitcher
                  isSmallScreen={isSmallScreen}
                  userSubscriptionStatus={userSubscriptionStatus}
                  setUserSubscriptionStatus={setUserSubscriptionStatus}
                />
              </Grid>
              <Grid item sm={12} md={6} container justify="flex-end">
                <InviteButton
                  getAllUsers={getAllUsers}
                  fullWidth={isSmallScreen}
                />
              </Grid>
            </Grid>
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
                    chosenSubscriptionPlan,
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
