/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useState } from 'react';
import palette from 'styles/palette';
import { useSelector } from 'react-redux';
import localStorageHelper from 'helpers/local-storage-helper';
import { Box, IconButton } from '@material-ui/core';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import { isFetchingPatientAttachmentsSelector } from 'selectors/patient-details-selectors';
import AddButton from 'components/common/AddButton/AddButton';
import AttachmentPreview from 'components/attachments/AttachmentPreview/AttachmentPreview';
import NamedCollapse from 'components/common/NamedCollapse/NamedCollapse';
import FileGridItem from 'components/attachments/FileGridItem/FileGridItem';
import FileListItem from 'components/attachments/FileListItem/FileListItem';
import FileListHeader from 'components/attachments/FileListItem/FileListHeader';
import FileListItemProgressBar from 'components/attachments/FileListItemProgressBar/FileListItemProgressBar';
import FileGridItemProgressBar from 'components/attachments/FileGridItemProgressBar/FileGridItemProgressBar';
import FileGridItemLoader from 'components/attachments/FileGridItemLoader/FileGridItemLoader';
import FileListItemLoader from 'components/attachments/FileListItemLoader/FileListItemLoader';
import {
  PatientAttachmentsWrapper,
  AttachmentFileInput,
  DropzoneInfoText,
  DropzoneContainer,
} from './styled';
import initializeAttachmentsSectionHooks from './hooks';
import { FilesViewType, PATIENT_FILES_VIEW_TYPE } from './helpers';

const PatientAttachments = () => {
  const [activeViewType, setActiveViewType] = useState(
    localStorageHelper.getItem(PATIENT_FILES_VIEW_TYPE) || FilesViewType.GRID,
  );

  useEffect(() => {
    if (activeViewType === FilesViewType.GRID) {
      localStorageHelper.removeItem(PATIENT_FILES_VIEW_TYPE);
    } else {
      localStorageHelper.setItem(PATIENT_FILES_VIEW_TYPE, activeViewType);
    }
  }, [activeViewType]);

  const {
    handleCreateFolderClick,
    attachmentsSources,
    currentPatientAttachments,
    folders,
    attachmentsLoading,
    deleteAttachment,
    attachmentFileInputReference,
    uploadProgress,
    currentlyUploadedAttachment,
    openAttachmentPreview,
    isAttachmentPreviewOpen,
    hideAttachmentPreview,
    previewedAttachment,
    navigateToFolder,
    openFolderInNewTab,
    dropzone: { getRootProps, getInputProps, isDragActive },
  } = initializeAttachmentsSectionHooks();

  const isFetching = useSelector(isFetchingPatientAttachmentsSelector);

  const FileItemComponent =
    activeViewType === FilesViewType.GRID ? FileGridItem : FileListItem;

  const getFileOptions = useCallback(
    file => [
      { name: 'Preview', onClick: () => openAttachmentPreview(file) },
      {
        name: 'Delete',
        onClick: () => deleteAttachment(file.attachmentIdentifier),
        color: palette.oPlusRed,
      },
    ],
    [openAttachmentPreview, deleteAttachment],
  );

  const getFolderOptions = useCallback(
    folder => [
      {
        name: 'Open in new tab',
        onClick: () => openFolderInNewTab(folder),
      },
      {
        name: 'Delete',
        onClick: () => deleteAttachment(folder.attachmentIdentifier),
        color: palette.oPlusRed,
      },
    ],
    [deleteAttachment, openFolderInNewTab],
  );

  return (
    <PatientAttachmentsWrapper isDragActive={isDragActive}>
      <Box display="flex" width="100%" justifyContent="flex-end" mb={2}>
        <AddButton onClick={handleCreateFolderClick}>Create Folder</AddButton>
        <AddButton onClick={() => attachmentFileInputReference.current.click()}>
          Add File
        </AddButton>
        <Box m={0.5} />
        <IconButton onClick={() => setActiveViewType(FilesViewType.GRID)}>
          <ViewModuleIcon
            color={
              activeViewType === FilesViewType.GRID ? 'secondary' : 'primary'
            }
          />
        </IconButton>
        <Box m={0.5} />
        <IconButton onClick={() => setActiveViewType(FilesViewType.LIST)}>
          <ViewHeadlineIcon
            color={
              activeViewType === FilesViewType.LIST ? 'secondary' : 'primary'
            }
          />
        </IconButton>
      </Box>
      {!isFetching ? (
        <>
          <DropzoneContainer {...getRootProps({ style: { outline: 'none' } })}>
            <DropzoneInfoText>
              {isDragActive
                ? 'Drop the files here ...'
                : 'Drag and drop files or documents here, or click + to select files'}
            </DropzoneInfoText>
            <AttachmentFileInput
              ref={attachmentFileInputReference}
              {...getInputProps()}
            />
            {folders.length > 0 && (
              <NamedCollapse name="Folders">
                {folders.map(folder => (
                  <FileItemComponent
                    fileOrFolder={folder}
                    options={getFolderOptions(folder)}
                    onClick={() => {
                      navigateToFolder(folder);
                    }}
                  />
                ))}
              </NamedCollapse>
            )}
            <NamedCollapse name="Files">
              {activeViewType === FilesViewType.LIST && <FileListHeader />}
              <div onClick={event => event.stopPropagation()}>
                {currentPatientAttachments.map(file => (
                  <FileItemComponent
                    onClick={() => {
                      openAttachmentPreview(file);
                    }}
                    fileOrFolder={file}
                    options={getFileOptions(file)}
                  />
                ))}
                {currentlyUploadedAttachment && (
                  <>
                    {activeViewType === FilesViewType.LIST ? (
                      <FileListItemProgressBar value={uploadProgress} />
                    ) : (
                      <FileGridItemProgressBar value={uploadProgress} />
                    )}
                  </>
                )}
              </div>
            </NamedCollapse>
            <AttachmentPreview
              attachment={previewedAttachment}
              attachmentsSources={attachmentsSources}
              hideAttachmentPreview={hideAttachmentPreview}
              isAttachmentPreviewOpen={isAttachmentPreviewOpen}
              attachmentsLoading={attachmentsLoading}
            />
          </DropzoneContainer>
        </>
      ) : (
        <>
          {activeViewType === FilesViewType.LIST ? (
            <>
              <FileListItemLoader />
              <FileListItemLoader />
              <FileListItemLoader />
              <FileListItemLoader />
              <FileListItemLoader />
            </>
          ) : (
            <>
              <FileGridItemLoader />
              <FileGridItemLoader />
              <FileGridItemLoader />
              <FileGridItemLoader />
              <FileGridItemLoader />
            </>
          )}
        </>
      )}
    </PatientAttachmentsWrapper>
  );
};

export default PatientAttachments;
