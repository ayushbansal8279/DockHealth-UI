import { Box } from '@mui/material';
import AccessRestrictor from 'components/access/AccessRestrictor/AccessRestrictor';
import { UserOrganizationRole } from 'helpers/user-helper';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  SUBS_SETTINGS_PATH,
  USERS_SETTINGS_PATH,
  POFILES_SETTINGS_PATH,
  TASK_CUSTOMIZATIONS_PATH,
  DEVELOPERS_PATH,
  INTEGRATIONS_PATH
} from 'routing/helpers/paths';
import {
  userHasPatientCustomFieldsFeatureSelector,
  userHasTaskCustomFieldsFeatureSelector,
  userHasSendEmailFeatureSelector,
  userHasSendFaxFeatureSelector,
  userHasSendSmsFeatureSelector,
  userHasSendSecureMessageFeatureSelector,
  userHasPostEMRNoteFeatureSelector,
  userHasAutomationMeteringFeatureSelector,
} from 'selectors/user-selectors';
import { organizationSelector } from 'selectors/organization-selectors';
import { isPlanPro, isPlanTrial } from 'helpers/subscription-helper';
import { SubMenuLink } from './styled';

const { ADMIN, OWNER, MEMBER } = UserOrganizationRole;

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
  const sendSecureMessageAvailable = useSelector(
    userHasSendSecureMessageFeatureSelector,
  );
  const postToEMRAvailable = useSelector(userHasPostEMRNoteFeatureSelector);
  const automationMeteringAvailable = useSelector(
    userHasAutomationMeteringFeatureSelector,
  );

  const organization = useSelector(organizationSelector);
  const subscription = organization?.subscriptionDetails;
  const isInTrial = isPlanTrial(subscription);
  const isProPlan = isPlanPro(subscription);

  const isApiAllowed = organization?.availableFeatures?.includes('API');

  return (
    <Box widht={1}>
      <Box m={2} />
      {!isInTrial && (
        <SubMenuLink to="/settings/billing">Billing &amp; Invoices</SubMenuLink>
      )}
      <SubMenuLink to={SUBS_SETTINGS_PATH}>Subscriptions</SubMenuLink>
      {automationMeteringAvailable && (
        <AccessRestrictor allowedToRoles={[ADMIN, OWNER]}>
          <SubMenuLink to="/settings/metering">Metering</SubMenuLink>
        </AccessRestrictor>
      )}
      {patientCustomFieldsAvailable && (
        <SubMenuLink to={POFILES_SETTINGS_PATH}>Profiles</SubMenuLink>
      )}
      <SubMenuLink to={USERS_SETTINGS_PATH}>Users</SubMenuLink>
      {(sendEmailAvailable ||
        sendFaxAvailable ||
        sendSmsAvailable ||
        sendSecureMessageAvailable ||
        postToEMRAvailable) && (
        <AccessRestrictor allowedToRoles={[ADMIN, OWNER]}>
          <SubMenuLink to="/settings/templates">Templates</SubMenuLink>
        </AccessRestrictor>
      )}
      {taskCustomFieldsAvailable && (
        <SubMenuLink to={TASK_CUSTOMIZATIONS_PATH}>Task Settings</SubMenuLink>
      )}
      {isApiAllowed && (
        <AccessRestrictor allowedToRoles={[ADMIN, OWNER]}>
          <SubMenuLink to={DEVELOPERS_PATH}>Developers</SubMenuLink>
        </AccessRestrictor>
      )}
      {true && (
        <AccessRestrictor allowedToRoles={[ADMIN, OWNER]}>
          <SubMenuLink to="/settings/workspaces">Workspaces</SubMenuLink>
        </AccessRestrictor>
      )}
      <AccessRestrictor allowedToRoles={[ADMIN, OWNER]}>
        <SubMenuLink to={INTEGRATIONS_PATH}>Integrations</SubMenuLink>
      </AccessRestrictor>

    </Box>
  );
};

export default SettingsSubmenu;
