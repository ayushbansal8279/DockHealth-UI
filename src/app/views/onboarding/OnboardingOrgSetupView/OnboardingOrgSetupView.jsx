import React from 'react';
import OrganizationForm from 'views/onboarding/OrganizationForm/OrganizationForm';
import { useHistory } from 'react-router-dom';
import { updateOrganization } from 'actions/organization-actions';
import { useDispatch } from 'react-redux';

const onSubmit =
  ({ dispatch, history }) =>
  ({ organizationName, organizationInitials, organizationThemeColor }) => {
    updateOrganization({
      organizationName,
      organizationInitials,
      organizationProfileColor: organizationThemeColor,
    })(dispatch).then(() => {
      history.push('/onboarding/customer-preference');
    });
  };

const OnboardingOrgSetupView = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  return <OrganizationForm onSubmit={onSubmit({ dispatch, history })} />;
};

export default OnboardingOrgSetupView;
