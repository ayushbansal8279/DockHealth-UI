import React from 'react';
import { AddEditLabelStyled } from './styled';

// eslint-disable-next-line import/prefer-default-export
export const renderAddOrEdit = (contact, handleShow) => {
  if (contact && !contact.identifier)
    return (
      <AddEditLabelStyled onClick={() => handleShow(true)}>
        Add Contact
      </AddEditLabelStyled>
    );
  if (contact && contact.identifier)
    return (
      <AddEditLabelStyled onClick={() => handleShow(true)}>
        Edit Contact
      </AddEditLabelStyled>
    );
  return null;
};

export const validateFaxInput = input => {
  return (
    (input.length === 10 && /\d/.test(input)) ||
    (input.length === 12 && /(\d{3}-)(\d{3}-)(\d{4})/.test(input))
  );
};

export const makeFaxNumber = fax => {
  if (/(\d{3}-)(\d{3}-)(\d{4})/.test(fax)) {
    return fax.split('-');
  }
  const first = fax.slice(0, 3);
  const middle = fax.slice(3, 6);
  const last = fax.slice(6);
  return [first, middle, last];
};
