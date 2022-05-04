import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid } from '@material-ui/core';
import { PatientAttachmentType } from 'helpers/patient-details-helpers';
import Button from 'components/common/Button/Button';
import SelectionList from 'components/common/SelectionList/SelectionList';
import { currentPatientIdentifierSelector } from 'selectors/patient-details-selectors';
import * as PatientAttachmentApi from 'api/patient-attachment-api';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  FlexButtonWrapper,
  ModalHeader,
} from '../styled';

const SelectPatientFolderModal = ({ closeModal, onMove }) => {
  const patientIdentifier = useSelector(currentPatientIdentifierSelector);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [foldersList, setFoldersList] = useState(null);

  useEffect(() => {
    if (currentFolder) {
      PatientAttachmentApi.getPatientFolder(
        currentFolder.attachmentIdentifier,
      ).then(responseFolder => {
        setCurrentFolder(responseFolder);
      });
    }

    PatientAttachmentApi.getPatientAttachments(
      patientIdentifier,
      currentFolder?.attachmentIdentifier ?? null,
    ).then(a => {
      setFoldersList(
        a.filter(({ type }) => type === PatientAttachmentType.FOLDER),
      );
    });
  }, [patientIdentifier, currentFolder]);

  const handleMoveClick = () => {
    onMove();
  };

  const formattedFoldersList = useMemo(
    () =>
      foldersList?.map(({ attachmentIdentifier, fileName }) => ({
        id: attachmentIdentifier,
        name: fileName,
      })) ?? null,
    [foldersList],
  );

  return (
    <ModalWrapperWithPadding>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <ModalHeader>Folders</ModalHeader>
      <Box width="384px" height="384px" overflow="hidden">
        <SelectionList list={formattedFoldersList} />
      </Box>
      <Box m={2} />
      <Grid container direction="row">
        <FlexButtonWrapper>
          <Button
            fullWidth
            variant="secondary"
            onClick={closeModal}
            size="small"
          >
            Cancel
          </Button>
        </FlexButtonWrapper>
        <Box m={1} />
        <FlexButtonWrapper>
          <Button
            fullWidth
            // disabled={!selectedGroup}
            onClick={handleMoveClick}
            size="small"
          >
            Move
          </Button>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default SelectPatientFolderModal;
