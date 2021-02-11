import { Box } from '@material-ui/core';
import React from 'react';
import { SubMenuLink } from './styled';

const SettingsSubmenu = () => {
  return (
    <Box widht={1}>
      <Box m={2} />
      <SubMenuLink to="/settings/billing">Billing &amp; Invoices</SubMenuLink>
      <SubMenuLink to="/settings/subscriptions">
        Subscription &amp; Users
      </SubMenuLink>
    </Box>
  );
};

export default SettingsSubmenu;
