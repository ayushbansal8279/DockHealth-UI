import React from 'react';
import OrganizationForm from 'views/onboarding/OrganizationForm/OrganizationForm';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  createOrganization,
  updateOrganization,
  selectCurrentOrganizationWithRedirection,
} from '@/app/api/organization-api';

const onSubmit =
  ({ history, dispatch, userProfile }) =>
  async ({
    organizationName,
    organizationInitials,
    organizationThemeColor,
  }) => {
    let organizationIdentifier = '';
    const isAdditionalOrgSetup =
      sessionStorage.getItem('ADDITIONAL_ORG_SETUP') || false;
    if (!isAdditionalOrgSetup) {
      organizationIdentifier = userProfile?.organizationIdentifier || '';
      await updateOrganization({
        organizationName,
        organizationInitials,
        organizationProfileColor: organizationThemeColor,
        organizationIdentifier: userProfile?.organizationIdentifier || '',
      });
    } else {
      const response = await createOrganization({
        organizationName,
        organizationInitials,
        organizationProfileColor: organizationThemeColor,
      });
      organizationIdentifier = response?.organizationIdentifier;
    }
    await selectCurrentOrganizationWithRedirection(
      organizationIdentifier,
      '/#/onboarding/customer-preference',
    );
    sessionStorage.removeItem('NEW_ORG_SETUP');
    sessionStorage.removeItem('ADDITIONAL_ORG_SETUP');
  };

const OnboardingOrgSetupView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userProfile = useSelector(userProfileSelector);

  return (
    <OrganizationForm onSubmit={onSubmit({ dispatch, history, userProfile })} />
  );
};

export default OnboardingOrgSetupView;
