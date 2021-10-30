import { Box } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { SUBS_SETTINGS_PATH, USERS_SETTINGS_PATH } from 'routing/helpers/paths';
import {
  userHasPatientCustomFieldsFeatureSelector,
  userHasTaskCustomFieldsFeatureSelector,
} from 'selectors/user-selectors';
import { SubMenuLink } from './styled';

const SettingsSubmenu = () => {
  const patientCustomFieldsAvailable = useSelector(
    userHasPatientCustomFieldsFeatureSelector,
  );
  const taskCustomFieldsAvailable = useSelector(
    userHasTaskCustomFieldsFeatureSelector,
  );

  return (
    <Box widht={1}>
      <Box m={2} />
      <SubMenuLink to="/settings/billing">Billing &amp; Invoices</SubMenuLink>
      <SubMenuLink to={SUBS_SETTINGS_PATH}>Subscriptions</SubMenuLink>
      <SubMenuLink to={USERS_SETTINGS_PATH}>Users</SubMenuLink>
      {(patientCustomFieldsAvailable || taskCustomFieldsAvailable) && (
        <SubMenuLink to="/settings/custom-fields">Custom Fields</SubMenuLink>
      )}
    </Box>
  );
};

export default SettingsSubmenu;
