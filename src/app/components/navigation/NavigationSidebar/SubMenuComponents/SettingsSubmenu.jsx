import { Box } from '@material-ui/core';
import AccessRestrictor from 'components/access/AccessRestrictor/AccessRestrictor';
import { UserOrganizationRole } from 'helpers/user-helper';
import React from 'react';
import { useSelector } from 'react-redux';
import { SUBS_SETTINGS_PATH, USERS_SETTINGS_PATH } from 'routing/helpers/paths';
import {
  userHasPatientCustomFieldsFeatureSelector,
  userHasTaskCustomFieldsFeatureSelector,
  userHasSendEmailFeatureSelector,
  userHasSendFaxFeatureSelector,
  userHasSendSmsFeatureSelector,
  userHasPostEMRNoteFeatureSelector,
} from 'selectors/user-selectors';
import { SubMenuLink } from './styled';

const { ADMIN, OWNER } = UserOrganizationRole;

const SettingsSubmenu = () => {
  const patientCustomFieldsAvailable = useSelector(
    userHasPatientCustomFieldsFeatureSelector,
  );
  const taskCustomFieldsAvailable = useSelector(
    userHasTaskCustomFieldsFeatureSelector,
  );
  const sendEmailAvailable = useSelector(userHasSendEmailFeatureSelector);
  const sendFaxAvailable = useSelector(userHasSendFaxFeatureSelector);
  const sendSmsAvailable = useSelector(userHasSendSmsFeatureSelector);
  const postToEMRAvailable = useSelector(userHasPostEMRNoteFeatureSelector);

  return (
    <Box widht={1}>
      <Box m={2} />
      <SubMenuLink to="/settings/billing">Billing &amp; Invoices</SubMenuLink>
      <SubMenuLink to={SUBS_SETTINGS_PATH}>Subscriptions</SubMenuLink>
      <SubMenuLink to={USERS_SETTINGS_PATH}>Users</SubMenuLink>
      {(patientCustomFieldsAvailable || taskCustomFieldsAvailable) && (
        <SubMenuLink to="/settings/custom-fields">Custom Fields</SubMenuLink>
      )}
      {(sendEmailAvailable ||
        sendFaxAvailable ||
        sendSmsAvailable ||
        postToEMRAvailable) && (
        <AccessRestrictor allowedToRoles={[ADMIN, OWNER]}>
          <SubMenuLink to="/settings/templates">Templates</SubMenuLink>
        </AccessRestrictor>
      )}
    </Box>
  );
};

export default SettingsSubmenu;
