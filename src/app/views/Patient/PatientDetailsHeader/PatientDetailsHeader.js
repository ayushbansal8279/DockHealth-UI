import React from 'react';
import { connect } from 'react-redux';
import {
  patientDetailsSelector,
  patientIsInitialyLoadingSelector,
} from 'selectors/patient-selectors';
import {
  addPatientNote as addPatientNoteAction,
  editPatientNote as editPatientNoteAction,
  deletePatientNote as deletePatientNoteAction,
} from 'sagas/patient';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';

import PatientDetailsInformation from './PatientDetailsInformation';
import PatientDetailsNotes from './PatientDetailsNotes/PatientDetailsNotes';
import { PatientDetailsContainer } from './styled';

const PatientDetailsHeader = ({
  patientDetails = {},
  patientIsLoading = false,
  currentUser,
  addPatientNote,
  editPatientNote,
  deletePatientNote,
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
      <ViewLoader isFetchingData={patientIsLoading}>
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
          editPatientNote={editPatientNote}
          deletePatientNote={deletePatientNote}
        />
      </ViewLoader>
    </PatientDetailsContainer>
  );
};

const mapStateToProps = store => ({
  patientDetails: patientDetailsSelector(store),
  patientIsLoading: patientIsInitialyLoadingSelector(store),
  currentUser: store.userState.userProfile,
});

const mapDispatchToProps = {
  addPatientNote: addPatientNoteAction,
  editPatientNote: editPatientNoteAction,
  deletePatientNote: deletePatientNoteAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientDetailsHeader);
