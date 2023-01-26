import React from 'react';
import CustomerTypeForm from 'views/onboarding/CustomerTypeForm/CustomerTypeForm';
import { useHistory } from 'react-router-dom';
import { updateOrganizationCallType } from 'api/organization-api';
import { useDispatch } from 'react-redux';

const customerTypesList = [
  { name: 'Patients', key: 'PATIENT' },
  { name: 'Clients', key: 'CLIENT' },
  { name: 'Members', key: 'MEMBER' },
  { name: 'Customers', key: 'CUSTOMER' },
];

const onSubmit = async ({ history, type }) => {
  const organizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );

  await updateOrganizationCallType({
    type,
    organizationIdentifier,
  });

  // history.push('/onboarding/team-setup');
  history.push('/core/home/my-tasks');
};

const OnboardingSelectCustomerTypeView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <CustomerTypeForm
      onSubmit={(type) => onSubmit({ dispatch, history, type })}
      onCancel={history.goBack}
      customerTypesList={customerTypesList}
    />
  );
};

export default OnboardingSelectCustomerTypeView;
