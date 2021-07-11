import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { openModal } from 'modal/actions';
import { userProfileSelector } from 'selectors/user-selectors';
import { organizationSelector } from 'selectors/organization-selectors';
import {
  patientSelector,
  isFetchingPatientSelector,
} from 'selectors/patient-details-selectors';
import {
  updatePatientDetails as updatePatientDetailsAction,
  archievePatient as archievePatientAction,
} from 'actions/patient-details-actions';
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

  const archivePatient = useCallback(() => {
    const modalProps = {
      confirm: () =>
        dispatch(archievePatientAction(patientIdentifier, history)),
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
          updatePatient={details =>
            dispatch(updatePatientDetailsAction(details))
          }
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
