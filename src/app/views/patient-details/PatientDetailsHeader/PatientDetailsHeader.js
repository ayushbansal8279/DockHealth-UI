import React, { useState, useCallback } from 'react';
import { compose } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { openModal, closeModal } from 'modal/actions';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { userProfileSelector } from 'selectors/user-selectors';
import { organizationSelector } from 'selectors/organization-selectors';
import {
  patientSelector,
  isFetchingPatientSelector,
} from 'selectors/patient-details-selectors';
import { setPatient as setPatientAction } from 'actions/patient-details-actions';
import { reloadPatient } from 'sagas/patient-details-saga';
import * as PatientApi from 'api/patient-api';
import PatientDetailsInformation from './PatientDetailsInformation';
import PatientDetails from './PatientDetails/PatientDetails';
import { PatientDetailsContainer } from './styled';

const PatientDetailsHeader = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isOpenedDetails, setIsOpenedDetails] = useState(false);

  const currentUser = useSelector(userProfileSelector);
  const organization = useSelector(organizationSelector);
  const patient = useSelector(patientSelector);
  const isFetchingPatient = useSelector(isFetchingPatientSelector);

  const { emrIntegrationEnabled } = organization || {};
  const { patientIdentifier } = patient || {};

  const setPatient = compose(dispatch, setPatientAction);
  const refreshPatient = compose(dispatch, reloadPatient);

  // TODO: move to saga
  const updatePatient = useCallback(
    dataToUpdate => {
      setPatient({ ...patient, ...dataToUpdate });
      PatientApi.updatePatient(dataToUpdate)
        .then(updatedPatient => {
          setPatient(updatedPatient);
          dispatch(showGlobalAlert(AlertMessages.UPDATED));
        })
        .catch(() => {
          dispatch(showGlobalErrorAlert());
          refreshPatient();
        });
    },
    [dispatch, patient, refreshPatient, setPatient],
  );

  const archivePatient = useCallback(() => {
    const modalProps = {
      confirm: () => {
        PatientApi.archivePatient(patientIdentifier)
          .then(() => {
            dispatch(closeModal());
            dispatch(showGlobalAlert(AlertMessages.PATIENT_ARCHIVED));
            history.push('/core/patients');
          })
          .catch(() => {
            dispatch(showGlobalErrorAlert());
            dispatch(closeModal());
          });
      },
    };
    dispatch(openModal('ArchivePatient', modalProps));
  }, [dispatch, patientIdentifier, history]);

  return (
    <PatientDetailsContainer>
      <PatientDetailsInformation
        {...patient}
        isLoadingDetails={isFetchingPatient || !patient}
        setIsOpenedDetails={setIsOpenedDetails}
        isOpenedDetails={isOpenedDetails}
        currentUser={currentUser}
      />
      {!isFetchingPatient && patient && (
        <PatientDetails
          {...patient}
          isOpenedDetails={isOpenedDetails}
          updatePatient={updatePatient}
          patientIdentifier={patientIdentifier}
          archivePatient={archivePatient}
          editingDisabled={emrIntegrationEnabled}
          currentUser={currentUser}
          closeDetails={() => setIsOpenedDetails(false)}
        />
      )}
    </PatientDetailsContainer>
  );
};

export default PatientDetailsHeader;
