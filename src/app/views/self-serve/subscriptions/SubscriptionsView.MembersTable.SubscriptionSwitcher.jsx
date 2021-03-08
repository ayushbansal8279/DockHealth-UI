import React, { useRef } from 'react';
import ListPopover from 'components/common/ListPopover';
import { RotatableChevronWithSpacing } from 'components/common/RotatableChevron/RotatableChevron';
import useBoolean from 'hooks/useBoolean';
import palette from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';
import {
  MediumGreyLabelContainer,
  SwitcherContainer,
} from './SubscriptionsView.MembersTable.Styled';

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
}) => {
  const [isDropdownOpen, openDropdown, closeDropdown] = useBoolean(false);
  const switcherContainerReference = useRef(null);

  return (
    <>
      <SwitcherContainer onClick={openDropdown}>
        <MontserratTypography variant="h3">
          <span>USERS: </span>
          <MediumGreyLabelContainer>
            {USER_SUBSCRIPTION_LABELS[userSubscriptionStatus]?.toUpperCase() ??
              ''}
          </MediumGreyLabelContainer>
        </MontserratTypography>
        <div ref={switcherContainerReference}>
          <RotatableChevronWithSpacing
            rotated={isDropdownOpen}
            color={palette.brightBlue}
          />
        </div>
      </SwitcherContainer>
      <ListPopover
        anchorEl={switcherContainerReference.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={isDropdownOpen}
        onClose={closeDropdown}
        items={Object.values(USER_SUBSCRIPTION_STATUS).map(status => ({
          key: status.toString(),
          button: true,
          onClick: () => {
            setUserSubscriptionStatus(status);
            closeDropdown();
          },
          label: USER_SUBSCRIPTION_LABELS[status],
        }))}
      />
    </>
  );
};

export default SubscriptionStatusSwitcher;
