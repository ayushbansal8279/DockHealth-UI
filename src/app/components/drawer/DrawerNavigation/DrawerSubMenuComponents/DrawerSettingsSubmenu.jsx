import { Box } from '@material-ui/core';
import React from 'react';
import { SubMenuLink } from './styled';

const DrawerSettingsSubmenu = () => {
  return (
    <Box widht={1}>
      <Box m={2} />
      <SubMenuLink to="/settings/billing">Billing</SubMenuLink>
      <SubMenuLink to="/settings/subscriptions">Subscription</SubMenuLink>
    </Box>
  );
};

export default DrawerSettingsSubmenu;
