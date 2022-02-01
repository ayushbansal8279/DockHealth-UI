import React from 'react';
import PatientSelectItem from 'components/patients/PatientSelectItem/PatientSelectItem';

export const getFormattedPatient = patient => {
  if (!patient) {
    return null;
  }

  const { patientIdentifier, firstName, middleName, lastName } = patient;
  const patientName = middleName
    ? `${lastName}, ${firstName} ${middleName?.slice(0, 1)}`.trim()
    : ` ${lastName}, ${firstName}`.trim();
  const displayPatientName = middleName
    ? `${lastName}, ${firstName} ${middleName}`.trim()
    : `${lastName}, ${firstName}`.trim();

  const patientToDisplay = {
    ...patient,
    name: patientName,
  };

  return {
    key: patientIdentifier,
    value: patientIdentifier,
    label: ({ searchValue }) => (
      <PatientSelectItem patient={patientToDisplay} searchValue={searchValue} />
    ),
    displayLabel: displayPatientName,
    patient,
  };
};

export const getFormattedPatients = ({ patients }) =>
  (patients ?? []).map(getFormattedPatient);
