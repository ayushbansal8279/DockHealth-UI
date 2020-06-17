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
import { openModal as openModalAction } from 'modal/actions';

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
  const { allNotes } = patientDetails;

  return (
    <PatientDetailsContainer>
      <ViewLoader isFetchingData={patientIsLoading}>
        <PatientDetailsInformation {...patientDetails} />
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
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { deletePatientNote, openModal, ...restDispatchProps } = dispatchProps;

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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(PatientDetailsHeader);
