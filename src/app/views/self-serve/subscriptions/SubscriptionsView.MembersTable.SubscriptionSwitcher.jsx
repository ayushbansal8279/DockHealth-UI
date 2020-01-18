import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import React, { useRef } from 'react';
import useBoolean from '../../../hooks/useBoolean';
import ChevronIcon from '../../../img/collapse.svg';
import {
  HeaderCaptionGrid,
  SubscriptionStatusSwitchLabel,
  SwitcherChevronContainer,
  SwitcherChevronImage,
  SwitcherContainer,
} from './SubscriptionsView.MembersTable.Styled';
import { H2 } from './SubscriptionsView.Styled';

export const USER_SUBSCRIPTION_STATUS = {
  ALL: Symbol('ALL'),
  SUBSCRIBED: Symbol('SUBSCRIBED'),
  UNSUBSCRIBED: Symbol('UNSUBSCRIBED'),
};

const USER_SUBSCRIPTION_LABELS = {
  [USER_SUBSCRIPTION_STATUS.ALL]: 'All',
  [USER_SUBSCRIPTION_STATUS.SUBSCRIBED]: 'Subscribed',
  [USER_SUBSCRIPTION_STATUS.UNSUBSCRIBED]: 'Unsubscribed',
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

export default SubscriptionStatusSwitcher;
