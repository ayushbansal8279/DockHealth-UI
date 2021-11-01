import React, { useMemo, useState } from 'react';
import { Grid } from '@material-ui/core';
import moment from 'moment';
import { filter, includes, isEmpty, reject } from 'ramda';
import ListSkeletonLoader from 'components/common/ListSkeletonLoader/ListSkeletonLoader';
import Spacing from 'components/common/Spacing.tsx';
import Search from 'components/task-view/Search/Search';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { UserSubscriptionStatus } from 'helpers/subscription-helper';
import { UserOrganizationRole, UserStatus } from 'helpers/user-helper';
import InviteButton from '../InviteButton/InviteButton';
import SubscriptionStatusSwitcher from '../SubscriptionStatusSwitcher/SubscriptionStatusSwitcher';
import UserTypeOptions from '../UserTypeOptions/UserTypeOptions';
import EmptyOrganizationMemberRow from '../EmptyOrganizationMemberRow/EmptyOrganizationMemberRow';
import initializeMembersTableHooks from './hooks';
import { getUserTypeLabel } from '../helpers';
import {
  StyledUsersTable,
  UsersTableContainer,
  ListLoaderContainer,
  StyledDataGrid,
} from './styled';

const getFilteredOrganizationUsers = ({
  organizationUsers,
  selectedUsers,
  userSubscriptionStatus,
  currentSearch,
}) => {
  let filteredOrganizationUsers;

  switch (userSubscriptionStatus) {
    case UserSubscriptionStatus.SUBSCRIBED:
      filteredOrganizationUsers = filter(
        ({ userIdentifier, email }) =>
          includes({ userIdentifier, email }, selectedUsers),
        organizationUsers,
      );
      break;
    case UserSubscriptionStatus.UNSUBSCRIBED:
      filteredOrganizationUsers = reject(
        ({ userIdentifier, email }) =>
          includes({ userIdentifier, email }, selectedUsers),
        organizationUsers,
      );
      break;
    default:
      filteredOrganizationUsers = organizationUsers;
      break;
  }

  return currentSearch
    ? filteredOrganizationUsers.filter(memberData => {
        const { firstName, lastName, email } = new Proxy(memberData || {}, {
          get(target, path) {
            return target[path]?.toLowerCase() ?? '';
          },
        });

        return [firstName, lastName, email].some(value =>
          value.includes(currentSearch.toLowerCase()),
        );
      })
    : filteredOrganizationUsers;
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

const UsersTable = ({
  showJoined = true,
  showSubscription = true,
  showTableHeader = true,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const {
    selectedUsers,
    currentBreakPoint,
    organizationUsers,
    isFetching,
    toggleSelectedUser,
    isUserSelected,
    currentSearch,
    setCurrentSearch,
    getAllUsers,
  } = initializeMembersTableHooks();
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState(
    UserSubscriptionStatus.ALL,
  );

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
            <UserTypeOptions
              key={key}
              toggleSelectedUser={toggleSelectedUser}
              isUserSelected={isUserSelected}
              showJoined={showJoined}
              showSubscription={showSubscription}
              organizationMembers={organizationUsers}
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
        renderHeader: renderColumnHeader,
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
        renderHeader: renderColumnHeader,
        sortable: false,
        renderCell: ({ row }) => {
          const { orgUserRole, userStatus } = row;

          if (
            orgUserRole !== UserOrganizationRole.GUEST &&
            userStatus !== UserStatus.PENDING &&
            userStatus !== UserStatus.CANCELLED &&
            userStatus !== UserStatus.INACTIVE &&
            showSubscription
          ) {
            return <span>Subscribed</span>;
          }

          return <span>Free</span>;
        },
      },
    ],
    [
      isUserSelected,
      organizationUsers,
      selectedUsers,
      showJoined,
      showSubscription,
      toggleSelectedUser,
    ],
  );

  const isSmallScreen = currentBreakPoint === 'sm';
  const filteredOrganizationUsers = getFilteredOrganizationUsers({
    organizationUsers,
    selectedUsers,
    userSubscriptionStatus,
    currentSearch,
  });

  const filteredOrganizationUsersWithId = useMemo(
    () =>
      filteredOrganizationUsers.map(member => ({
        id: member.userIdentifier,
        ...member,
      })),
    [filteredOrganizationUsers],
  );

  return (
    <UsersTableContainer>
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
              </Grid>
            </Grid>
          )}
          <StyledUsersTable isSmallScreen={isSmallScreen}>
            {isEmpty(filteredOrganizationUsers) ? (
              <EmptyOrganizationMemberRow />
            ) : (
              <StyledDataGrid
                columns={columns}
                rows={filteredOrganizationUsersWithId}
                rowHeight={35}
                headerHeight={45}
                hideFooterSelectedRowCount
                autoHeight
                disableColumnMenu
                disableSelectionOnClick
              />
            )}
          </StyledUsersTable>
        </>
      )}
    </UsersTableContainer>
  );
};

export default UsersTable;
