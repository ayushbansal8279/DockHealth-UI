import React from 'react';
import OrganizationForm from 'views/onboarding/OrganizationForm/OrganizationForm';
import { useHistory } from 'react-router-dom';
import { createOrganization } from 'api/organization-api';
import { checkBAASignedStatus } from 'actions/organization-actions';
import { selectCurrentOrganizationWithRedirection } from 'api/user-api';
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

  const { baaSigned } = await checkBAASignedStatus(organizationIdentifier)(
    dispatch,
  );

  await selectCurrentOrganizationWithRedirection(
    organizationIdentifier,
    baaSigned ? '#/onboarding/team-setup' : '#/onboarding/eula',
  );
};

const OnboardingCreateOrganizationSetup = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <OrganizationForm
      onSubmit={onSubmit({ dispatch })}
      onCancel={history.goBack}
    />
  );
};

export default OnboardingCreateOrganizationSetup;
