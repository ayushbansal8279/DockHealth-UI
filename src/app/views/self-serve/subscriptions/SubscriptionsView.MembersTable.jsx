import { Grid } from '@material-ui/core';
import { func } from 'prop-types';
import {
  ascend,
  descend,
  filter,
  identity,
  includes,
  isEmpty,
  reject,
  sortWith,
} from 'ramda';
import React, { useEffect } from 'react';
import Loader from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import Search from 'components/taskView/Search/Search';
import initializeMembersTableHooks from './SubscriptionsView.MembersTable.Hooks';
import InviteButton from './SubscriptionsView.MembersTable.InviteButton';
import SortingColumn, {
  SORTING_PROPERTIES,
  SORTING_PROPERTIES_PREDICATES,
} from './SubscriptionsView.MembersTable.SortingColumn';
import {
  MembersTableContainer,
  MemberTable,
  MemberTableHeader,
  SubscriptionLabelBox,
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
  chosenSubscriptionPlan,
  subscriptionPlanData,
  organizationMembers,
}) => props => {
  const { firstName, lastName, email, userIdentifier, userStatus } = props;
  const key = `${firstName}${lastName}${userIdentifier}${email}`;

  return (
    <OrganizationMemberRow
      key={key}
      toggleSelectedUser={toggleSelectedUser}
      isUserSelected={isUserSelected}
      isSmallScreen={isSmallScreen}
      showJoined={showJoined}
      showSubscription={showSubscription}
      chosenSubscriptionPlan={chosenSubscriptionPlan}
      subscriptionPlanData={subscriptionPlanData}
      organizationMembers={organizationMembers}
      isInvited={userStatus === 'INVITED'}
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
        <Loader />
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
                <Search
                  onChange={event =>
                    setCurrentSearch(event?.target?.value ?? '')
                  }
                  value={currentSearch}
                />
                <Spacing horizontal={3} />
                <InviteButton
                  getAllUsers={getAllUsers}
                  fullWidth={isSmallScreen}
                />
              </Grid>
            </Grid>
          )}
          <MemberTable isSmallScreen={isSmallScreen}>
            <MemberTableHeader container spacing={1}>
              <Grid item xs={1} />
              <Grid item xs={4}>
                <SortingColumn
                  currentSortingOrder={currentSortingOrder}
                  currentSortingProperty={currentSortingProperty}
                  sortingProperty={SORTING_PROPERTIES.NAME}
                  setSortingProperty={setSortingProperty}
                >
                  NAME
                </SortingColumn>
              </Grid>
              <Grid item xs={2}>
                <SortingColumn
                  currentSortingOrder={currentSortingOrder}
                  currentSortingProperty={currentSortingProperty}
                  sortingProperty={SORTING_PROPERTIES.USER_TYPE}
                  setSortingProperty={setSortingProperty}
                >
                  USER TYPE
                </SortingColumn>
              </Grid>
              <Grid item xs={3}>
                {showJoined && (
                  <SortingColumn
                    currentSortingOrder={currentSortingOrder}
                    currentSortingProperty={currentSortingProperty}
                    sortingProperty={SORTING_PROPERTIES.JOINED}
                    setSortingProperty={setSortingProperty}
                  >
                    JOINED
                  </SortingColumn>
                )}
              </Grid>
              <Grid item xs={2}>
                {showSubscription && (
                  <SubscriptionLabelBox>SUBSCRIPTION</SubscriptionLabelBox>
                )}
              </Grid>
            </MemberTableHeader>

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
                  subscriptionPlanData,
                  chosenSubscriptionPlan,
                  organizationMembers,
                }),
              )
            )}
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
