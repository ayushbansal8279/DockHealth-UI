import React from 'react';
import OrganizationForm from 'views/onboarding/OrganizationForm/OrganizationForm';
import { hashHistory } from 'react-router';
import { updateOrganizationName } from 'actions/organization-actions';
import { useDispatch } from 'react-redux';

const onSubmit = ({ dispatch }) => ({
  organizationName,
  organizationInitials,
  organizationThemeColor,
}) => {
  updateOrganizationName({
    organizationName,
    organizationInitials,
    organizationProfileColor: organizationThemeColor,
  })(dispatch).then(() => {
    hashHistory.push('/onboarding/team-setup');
  });
};

const OnboardingOrgSetupViewDesktop = () => {
  const dispatch = useDispatch();

  return <OrganizationForm onSubmit={onSubmit({ dispatch })} />;
};

export default OnboardingOrgSetupViewDesktop;
