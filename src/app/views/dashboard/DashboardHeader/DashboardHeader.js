import React from 'react';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';

const DashboardHeader = ({ currentUser }) => (
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
);

export default DashboardHeader;
