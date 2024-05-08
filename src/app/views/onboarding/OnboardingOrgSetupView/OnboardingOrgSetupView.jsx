import React from 'react';
import OrganizationForm from 'views/onboarding/OrganizationForm/OrganizationForm';
import { useHistory } from 'react-router-dom';
import { updateOrganization } from 'actions/organization-actions';
import { useDispatch } from 'react-redux';
import { createOrganization } from '@/app/api/organization-api';

const onSubmit =
  ({ history }) =>
  async ({
    organizationName,
    organizationInitials,
    organizationThemeColor,
  }) => {
    await createOrganization({
      organizationName,
      organizationInitials,
      organizationProfileColor: organizationThemeColor,
    }).then(() => {
      history.push('/onboarding/customer-preference');
    });
  };

const OnboardingOrgSetupView = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  return <OrganizationForm onSubmit={onSubmit({ dispatch, history })} />;
};

export default OnboardingOrgSetupView;
