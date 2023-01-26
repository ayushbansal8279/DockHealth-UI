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

const PatientPickerModal = ({
  // patientIdentifiersToExclude,
  closeModal,
  // onSelect,
}) => {
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
            // onSelect(patient);
          }}
        />
      </PatientListWrapper>
      <Box my={2} />
    </ModalWrapperWithPadding>
  );
};

export default PatientPickerModal;
