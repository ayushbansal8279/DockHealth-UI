import React from 'react';
import { connect } from 'react-redux';
import { patientDetailsSelector } from 'selectors/patient-selectors';
import PatientDetailsInformation from './PatientDetailsInformation';
import PatientDetailsNotes from './PatientDetailsNotes';
import { PatientDetailsContainer } from './styled';

const PatientDetailsHeader = ({ patientDetails = {} }) => {
  const {
    allNotes,
    firstName,
    lastName,
    email,
    phoneMobile,
    phoneHome,
    dob,
    patientIdentifier,
  } = patientDetails;
  return (
    <PatientDetailsContainer>
      <PatientDetailsInformation
        firstName={firstName}
        lastName={lastName}
        email={email}
        phoneMobile={phoneMobile}
        phoneHome={phoneHome}
        dob={dob}
        patientIdentifier={patientIdentifier}
      />
      <PatientDetailsNotes allNotes={allNotes} />
    </PatientDetailsContainer>
  );
};

const mapStateToProps = store => ({
  patientDetails: patientDetailsSelector(store),
});

export default connect(mapStateToProps)(PatientDetailsHeader);
