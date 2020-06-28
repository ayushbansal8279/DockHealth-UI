import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  patientDetailsSelector,
  patientIsInitialyLoadingSelector,
} from 'selectors/patient-selectors';
import {
  addPatientNote as addPatientNoteAction,
  editPatientNote as editPatientNoteAction,
  deletePatientNote as deletePatientNoteAction,
  updatePatient as updatePatientAction,
  archivePatient as archivePatientAction,
} from 'sagas/patient-saga';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import { openModal as openModalAction } from 'modal/actions';

import PatientDetailsInformation from './PatientDetailsInformation';
import PatientDetailsNotes from './PatientDetailsNotes/PatientDetailsNotes';
import PatientDetails from './PatientDetails/PatientDetails';
import { PatientDetailsContainer } from './styled';

const PatientDetailsHeader = ({
  patientDetails = {},
  patientIsLoading = false,
  currentUser,
  addPatientNote,
  editPatientNote,
  deletePatientNote,
  updatePatient,
  archivePatient,
}) => {
  const [isOpenedDetails, setIsOpenedDetails] = useState(false);

  const { allNotes, patientIdentifier } = patientDetails;

  return (
    <PatientDetailsContainer>
      <ViewLoader isFetchingData={patientIsLoading}>
        <PatientDetailsInformation
          {...patientDetails}
          setIsOpenedDetails={setIsOpenedDetails}
          isOpenedDetails={isOpenedDetails}
        />
        <PatientDetails
          {...patientDetails}
          isOpenedDetails={isOpenedDetails}
          updatePatient={updatePatient}
          patientIdentifier={patientIdentifier}
          archivePatient={archivePatient}
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
  openModal: openModalAction,
  updatePatient: updatePatientAction,
  archivePatient: archivePatientAction,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    deletePatientNote,
    openModal,
    archivePatient,
    ...restDispatchProps
  } = dispatchProps;

  return {
    ...restDispatchProps,
    ...stateProps,
    ...ownProps,
    deletePatientNote: patientNoteIdentifier => {
      const modalProps = {
        confirm: () => deletePatientNote({ patientNoteIdentifier }),
      };
      openModal('DeleteNote', modalProps);
    },
    archivePatient: patientIdentifier => {
      const modalProps = {
        confirm: () => archivePatient({ patientIdentifier }),
      };
      openModal('ArchivePatient', modalProps);
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(PatientDetailsHeader);
