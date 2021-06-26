import React from 'react';
import { useSelector } from 'react-redux';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import PatientsEmptyIcon from 'img/patients-empty.svg';
import { EmptyListContainer, EmptyListIcon } from './styled';

const EmptyFilteredPatientsList = isFiltered => {
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  return (
    <EmptyListContainer>
      <EmptyListIcon>
        <img src={PatientsEmptyIcon} alt={`Empty ${customerTypeLabel}s list`} />
      </EmptyListIcon>
      <p>
        <strong>
          There are no {isFiltered ? '' : 'matching '}
          {customerTypeLabel}s.
        </strong>
      </p>
    </EmptyListContainer>
  );
};

export default EmptyFilteredPatientsList;
