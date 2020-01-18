import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import { func } from 'prop-types';
import equals from 'ramda/es/equals';
import filter from 'ramda/es/filter';
import find from 'ramda/es/find';
import includes from 'ramda/es/includes';
import isEmpty from 'ramda/es/isEmpty';
import isNil from 'ramda/es/isNil';
import pick from 'ramda/es/pick';
import propSatisfies from 'ramda/es/propSatisfies';
import reject from 'ramda/es/reject';
import uniq from 'ramda/es/uniq';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBreakpoint, useMount } from 'react-use';
import {
  findAllUsersByOrganizationId,
  loading,
} from '../../../actions/people-actions';
import CubesLoader from '../../../components/common/CubesLoader';
import useBoolean from '../../../hooks/useBoolean';
import ChevronIcon from '../../../img/collapse.svg';
import {
  HeaderCaptionGrid,
  MembersTableContainer,
  MemberTable,
  SubscriptionStatusSwitchLabel,
  SwitcherChevronContainer,
  SwitcherChevronImage,
  SwitcherContainer,
} from './SubscriptionsView.MembersTable.Styled';
import OrganizationMemberRow, {
  EmptyOrganizationMemberRow,
} from './SubscriptionsView.OrganizationMemberRow';
import { H2 } from './SubscriptionsView.Styled';

const USER_SUBSCRIPTION_STATUS = {
  ALL: Symbol('ALL'),
  SUBSCRIBED: Symbol('SUBSCRIBED'),
  UNSUBSCRIBED: Symbol('UNSUBSCRIBED'),
};

const USER_SUBSCRIPTION_LABELS = {
  [USER_SUBSCRIPTION_STATUS.ALL]: 'All',
  [USER_SUBSCRIPTION_STATUS.SUBSCRIBED]: 'Subscribed',
  [USER_SUBSCRIPTION_STATUS.UNSUBSCRIBED]: 'Unsubscribed',
};

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

const SubscriptionStatusSwitcher = ({
  userSubscriptionStatus,
  setUserSubscriptionStatus,
  isSmallScreen,
}) => {
  const [isDropdownOpen, openDropdown, closeDropdown] = useBoolean(false);
  const switcherContainerReference = useRef(null);

  if (isSmallScreen) {
    return (
      <>
        <SwitcherContainer
          onClick={openDropdown}
          ref={switcherContainerReference}
        >
          <H2>
            Users: <b>{USER_SUBSCRIPTION_LABELS[userSubscriptionStatus]}</b>
          </H2>
          <SwitcherChevronContainer>
            <SwitcherChevronImage
              alt="arrow"
              src={ChevronIcon}
              rotated={isDropdownOpen}
            />
          </SwitcherChevronContainer>
        </SwitcherContainer>
        <Popover
          anchorEl={switcherContainerReference.current}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isDropdownOpen}
          onClose={closeDropdown}
        >
          {Object.values(USER_SUBSCRIPTION_STATUS).map(status => (
            <MenuItem
              key={status.toString()}
              onClick={() => {
                setUserSubscriptionStatus(status);
                closeDropdown();
              }}
            >
              <Grid container justify="flex-end">
                <H2>{USER_SUBSCRIPTION_LABELS[status]}</H2>
              </Grid>
            </MenuItem>
          ))}
        </Popover>
      </>
    );
  }

  return (
    <HeaderCaptionGrid container alignItems="center">
      <H2>Users</H2>
      {Object.values(USER_SUBSCRIPTION_STATUS).map(status => (
        <SubscriptionStatusSwitchLabel
          key={status.toString()}
          selected={userSubscriptionStatus === status}
          onClick={() => setUserSubscriptionStatus(status)}
        >
          {USER_SUBSCRIPTION_LABELS[status]}
        </SubscriptionStatusSwitchLabel>
      ))}
    </HeaderCaptionGrid>
  );
};

const useBreakpoint = createBreakpoint({ sm: 600, md: 960 });

const getFilteredOrganizationMembers = ({
  organizationMembers,
  selectedUsers,
  userSubscriptionStatus,
}) => {
  switch (userSubscriptionStatus) {
    case USER_SUBSCRIPTION_STATUS.SUBSCRIBED:
      return filter(
        ({ userId, email }) => includes({ userId, email }, selectedUsers),
        organizationMembers,
      );

    case USER_SUBSCRIPTION_STATUS.UNSUBSCRIBED:
      return reject(
        ({ userId, email }) => includes({ userId, email }, selectedUsers),
        organizationMembers,
      );
    default:
      return organizationMembers;
  }
};

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
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState(
    USER_SUBSCRIPTION_STATUS.ALL,
  );

  const currentBreakPoint = useBreakpoint();

  useMount(() => {
    if (fetchAllUsers) {
      loading()(dispatch);
      findAllUsersByOrganizationId()(dispatch);
    }
  });

  useEffect(() => {
    const memberUsersProperties = organizationMembers.map(
      pick(['userId', 'email']),
    );

    const existingUsersProperties = reject(
      propSatisfies(isNil, 'userId'),
      memberUsersProperties,
    );

    setSelectedUsers(existingUsersProperties);
  }, [organizationMembers, setSelectedUsers]);

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
          <SubscriptionStatusSwitcher
            isSmallScreen={isSmallScreen}
            userSubscriptionStatus={userSubscriptionStatus}
            setUserSubscriptionStatus={setUserSubscriptionStatus}
          />
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
