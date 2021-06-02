import { Box, Grid } from '@material-ui/core';
import React from 'react';
import { SubmenuDivider, SubmenuHeader, SubMenuLink } from './styled';

const EducationCenterSubmenu = () => {
  return (
    <Grid container direction="column">
      <Grid container item direction="column">
        <SubmenuHeader>Education Center</SubmenuHeader>
        <SubmenuDivider />
        <Box height="100%" />
      </Grid>
      <SubMenuLink to="/settings/subscriptions">
        Subscription &amp; Users
      </SubMenuLink>
    </Grid>
  );
};

export default EducationCenterSubmenu;
