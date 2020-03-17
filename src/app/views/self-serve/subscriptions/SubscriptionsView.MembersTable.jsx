import Grid from '@material-ui/core/Grid';
import { func } from 'prop-types';
import {
  ascend,
  descend,
  filter,
  includes,
  isEmpty,
  reject,
  sortWith,
  identity,
} from 'ramda';
import React, { useEffect } from 'react';
import CubesLoader from '../../../components/common/CubesLoader';
import Spacing from '../../../components/common/Spacing';
import Search from '../../../components/taskView/Search';
import initializeMembersTableHooks from './SubscriptionsView.MembersTable.Hooks';
import InviteButton from './SubscriptionsView.MembersTable.InviteButton';
import RemoveModal from './SubscriptionsView.MembersTable.RemoveModal';
import SortingColumn, {
  SORTING_PROPERTIES,
  SORTING_PROPERTIES_PREDICATES,
} from './SubscriptionsView.MembersTable.SortingColumn';
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

const getFilteredOrganizationMembers = ({
  organizationMembers,
  selectedUsers,
  userSubscriptionStatus,
  currentSearch,
  currentSortingOrder,
  currentSortingProperty,
}) => {
  const sortingMethod = currentSortingOrder === 'asc' ? ascend : descend;
  const sortingPredicate =
    SORTING_PROPERTIES_PREDICATES[currentSortingProperty] ?? identity;

  const sortedOrganizationMembers = sortWith(
    [sortingMethod(sortingPredicate)],
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
      filteredOrganizationMembers = sortedOrganizationMembers;
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
    currentSortingProperty,
    currentSortingOrder,
    setSortingProperty,
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
    currentSortingOrder,
    currentSortingProperty,
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
                  <th>
                    <SortingColumn
                      currentSortingOrder={currentSortingOrder}
                      currentSortingProperty={currentSortingProperty}
                      sortingProperty={SORTING_PROPERTIES.NAME}
                      setSortingProperty={setSortingProperty}
                    >
                      Name
                    </SortingColumn>
                  </th>
                  <th>
                    <SortingColumn
                      currentSortingOrder={currentSortingOrder}
                      currentSortingProperty={currentSortingProperty}
                      sortingProperty={SORTING_PROPERTIES.USER_TYPE}
                      setSortingProperty={setSortingProperty}
                    >
                      User Type
                    </SortingColumn>
                  </th>
                  {showJoined && (
                    <th>
                      <SortingColumn
                        currentSortingOrder={currentSortingOrder}
                        currentSortingProperty={currentSortingProperty}
                        sortingProperty={SORTING_PROPERTIES.JOINED}
                        setSortingProperty={setSortingProperty}
                      >
                        Joined
                      </SortingColumn>
                    </th>
                  )}
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
