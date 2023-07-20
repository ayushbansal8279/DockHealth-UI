import React, { useEffect, useMemo, useState } from 'react';
import palette from 'styles/palette';
import { useSelector } from 'react-redux';
import { Box, Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  const [nestedFoldersHierarchy, setNestedFoldersHierarchy] = useState([]);
  const [foldersList, setFoldersList] = useState(null);

  const currentFolder =
    nestedFoldersHierarchy[nestedFoldersHierarchy.length - 1];

  useEffect(() => {
    setFoldersList(null);
    PatientAttachmentApi.getPatientAttachments(
      patientIdentifier,
      currentFolder?.attachmentIdentifier ?? null,
    ).then((a) => {
      setFoldersList(
        a.filter(({ type }) => type === PatientAttachmentType.FOLDER),
      );
    });
  }, [currentFolder, patientIdentifier]);

  const handleMoveClick = () => {
    onMove(currentFolder?.attachmentIdentifier ?? null);
  };

  const handleFolderChange = (folderId) => {
    const nextFolder = foldersList.find(
      ({ attachmentIdentifier }) => attachmentIdentifier === folderId,
    );
    setNestedFoldersHierarchy([...nestedFoldersHierarchy, nextFolder]);
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
      <Box display="flex" width="100%" alignItems="center" mb={1}>
        {currentFolder && (
          <IconButton
            style={{ color: palette.brightBlue }}
            onClick={() =>
              setNestedFoldersHierarchy(nestedFoldersHierarchy.slice(0, -1))
            }
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <ModalHeader>
          {currentFolder ? currentFolder.fileName : 'Folders'}
        </ModalHeader>
      </Box>
      <Box width="384px" height="384px" overflow="hidden">
        <SelectionList
          list={formattedFoldersList}
          onParentChange={handleFolderChange}
        />
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
          <Button fullWidth onClick={handleMoveClick} size="small">
            Move
          </Button>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default SelectPatientFolderModal;
