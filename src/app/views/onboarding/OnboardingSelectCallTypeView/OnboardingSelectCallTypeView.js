/* eslint-disable no-empty-pattern */
/* eslint-disable sonarjs/no-extra-arguments */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import CallTypeForm from 'views/onboarding/CallTypeForm/CallTypeForm';
import { useHistory } from 'react-router-dom';
import { updateOrganizationCallType } from 'api/organization-api';
import { checkBAASignedStatus } from 'actions/organization-actions';
import { selectCurrentOrganizationWithRedirection } from 'api/user-api';
import { useDispatch, useSelector } from 'react-redux';

const callTypesList = [
  { name: 'Patients', key: 'PATIENT' },
  { name: 'Clients', key: 'CLIENT' },
  { name: 'Members', key: 'MEMBER' },
  { name: 'Customenrs', key: 'CUSTOMER' },
];

const onSubmit = async ({ dispatch, type }) => {
  const organizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );
  const {} = await updateOrganizationCallType({
    type,
    organizationIdentifier,
  });

  // const { baaSigned } = await checkBAASignedStatus(organizationIdentifier)(
  //   dispatch,
  // );

  // await selectCurrentOrganizationWithRedirection(
  //   organizationIdentifier,
  //   baaSigned ? '#/onboarding/team-setup' : '#/onboarding/eula',
  // );
};

const OnboardingSelectCallTypeView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <CallTypeForm
      onSubmit={type => onSubmit({ dispatch, type })}
      onCancel={history.goBack}
      callTypesList={callTypesList}
    />
  );
};

export default OnboardingSelectCallTypeView;
