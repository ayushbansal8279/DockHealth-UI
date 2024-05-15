import React from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import { OnboardingHeaderContainer } from './styled';

const OnboardingHeader = () => {
  const currentUser = useSelector(userProfileSelector);

  return (
    <OnboardingHeaderContainer>
      <LayoutHeader>
        <UserAvatar
          user={currentUser}
          showOnlineIndicator={false}
          size={55}
          hideTooltip
        />
        <LayoutHeader.Spacer />
        <LayoutHeader.Title title={`Hello ${currentUser.firstName}`} />
      </LayoutHeader>
    </OnboardingHeaderContainer>
  );
};

export default OnboardingHeader;
