import React from 'react';
import PatientSelectItem from 'components/patients/PatientSelectItem/PatientSelectItem';

const PatientSuggestionItem = ({
  mention,
  searchValue,
  isFocused,
  ...parentProps
}) => {
  return (
    <PatientSelectItem
      patient={mention}
      searchValue={searchValue}
      isFocused={isFocused}
      {...parentProps}
    />
  );
};

export default PatientSuggestionItem;
