import React from 'react';
import OrganizationForm from 'views/onboarding/OrganizationForm/OrganizationForm';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  createOrganization,
  selectCurrentOrganizationWithRedirection,
} from '@/app/api/organization-api';

const onSubmit =
  ({ history, dispatch }) =>
  async ({
    organizationName,
    organizationInitials,
    organizationThemeColor,
  }) => {
    const { organizationIdentifier } = await createOrganization({
      organizationName,
      organizationInitials,
      organizationProfileColor: organizationThemeColor,
    });

    await selectCurrentOrganizationWithRedirection(
      organizationIdentifier,
      '/#/onboarding/customer-preference',
    );
  };

const OnboardingOrgSetupView = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  return <OrganizationForm onSubmit={onSubmit({ dispatch, history })} />;
};

export default OnboardingOrgSetupView;
