import React from 'react';
import { Box } from '@mui/material';
import PatientsList from 'components/patients/PatientDropdown/PatientList';
import { PatientListWrapper } from './styled';
import {
  ModalHeader,
  ModalDescription,
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
} from '../styled';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { openModal } from 'modal/actions';
import { mergePatient } from '@/app/actions/patient-details-actions';
import { createPatientDetailsPath } from '@/app/routing/helpers/paths';

const PatientPickerModal = ({
  // patientIdentifiersToExclude,
  patient,
  closeModal
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSelect = (selectedPatient) => {
    dispatch(
      openModal('MergeData', {
        to: selectedPatient.firstName+" "+selectedPatient.lastName,
        from: patient.firstName+" "+patient.lastName,
        type: "patient",
        confirm: () => {
          dispatch(closeModal);
          dispatch(
            mergePatient(patient, selectedPatient, () => {
              history.push(
                createPatientDetailsPath(
                  selectedPatient.patientIdentifier,
                ),
              );
            }),
          );
        },
      }),
    );
  }

  return (
    <ModalWrapperWithPadding width="auto">
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <ModalHeader>Select patient</ModalHeader>
      <ModalDescription>Select Patient to Merge To</ModalDescription>
      <Box my={1} />
      <PatientListWrapper>
        <PatientsList
          disableAdding
          // patientIdentifiersToExclude={patientIdentifiersToExclude}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onSelect={(patient) => {
            closeModal();
            handleSelect(patient);
          }}
        />
      </PatientListWrapper>
      <Box my={2} />
    </ModalWrapperWithPadding>
  );
};

export default PatientPickerModal;
