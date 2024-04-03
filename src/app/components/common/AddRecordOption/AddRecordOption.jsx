import React from 'react';
import {
  ListItemButton,
  ListItemCustomText,
  AddText,
  NoPatientFound,
  AdornmentContainer,
} from './styled';

const AddRecordOption = ({
  showAddOption = true,
  customerTypeLabel = 'record',
  onClick,
  searchValue,
}) => {
  return !showAddOption || !typeof onClick === 'function' ? (
    <NoPatientFound>No {customerTypeLabel} found</NoPatientFound>
  ) : (
    <ListItemButton type="button" onMouseDown={onClick}>
      <ListItemCustomText>
        <AdornmentContainer>+ Add</AdornmentContainer>
        <AddText>{searchValue}</AddText>
      </ListItemCustomText>
    </ListItemButton>
  );
};

export default AddRecordOption;
