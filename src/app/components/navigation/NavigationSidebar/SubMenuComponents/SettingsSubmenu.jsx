import { Box } from '@material-ui/core';
import React from 'react';
import { SUBS_SETTINGS_PATH, USERS_SETTINGS_PATH } from 'routing/helpers/paths';
import { SubMenuLink } from './styled';

const SettingsSubmenu = () => {
  return (
    <Box widht={1}>
      <Box m={2} />
      <SubMenuLink to="/settings/billing">Billing &amp; Invoices</SubMenuLink>
      <SubMenuLink to={SUBS_SETTINGS_PATH}>Subscriptions</SubMenuLink>
      <SubMenuLink to={USERS_SETTINGS_PATH}>Users</SubMenuLink>
      <SubMenuLink to="/settings/custom-fields">Custom Fields</SubMenuLink>
    </Box>
  );
};

export default SettingsSubmenu;
