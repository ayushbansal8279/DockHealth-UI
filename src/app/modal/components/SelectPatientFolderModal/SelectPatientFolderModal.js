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
  const [nestedFoldersHierarchy, setNestedFoldersHierarchy] = useState([]);
  const [selectedFolderIdentifier, setSelectedFolderIdentifier] = useState(
    null,
  );
  const [foldersList, setFoldersList] = useState(null);

  const currentFolder =
    nestedFoldersHierarchy[nestedFoldersHierarchy.length - 1];

  useEffect(() => {
    setFoldersList(null);
    PatientAttachmentApi.getPatientAttachments(
      patientIdentifier,
      currentFolder?.attachmentIdentifier ?? null,
    ).then(a => {
      setFoldersList(
        a.filter(({ type }) => type === PatientAttachmentType.FOLDER),
      );
    });
  }, [currentFolder, patientIdentifier]);

  const handleMoveClick = () => {
    onMove(selectedFolderIdentifier);
  };

  const handleFolderChange = folderId => {
    setSelectedFolderIdentifier(null);
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
      <ModalHeader
        onClick={() =>
          setNestedFoldersHierarchy(nestedFoldersHierarchy.slice(0, -1))
        }
      >
        {currentFolder ? currentFolder.fileName : 'Folders'}
      </ModalHeader>
      <Box width="384px" height="384px" overflow="hidden">
        <SelectionList
          selectedId={selectedFolderIdentifier}
          list={formattedFoldersList}
          onSelect={setSelectedFolderIdentifier}
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
          <Button
            fullWidth
            disabled={!selectedFolderIdentifier}
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
