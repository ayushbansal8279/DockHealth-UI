import React, { useRef } from 'react';
import ListPopover from 'components/common/ListPopover/ListPopover';
import { RotatableChevronWithSpacing } from 'components/common/RotatableChevron/RotatableChevron';
import { useBoolean } from 'hooks/useBoolean';
import palette from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';
import { UserSubscriptionStatus } from 'helpers/subscription-helper';
import { MediumGreyLabelContainer, SwitcherContainer } from './styled';

const USER_SUBSCRIPTION_LABELS = {
  [UserSubscriptionStatus.ALL]: 'All',
  [UserSubscriptionStatus.SUBSCRIBED]: 'Subscribed',
  [UserSubscriptionStatus.UNSUBSCRIBED]: 'Unsubscribed',
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
        items={Object.values(UserSubscriptionStatus).map(status => ({
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
