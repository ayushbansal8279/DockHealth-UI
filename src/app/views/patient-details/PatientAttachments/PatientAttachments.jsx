/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useState } from 'react';
import palette from 'styles/palette';
import { useSelector } from 'react-redux';
import localStorageHelper from 'helpers/local-storage-helper';
// import compose from 'ramda/src/compose';
// import { showGlobalErrorAlert } from 'alert/actions';
import { Box, IconButton } from '@material-ui/core';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import { isFetchingPatientAttachmentsSelector } from 'selectors/patient-details-selectors';
import AttachmentsBreadcrumbs from 'views/patient-details/AttachmentsBreadcrumbs/AttachmentsBreadcrumbs';
import AddButton from 'components/common/AddButton/AddButton';
import AttachmentPreview from 'components/attachments/AttachmentPreview/AttachmentPreview';
import NamedCollapse from 'components/common/NamedCollapse/NamedCollapse';
import FileGridItem from 'components/attachments/GridItem/FileGridItem';
import FolderGridItem from 'components/attachments/GridItem/FolderGridItem';
import FileListItem from 'components/attachments/ListItem/FileListItem';
import FolderListItem from 'components/attachments/ListItem/FolderListItem';
import FileListHeader from 'components/attachments/ListItem/FileListHeader';
import FileListItemProgressBar from 'components/attachments/FileListItemProgressBar/FileListItemProgressBar';
import FileGridItemProgressBar from 'components/attachments/FileGridItemProgressBar/FileGridItemProgressBar';
import FileGridItemLoader from 'components/attachments/FileGridItemLoader/FileGridItemLoader';
import FileListItemLoader from 'components/attachments/FileListItemLoader/FileListItemLoader';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import GoogleDriveIcon from 'img/google-drive-icon';
// import GooglePicker from 'react-google-picker';
import {
  PatientAttachmentsWrapper,
  AttachmentFileInput,
  DropzoneInfoText,
  DropzoneContainer,
  EmptyListText,
  // DriveIcon,
  DownloadAllLink,
} from './styled';
import initializeAttachmentsSectionHooks from './hooks';
import { FilesViewType, PATIENT_FILES_VIEW_TYPE } from './helpers';

