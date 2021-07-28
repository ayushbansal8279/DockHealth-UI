import React from 'react';
import {
  ListItemButton,
  ListItemCustomText,
  AddText,
  NoPatientFound,
  AdornmentContainer,
} from './styled';

const PatientList = ({
  showAddOption = true,
  customerTypeLabel = 'record',
  handleAddRecord,
  searchValue,
}) => {
  return !showAddOption || !typeof handleAddRecord === 'function' ? (
    <NoPatientFound>No {customerTypeLabel} found</NoPatientFound>
  ) : (
    <ListItemButton type="button" onMouseDown={handleAddRecord}>
      <ListItemCustomText>
        <AdornmentContainer>+</AdornmentContainer>
        <AddText>Add &quot;{searchValue}&quot;</AddText>
      </ListItemCustomText>
    </ListItemButton>
  );
};

export default PatientList;
