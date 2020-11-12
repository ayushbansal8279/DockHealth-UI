import React from 'react';
import PatientsEmptyIcon from 'img/patients-empty.svg';
import { EmptyListContainer, EmptyListIcon } from './styled';

const EmptyFilteredPatientsList = () => (
  <EmptyListContainer>
    <EmptyListIcon>
      <img src={PatientsEmptyIcon} alt="Empty patients list" />
    </EmptyListIcon>
    <p>
      <strong>There are no matching patients.</strong>
    </p>
  </EmptyListContainer>
);

export default EmptyFilteredPatientsList;
