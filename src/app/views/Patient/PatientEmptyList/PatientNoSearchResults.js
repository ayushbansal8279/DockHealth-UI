import React from 'react';
import { PatientEmptyListContainer } from './styled';

const PatientNoSearchResults = () => {
  return (
    <PatientEmptyListContainer>
      <p>No results were found for your search</p>
    </PatientEmptyListContainer>
  );
};

export default PatientNoSearchResults;
