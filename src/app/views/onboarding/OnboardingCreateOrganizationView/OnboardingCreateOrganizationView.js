import React from 'react';
import OrganizationForm from 'views/onboarding/OrganizationForm/OrganizationForm';
import { hashHistory } from 'react-router';
import { createOrganization } from 'api/organization-api';
import { checkBAASignedStatus } from 'actions/organization-actions';
import { selectCurrentOrganization } from 'api/user-api';
import { useDispatch } from 'react-redux';

const onSubmit = ({ dispatch }) => async ({
  organizationName,
  organizationInitials,
  organizationThemeColor,
}) => {
  const { organizationIdentifier } = await createOrganization({
    organizationName,
    organizationInitials,
    organizationProfileColor: organizationThemeColor,
  });

  await selectCurrentOrganization(organizationIdentifier, false);

  const { baaSigned } = await checkBAASignedStatus(organizationIdentifier)(
    dispatch,
  );
  if (baaSigned) {
    hashHistory.push('/onboarding/team-setup');
  } else {
    hashHistory.push('/onboarding/baa-overview');
  }
};

const OnboardingCreateOrganizationSetup = () => {
  const dispatch = useDispatch();

  return (
    <OrganizationForm
      onSubmit={onSubmit({ dispatch })}
      onCancel={hashHistory.goBack}
    />
  );
};

export default OnboardingCreateOrganizationSetup;
