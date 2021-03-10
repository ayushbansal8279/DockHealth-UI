import React from 'react';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import Member from 'components/members/Member/Member';
import ActivityAlerts from 'components/activity-alerts/ActivityAlerts';
import AppLogo from 'img/logo/dock-logo';

import {
  HeaderLogo,
  HeaderTitle,
  HeaderTextContainer,
  DashboardHeaderActivityAlertsContainer,
} from './styled';

const DashboardHeader = ({ currentUser }) => (
  <>
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid container item sm={6} md={8} lg={9}>
        <Member
          member={currentUser}
          showTooltip={false}
          showOnlineIndicator={false}
          size={60}
        />
        <Spacing horizontal={4} />
        <HeaderTextContainer>
          <HeaderTitle variant="h1">Hello {currentUser.firstName}</HeaderTitle>
          <Spacing vertical={3} />
        </HeaderTextContainer>
      </Grid>
      <Grid
        container
        item
        sm={6}
        md={4}
        lg={3}
        alignItems="center"
        justify="flex-end"
      >
        <DashboardHeaderActivityAlertsContainer>
          <ActivityAlerts variant="blue" />
        </DashboardHeaderActivityAlertsContainer>
        <HeaderLogo src={AppLogo} />
      </Grid>
    </Grid>
  </>
);

export default DashboardHeader;