const PatientAttachments = () => {
  const [activeViewType, setActiveViewType] = useState(
    localStorageHelper.getItem(PATIENT_FILES_VIEW_TYPE) || FilesViewType.GRID,
  );

  if (process.env.GOOGLE_DRIVE_API_KEY) {
    console.error('Missing GOOGLE_DRIVE_API_KEY environment variable');
  }

  if (process.env.GOOGLE_DRIVE_API_CLIENT_ID) {
    console.error('Missing GOOGLE_DRIVE_API_CLIENT_ID environment variable');
  }

  useEffect(() => {
    if (activeViewType === FilesViewType.GRID) {
      localStorageHelper.removeItem(PATIENT_FILES_VIEW_TYPE);
    } else {
      localStorageHelper.setItem(PATIENT_FILES_VIEW_TYPE, activeViewType);
    }
  }, [activeViewType]);

  const {
    // dispatch,
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
    renameAttachment,
    moveFileOrFolder,
    // handleGooglePickerChange,
    handleAttachmentClick,
    dropzone: { getRootProps, getInputProps, isDragActive },
    downloadAllFiles,
  } = initializeAttachmentsSectionHooks();

  const isFetching = useSelector(isFetchingPatientAttachmentsSelector);

  const FileItemComponent =
    activeViewType === FilesViewType.GRID ? FileGridItem : FileListItem;

  const FolderItemComponent =
    activeViewType === FilesViewType.GRID ? FolderGridItem : FolderListItem;

  const getFileOptions = useCallback(
    file => [
      { name: 'Preview', onClick: () => openAttachmentPreview(file) },
      { name: 'Rename', onClick: () => renameAttachment(file) },
      {
        name: 'Move',
        onClick: () => moveFileOrFolder(file),
      },
      {
        name: 'Delete',
        onClick: () => deleteAttachment(file.attachmentIdentifier),
        color: palette.oPlusRed,
      },
    ],
    [
      openAttachmentPreview,
      renameAttachment,
      moveFileOrFolder,
      deleteAttachment,
    ],
  );

  const getFolderOptions = useCallback(
    folder => [
      {
        name: 'Open in new tab',
        onClick: () => openFolderInNewTab(folder),
      },
      { name: 'Rename', onClick: () => renameAttachment(folder) },
      {
        name: 'Move',
        onClick: () => moveFileOrFolder(folder),
      },
      {
        name: 'Delete',
        onClick: () => deleteAttachment(folder.attachmentIdentifier),
        color: palette.oPlusRed,
      },
    ],
    [deleteAttachment, moveFileOrFolder, openFolderInNewTab, renameAttachment],
  );

  const handleDragEnd = useCallback(() => {
    console.log(`drag ended`);
  }, []);

  return (
    <PatientAttachmentsWrapper isDragActive={isDragActive}>
      <Box display="flex" width="100%" mb={2}>
        <Box
          display="flex"
          flex="1 1 auto"
          alignItems="center"
          overflow="hidden"
        >
          <AttachmentsBreadcrumbs />
        </Box>
        <Box display="flex" alignItems="center" flex="0 0 auto">
          {/* {process.env.GOOGLE_DRIVE_API_CLIENT_ID &&
            process.env.GOOGLE_DRIVE_API_KEY && (
              <GooglePicker
                clientId={process.env.GOOGLE_DRIVE_API_CLIENT_ID}
                developerKey={process.env.GOOGLE_DRIVE_API_KEY}
                scope={['https://www.googleapis.com/auth/drive.readonly']}
                onChange={handleGooglePickerChange}
                onAuthFailed={compose(dispatch, showGlobalErrorAlert)}
                multiselect
                viewId="DOCS"
              >
                <IconButton>
                  <DriveIcon src={GoogleDriveIcon} alt="Google Drive" />
                </IconButton>
              </GooglePicker>
            )} */}
          <AddButton onClick={handleCreateFolderClick}>Create Folder</AddButton>
          <AddButton
            onClick={() => attachmentFileInputReference.current.click()}
          >
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
      </Box>
      {!isFetching ? (
        <>
          <DropzoneContainer
            {...getRootProps({
              onClick: event => event.stopPropagation(),
              style: {
                outline: 'none',
              },
            })}
          >
            <DropzoneInfoText>
              {isDragActive
                ? 'Drop the files here ...'
                : 'Drag and drop files or documents here'}
            </DropzoneInfoText>
            <AttachmentFileInput
              ref={attachmentFileInputReference}
              {...getInputProps()}
            />
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {provided => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {folders.length > 0 && (
                      <NamedCollapse name="Folders">
                        {activeViewType === FilesViewType.LIST && (
                          <FileListHeader />
                        )}
                        {folders.map((folder, index) => (
                          <Draggable
                            key={folder.attachmentIdentifier}
                            draggableId={folder.attachmentIdentifier}
                            index={index}
                          >
                            {provided => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <FolderItemComponent
                                  folder={folder}
                                  options={getFolderOptions(folder)}
                                  onClick={() => {
                                    navigateToFolder(folder);
                                  }}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </NamedCollapse>
                    )}
                    <NamedCollapse name="Files">
                      {activeViewType === FilesViewType.LIST && (
                        <FileListHeader />
                      )}
                      {currentPatientAttachments.length > 0 ? (
                        currentPatientAttachments.map(file => (
                          <FileItemComponent
                            key={file.attachmentIdentifier}
                            onClick={() => handleAttachmentClick(file)}
                            file={file}
                            options={getFileOptions(file)}
                          />
                        ))
                      ) : (
                        <>
                          {!currentlyUploadedAttachment && (
                            <EmptyListText>
                              List of files is empty
                            </EmptyListText>
                          )}
                        </>
                      )}
                      {currentlyUploadedAttachment && (
                        <>
                          {activeViewType === FilesViewType.LIST ? (
                            <FileListItemProgressBar value={uploadProgress} />
                          ) : (
                            <FileGridItemProgressBar value={uploadProgress} />
                          )}
                        </>
                      )}
                      {currentPatientAttachments.length > 0 && (
                        <div>
                          <DownloadAllLink onClick={downloadAllFiles}>
                            Download All
                          </DownloadAllLink>
                        </div>
                      )}
                    </NamedCollapse>
                  </div>
                )}
              </Droppable>
            </DragDropContext>

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
        <Box width="100%" mt="80px">
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
        </Box>
      )}
    </PatientAttachmentsWrapper>
  );
};

export default PatientAttachments;
