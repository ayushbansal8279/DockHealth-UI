/* eslint-disable no-empty-pattern */
/* eslint-disable sonarjs/no-extra-arguments */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import CustomerTypeForm from 'views/onboarding/CustomerTypeForm/CustomerTypeForm';
import { useHistory } from 'react-router-dom';
import { updateOrganizationCallType } from 'api/organization-api';
import { checkBAASignedStatus } from 'actions/organization-actions';
import { selectCurrentOrganizationWithRedirection } from 'api/user-api';
import { useDispatch, useSelector } from 'react-redux';

const customerTypesList = [
  { name: 'Patients', key: 'PATIENT' },
  { name: 'Clients', key: 'CLIENT' },
  { name: 'Members', key: 'MEMBER' },
  { name: 'Customers', key: 'CUSTOMER' },
];

const onSubmit = async ({ dispatch, history, type }) => {
  const organizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );
  const {} = await updateOrganizationCallType({
    type,
    organizationIdentifier,
  });

  history.push('/onboarding/team-setup');
};

const OnboardingSelectCustomerTypeView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <CustomerTypeForm
      onSubmit={type => onSubmit({ dispatch, history, type })}
      onCancel={history.goBack}
      customerTypesList={customerTypesList}
    />
  );
};

export default OnboardingSelectCustomerTypeView;
