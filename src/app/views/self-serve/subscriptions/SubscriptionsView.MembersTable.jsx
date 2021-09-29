import React, { useMemo } from 'react';
import { Grid } from '@material-ui/core';
import moment from 'moment';
import { func } from 'prop-types';
import { filter, includes, isEmpty, reject } from 'ramda';
import ListSkeletonLoader from 'components/common/ListSkeletonLoader/ListSkeletonLoader';
import Spacing from 'components/common/Spacing.tsx';
import Search from 'components/task-view/Search/Search';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Button from 'components/common/Button/Button';
import initializeMembersTableHooks from './SubscriptionsView.MembersTable.Hooks';
import InviteButton from './SubscriptionsView.MembersTable.InviteButton';
import {
  MembersTableContainer,
  MemberTable,
  ListLoaderContainer,
} from './SubscriptionsView.MembersTable.Styled';
import SubscriptionStatusSwitcher, {
  USER_SUBSCRIPTION_STATUS,
} from './SubscriptionsView.MembersTable.SubscriptionSwitcher';
import MemberTypeOptions from './SubscriptionsView.MemberTypeOptions';
import EmptyOrganizationMemberRow from './EmptyOrganizationMemberRow/EmptyOrganizationMemberRow';
import { getUserTypeLabel } from './SubscriptionsView.MembersTable.helpers';
import { StyledDataGrid } from './data-grid-styles';

