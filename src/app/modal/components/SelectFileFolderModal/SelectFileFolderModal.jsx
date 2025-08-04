import React, { useEffect, useMemo, useState } from 'react';
import palette from 'styles/palette';
import { useSelector } from 'react-redux';
import { Box, Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PatientAttachmentType } from 'helpers/patient-details-helpers';
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
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';
import { currentProfileIdentifierSelector } from '@/app/selectors/profile-selector';
import { getProfileAttachments } from '@/app/api/profile-api';

const SelectFileFolderModal = ({ closeModal, onMove, context }) => {
  const patientIdentifier = useSelector(currentPatientIdentifierSelector);
  const profileIdentifier = useSelector(currentProfileIdentifierSelector);
  const [nestedFoldersHierarchy, setNestedFoldersHierarchy] = useState([]);
  const [foldersList, setFoldersList] = useState(null);

  const currentFolder =
    nestedFoldersHierarchy[nestedFoldersHierarchy.length - 1];

  useEffect(() => {
    if (context === 'profile') {
      setFoldersList(null);
      getProfileAttachments(
        profileIdentifier,
        currentFolder?.attachmentIdentifier ?? null,
      ).then((a) => {
        setFoldersList(
          a.filter(({ type }) => type === PatientAttachmentType.FOLDER),
        );
      });
      return ;
    }
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
      <FlexButtonWrapper>
        <CancelButton onClick={closeModal}>
          Cancel
        </CancelButton>
        <Box m={1} />
        <ConfirmButton fullWidth onClick={handleMoveClick}>
          Move
        </ConfirmButton>
      </FlexButtonWrapper>
    </ModalWrapperWithPadding>
  );
};

export default SelectFileFolderModal;
