import React from 'react';
import { useSelector } from 'react-redux';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
// import PatientsEmptyIcon from 'img/patients-empty.svg';
import { userProfileSelector } from 'selectors/user-selectors';
import { capitalize } from 'helpers/capitalize';
import { EmptyListContainer, ActionButton } from './styled';

const EmptyFilteredPatientsList = ({
  isFiltered,
  isFetching,
  refreshPatients,
  searchValue,
}) => {
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  return (
    <>
      <EmptyListContainer>
        {isFiltered && !isFetching && (
          <p>
            <strong>There are no matching {customerTypeLabel}s.</strong>
          </p>
        )}
        {!isFiltered && !searchValue && (
          <p>
            <ActionButton type="button" onClick={refreshPatients}>
              {`View All ${customerTypeLabel
                .toLowerCase()
                .charAt(0)
                .toUpperCase()}${customerTypeLabel.toLowerCase().slice(1)}s`}
            </ActionButton>
          </p>
        )}
      </EmptyListContainer>
    </>
  );
};

export default EmptyFilteredPatientsList;
