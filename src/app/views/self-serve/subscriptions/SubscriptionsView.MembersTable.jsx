import Grid from '@material-ui/core/Grid';
import { func } from 'prop-types';
import {
  ascend,
  filter,
  includes,
  isEmpty,
  prop,
  reject,
  sortWith,
} from 'ramda';
import React, { useEffect } from 'react';
import CubesLoader from '../../../components/common/CubesLoader';
import Search from '../../../components/taskView/Search';
import initializeMembersTableHooks from './SubscriptionsView.MembersTable.Hooks';
import InviteButton from './SubscriptionsView.MembersTable.InviteButton';
import RemoveModal from './SubscriptionsView.MembersTable.RemoveModal';
import {
  MembersTableContainer,
  MembersTableSearchContainer,
  MemberTable,
} from './SubscriptionsView.MembersTable.Styled';
import SubscriptionStatusSwitcher, {
  USER_SUBSCRIPTION_STATUS,
} from './SubscriptionsView.MembersTable.SubscriptionSwitcher';
import OrganizationMemberRow, {
  EmptyOrganizationMemberRow,
} from './SubscriptionsView.OrganizationMemberRow';
import Spacing from '../../../components/common/Spacing';

const MINIMAL_INVITATION_PANEL_VISIBILITY_MEMBERS_COUNT = 10;

const renderOrganizationMemberRow = ({
  toggleSelectedUser,
  isUserSelected,
  isSmallScreen,
  showJoined,
  showSubscription,
  openDialog,
  setRemovedUserData,
  chosenSubscriptionPlan,
  subscriptionPlanData,
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
      subscriptionPlanData={subscriptionPlanData}
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
  roleSortWages[person1?.orgUserRole] - roleSortWages[person2?.orgUserRole];
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
  currentSearch,
}) => {
  const sortedOrganizationMembers = combinedMemberSortMethod(
    organizationMembers ?? [],
  );

  let filteredOrganizationMembers;

  switch (userSubscriptionStatus) {
    case USER_SUBSCRIPTION_STATUS.SUBSCRIBED:
      filteredOrganizationMembers = filter(
        ({ userIdentifier, email }) =>
          includes({ userIdentifier, email }, selectedUsers),
        sortedOrganizationMembers,
      );
      break;
    case USER_SUBSCRIPTION_STATUS.UNSUBSCRIBED:
      filteredOrganizationMembers = reject(
        ({ userIdentifier, email }) =>
          includes({ userIdentifier, email }, selectedUsers),
        sortedOrganizationMembers,
      );
      break;
    default:
      filteredOrganizationMembers = organizationMembers;
      break;
  }

  return currentSearch
    ? filteredOrganizationMembers.filter(memberData => {
        const { firstName, lastName, email } = new Proxy(memberData || {}, {
          get(target, path) {
            return target[path]?.toLowerCase() ?? '';
          },
        });

        return [firstName, lastName, email].some(value =>
          value.includes(currentSearch.toLowerCase()),
        );
      })
    : filteredOrganizationMembers;
};

const SubscriptionsViewMembersTable = ({
  selectedUsers,
  setSelectedUsers,
  getAllUsers = () => {},
  showJoined = true,
  showSubscription = true,
  showTableHeader = true,
  chosenSubscriptionPlan,
  userSubscriptionStatus = USER_SUBSCRIPTION_STATUS.ALL,
  setUserSubscriptionStatus = () => {},
  subscriptionPlanData,
  toggleInvitationPanelVisibility,
}) => {
  const {
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
  } = initializeMembersTableHooks({
    setSelectedUsers,
    selectedUsers,
    getAllUsers,
  });

  const isSmallScreen = currentBreakPoint === 'sm';
  const filteredOrganizationMembers = getFilteredOrganizationMembers({
    organizationMembers,
    selectedUsers,
    userSubscriptionStatus,
    currentSearch,
  });

  const filteredOrganizationMembersCount = filteredOrganizationMembers.length;

  useEffect(() => {
    toggleInvitationPanelVisibility(
      filteredOrganizationMembersCount >=
        MINIMAL_INVITATION_PANEL_VISIBILITY_MEMBERS_COUNT,
    );
  }, [filteredOrganizationMembersCount, toggleInvitationPanelVisibility]);

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
              <Grid
                item
                sm={12}
                md={6}
                container
                alignItems="center"
                justify="flex-end"
                wrap="nowrap"
              >
                <MembersTableSearchContainer>
                  <Search
                    fullWidth
                    onChange={event =>
                      setCurrentSearch(event?.target?.value ?? '')
                    }
                    value={currentSearch}
                  />
                </MembersTableSearchContainer>
                <Spacing horizontal={3} />
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
              {isEmpty(filteredOrganizationMembers) ? (
                <EmptyOrganizationMemberRow />
              ) : (
                filteredOrganizationMembers.map(
                  renderOrganizationMemberRow({
                    toggleSelectedUser,
                    isUserSelected,
                    isSmallScreen,
                    showJoined,
                    showSubscription,
                    selectedUsers,
                    openDialog,
                    setRemovedUserData,
                    subscriptionPlanData,
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
