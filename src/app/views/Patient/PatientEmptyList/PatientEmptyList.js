import React from 'react';
import { PatientEmptyListContainer } from './styled';

const PatientEmptyList = ({ children }) => {
  return <PatientEmptyListContainer>{children}</PatientEmptyListContainer>;
};

export default PatientEmptyList;