const getFilteredOrganizationMembers = ({
  organizationMembers,
  selectedUsers,
  userSubscriptionStatus,
  currentSearch,
}) => {
  let filteredOrganizationMembers;

  switch (userSubscriptionStatus) {
    case USER_SUBSCRIPTION_STATUS.SUBSCRIBED:
      filteredOrganizationMembers = filter(
        ({ userIdentifier, email }) =>
          includes({ userIdentifier, email }, selectedUsers),
        organizationMembers,
      );
      break;
    case USER_SUBSCRIPTION_STATUS.UNSUBSCRIBED:
      filteredOrganizationMembers = reject(
        ({ userIdentifier, email }) =>
          includes({ userIdentifier, email }, selectedUsers),
        organizationMembers,
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

const getTrialPlanPricePerUser = ({ planIsTrial, planPricePerUser }) => {
  if (planIsTrial) {
    return '';
  }

  return `${planPricePerUser}/month`;
};

const renderListNames = listNames => {
  if (listNames.length === 0) return '';

  const title = listNames.map(({ fullName }, index) =>
    index + 1 === listNames.length ? fullName : `${fullName}, `,
  );

  return (
    <Tooltip placement="top" title={title}>
      <div>+{listNames?.length}</div>
    </Tooltip>
  );
};

const renderColumnHeader = props => {
  const { colDef } = props;
  const { headerName } = colDef;

  return (
    <>
      <div className="MuiDataGrid-colCellTitle">
        <span>{headerName}</span>
      </div>
    </>
  );
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
  plansViewVisible,
  buyButtonDisabled,
  onClickBuyButton,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const {
    currentBreakPoint,
    organizationMembers,
    isFetching,
    toggleSelectedUser,
    isUserSelected,
    currentSearch,
    setCurrentSearch,
  } = initializeMembersTableHooks({
    setSelectedUsers,
    selectedUsers,
    getAllUsers,
  });

  const { planPricePerUser, planIsTrial } = subscriptionPlanData || {};

  const trialPlanPricePerUser = getTrialPlanPricePerUser({
    planIsTrial,
    planPricePerUser,
  });

  const columns = useMemo(
    () => [
      {
        field: 'userName',
        headerName: 'USER',
        flex: 1,
        renderHeader: renderColumnHeader,
        renderCell: ({ row }) => {
          return (
            <>
              <UserAvatar size={22} user={row} />
              <Spacing horizontal={4} />
              <span className="member-cell">{row?.userName}</span>
            </>
          );
        },
      },
      {
        field: 'email',
        headerName: 'EMAIL',
        renderHeader: renderColumnHeader,
        flex: 1,
      },
      {
        field: 'orgUserRole',
        headerName: 'USER STATUS',
        flex: 0.5,
        renderHeader: renderColumnHeader,
        renderCell: ({ row }) => {
          const {
            firstName,
            lastName,
            email,
            userIdentifier,
            userStatus,
          } = row;
          const key = `${firstName}${lastName}${userIdentifier}${email}`;

          return (
            <MemberTypeOptions
              key={key}
              toggleSelectedUser={toggleSelectedUser}
              isUserSelected={isUserSelected}
              showJoined={showJoined}
              showSubscription={showSubscription}
              chosenSubscriptionPlan={chosenSubscriptionPlan}
              subscriptionPlanData={subscriptionPlanData}
              organizationMembers={organizationMembers}
              isInvited={userStatus === 'INVITED'}
              userIdentifier={userIdentifier}
              selectedUsers={selectedUsers}
              {...row}
            />
          );
        },
        sortComparator: (v1, v2, parameters1, parameters2) => {
          const userStatus1 = parameters1.api.getCellValue(
            parameters1.id,
            'userStatus',
          );
          const orgUserRole1 = parameters1.api.getCellValue(
            parameters1.id,
            'orgUserRole',
          );
          const eulaAcknowledged1 = parameters1.api.getCellValue(
            parameters1.id,
            'eulaAcknowledged',
          );

          const userStatus2 = parameters2.api.getCellValue(
            parameters2.id,
            'userStatus',
          );
          const orgUserRole2 = parameters2.api.getCellValue(
            parameters2.id,
            'orgUserRole',
          );
          const eulaAcknowledged2 = parameters2.api.getCellValue(
            parameters2.id,
            'eulaAcknowledged',
          );

          const { label: label1 } = getUserTypeLabel({
            userStatus: userStatus1,
            orgUserRole: orgUserRole1,
            eulaAcknowledged: eulaAcknowledged1,
          });

          const { label: label2 } = getUserTypeLabel({
            userStatus: userStatus2,
            orgUserRole: orgUserRole2,
            eulaAcknowledged: eulaAcknowledged2,
          });

          if (label1.toLowerCase() > label2.toLowerCase()) return 1;
          if (label1.toLowerCase() < label2.toLowerCase()) return -1;

          return 0;
        },
      },
      {
        field: 'registrationDate',
        headerName: 'JOINED',
        flex: 0.5,
        renderHeader: renderColumnHeader,
        renderCell: ({ row }) => {
          const { registrationDate, userStatus } = row;

          const registrationMoment = moment(registrationDate);
          const formattedRegistrationDate = registrationMoment.isValid()
            ? registrationMoment.format('LL')
            : '';

          // if (userStatus === 'INVITED') return <span>Invitation sent ({formattedRegistrationDate})</span>;

          if (userStatus === 'INVITED')
            return (
              <Tooltip placement="top" title={formattedRegistrationDate}>
                <div>Invitation sent</div>
              </Tooltip>
            );
          if (userStatus === 'PENDING')
            return (
              <Tooltip placement="top" title={formattedRegistrationDate}>
                <div>Approval requested</div>
              </Tooltip>
            );

          return (
            <>
              {showJoined && userStatus !== 'PENDING' && (
                <span>{formattedRegistrationDate}</span>
              )}
            </>
          );
        },
        sortComparator: (v1, v2, parameters1, parameters2) => {
          const registrationDate1 = parameters1.api.getCellValue(
            parameters1.id,
            'registrationDate',
          );
          const registrationDate2 = parameters2.api.getCellValue(
            parameters2.id,
            'registrationDate',
          );

          if (registrationDate1 > registrationDate2) return 1;
          if (registrationDate1 < registrationDate2) return -1;

          return 0;
        },
      },
      {
        field: 'taskLists',
        headerName: 'LISTS (Guests)',
        flex: 0.5,
        sortable: false,
        renderCell: ({ row }) => {
          const { orgUserRole, taskLists } = row;

          const listsNames =
            orgUserRole === 'GUEST' && taskLists?.length > 0
              ? taskLists
                  ?.map(({ listName }) => ({
                    fullName: listName,
                    shortName:
                      listName.length < 15
                        ? null
                        : `${listName.slice(0, 14)}...`,
                  }))
                  // eslint-disable-next-line func-names
                  .sort(function(a, b) {
                    if (a.fullName < b.fullName) {
                      return -1;
                    }
                    if (a.fullName > b.fullName) {
                      return 1;
                    }
                    return 0;
                  })
              : [];

          return renderListNames(listsNames);
        },
      },
      {
        field: 'subscription',
        headerName: 'SUBSCRIPTION',
        flex: 0.5,
        sortable: false,
        renderCell: ({ row }) => {
          const { orgUserRole, userStatus } = row;

          if (
            orgUserRole !== 'GUEST' &&
            userStatus !== 'PENDING' &&
            userStatus !== 'CANCELLED' &&
            userStatus !== 'INACTIVE' &&
            showSubscription
          ) {
            return <span>{trialPlanPricePerUser}</span>;
          }

          return <span />;
        },
      },
    ],
    [
      chosenSubscriptionPlan,
      isUserSelected,
      organizationMembers,
      selectedUsers,
      showJoined,
      showSubscription,
      subscriptionPlanData,
      toggleSelectedUser,
      trialPlanPricePerUser,
    ],
  );

  const isSmallScreen = currentBreakPoint === 'sm';
  const filteredOrganizationMembers = getFilteredOrganizationMembers({
    organizationMembers,
    selectedUsers,
    userSubscriptionStatus,
    currentSearch,
  });

  const filteredOrganizationMembersWithId = useMemo(
    () =>
      filteredOrganizationMembers.map(member => ({
        id: member.userIdentifier,
        ...member,
      })),
    [filteredOrganizationMembers],
  );

  return (
    <MembersTableContainer>
      {isFetching ? (
        <ListLoaderContainer>
          <ListSkeletonLoader header />
        </ListLoaderContainer>
      ) : (
        <>
          {showTableHeader && (
            <Grid container justify="space-between" alignItems="center">
              <Grid item sm={12} md={3}>
                <SubscriptionStatusSwitcher
                  isSmallScreen={isSmallScreen}
                  userSubscriptionStatus={userSubscriptionStatus}
                  setUserSubscriptionStatus={setUserSubscriptionStatus}
                />
              </Grid>
              <Grid
                item
                sm={12}
                md={9}
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
                {plansViewVisible && (
                  <>
                    <Spacing horizontal={5} />
                    <Button
                      width="300px"
                      disabled={buyButtonDisabled}
                      onClick={onClickBuyButton}
                    >
                      Buy this plan
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          )}
          <MemberTable isSmallScreen={isSmallScreen}>
            {isEmpty(filteredOrganizationMembers) ? (
              <EmptyOrganizationMemberRow />
            ) : (
              <StyledDataGrid
                columns={columns}
                rows={filteredOrganizationMembersWithId}
                rowHeight={35}
                headerHeight={45}
                hideFooterSelectedRowCount
                autoHeight
                disableColumnMenu
                disableSelectionOnClick
              />
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
