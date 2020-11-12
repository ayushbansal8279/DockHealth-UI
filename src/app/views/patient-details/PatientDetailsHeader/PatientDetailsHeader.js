import React, { useState } from 'react';
import { connect } from 'react-redux';
import { isNil } from 'ramda';
import { patientIsInitialyLoadingSelector } from 'selectors/patient-selectors';
import { organizationSelector } from 'selectors/organization-selectors';
import {
  addPatientNote as addPatientNoteAction,
  editPatientNote as editPatientNoteAction,
  deletePatientNote as deletePatientNoteAction,
  updatePatient as updatePatientAction,
  archivePatient as archivePatientAction,
} from 'sagas/patient-saga';
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
  organization,
}) => {
  const [isOpenedDetails, setIsOpenedDetails] = useState(false);

  const { emrIntegrationEnabled } = organization || {};
  const { allNotes, patientIdentifier } = patientDetails;

  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );
  const currentOrganization =
    currentUser?.userOrganizations?.find(
      ({ organizationIdentifier }) =>
        organizationIdentifier === currentOrganizationIdentifier,
    ) || {};

  return (
    <PatientDetailsContainer>
      <PatientDetailsInformation
        {...patientDetails}
        isLoadingDetails={patientIsLoading}
        setIsOpenedDetails={setIsOpenedDetails}
        isOpenedDetails={isOpenedDetails}
      />
      {!patientIsLoading && (
        <PatientDetails
          {...patientDetails}
          isOpenedDetails={isOpenedDetails}
          updatePatient={updatePatient}
          patientIdentifier={patientIdentifier}
          archivePatient={archivePatient}
          editingDisabled={
            isNil(emrIntegrationEnabled) || emrIntegrationEnabled
          }
        />
      )}
      <PatientDetailsNotes
        isLoadingDetails={patientIsLoading}
        allNotes={allNotes}
        currentUser={currentUser}
        addPatientNote={addPatientNote}
        editPatientNote={editPatientNote}
        deletePatientNote={deletePatientNote}
      />
    </PatientDetailsContainer>
  );
};

const mapStateToProps = store => ({
  patientIsLoading: patientIsInitialyLoadingSelector(store),
  currentUser: store.userState.userProfile,
  organization: organizationSelector,
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
