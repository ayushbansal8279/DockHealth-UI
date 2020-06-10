import React from 'react';
import { connect } from 'react-redux';
import { patientDetailsSelector } from 'selectors/patient-selectors';
import { addPatientNote as addPatientNoteAction } from 'sagas/patient';
import PatientDetailsInformation from './PatientDetailsInformation';
import PatientDetailsNotes from './PatientDetailsNotes';
import { PatientDetailsContainer } from './styled';

const PatientDetailsHeader = ({
  patientDetails = {},
  currentUser,
  addPatientNote,
}) => {
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
      <PatientDetailsNotes
        allNotes={allNotes}
        currentUser={currentUser}
        addPatientNote={addPatientNote}
      />
    </PatientDetailsContainer>
  );
};

const mapStateToProps = store => ({
  patientDetails: patientDetailsSelector(store),
  currentUser: store.userState.userProfile,
});

const mapDispatchToProps = {
  addPatientNote: addPatientNoteAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientDetailsHeader);
