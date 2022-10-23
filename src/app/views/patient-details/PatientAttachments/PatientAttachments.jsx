/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import palette from 'styles/palette';
import { useSelector, useDispatch } from 'react-redux';
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
import * as PatientDetailsActions from 'actions/patient-details-actions';
import GoogleDriveIcon from 'img/google-drive-icon';
import GoogleDrivePicker from 'components/common/GoogleDrivePicker/GoogleDrivePicker';
import {
  PatientAttachmentsWrapper,
  AttachmentFileInput,
  DropzoneInfoText,
  DropzoneContainer,
  EmptyListText,
  DriveIcon,
  DownloadAllLink,
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
    handleGooglePickerChange,
    handleAttachmentClick,
    dropzone: { getRootProps, getInputProps, isDragActive },
    downloadAllFiles,
  } = initializeAttachmentsSectionHooks();

  const [foldersList, setFoldersList] = useState([]);
  const [filesList, setFilesList] = useState([]);

  useEffect(() => {
    setFoldersList(folders);
  }, [folders]);

  useEffect(() => {
    setFilesList(currentPatientAttachments);
  }, [currentPatientAttachments]);

  const dispatch = useDispatch();

  const [didDragFile, setDidDragFile] = useState(false);
  const [didDragOverFile, setDidDragOverFile] = useState(false);

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

  const dragItem = useRef();
  const dragOverItem = useRef();

  const dragStart = (event, position, isFile = false) => {
    dragItem.current = position;
    setDidDragFile(isFile);
  };

  const dragEnter = (event, position, isFile = false) => {
    dragOverItem.current = position;
    // setDragOverStyle({ border: `2px solid ${palette.midnightBlue}` });
    const styledList = foldersList.map(folder => {
      const styledFolder = folder;
      styledFolder.style = { border: `1px solid ${palette.coolGrey2}` };
      return styledFolder;
    });

    if (!isFile) {
      styledList[position].style = {
        border: `2px solid ${palette.midnightBlue}`,
      };
      // setFoldersList(styledList);
    }
    setFoldersList(styledList);

    setDidDragOverFile(isFile);
  };

  const drop = useCallback(() => {
    // setDragOverStyle({ border: `1px solid ${palette.coolGrey2}` });
    if (dragOverItem && dragOverItem.current) {
      // foldersList[dragOverItem.current].style = {
      //   border: `1px solid ${palette.coolGrey2}`,
      // };

      setFoldersList(
        // eslint-disable-next-line sonarjs/no-identical-functions
        foldersList.map(folder => {
          const styledFolder = folder;
          styledFolder.style = { border: `1px solid ${palette.coolGrey2}` };
          return styledFolder;
        }),
      );
    }

    if (didDragOverFile) {
      return;
    }

    if (didDragFile) {
      dispatch(
        PatientDetailsActions.movePatientAttachment(
          filesList[dragItem.current],
          foldersList[dragOverItem.current].attachmentIdentifier,
        ),
      );

      const copyListItems = [...filesList];
      copyListItems.splice(dragItem.current, 1);
      setFilesList(copyListItems);
    } else {
      if (dragItem.current === dragOverItem.current) {
        return;
      }
      dispatch(
        PatientDetailsActions.movePatientAttachment(
          foldersList[dragItem.current],
          foldersList[dragOverItem.current].attachmentIdentifier,
        ),
      );
      const copyListItems = [...foldersList];
      copyListItems.splice(dragItem.current, 1);
      setFoldersList(copyListItems);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDidDragFile(false);
    setDidDragOverFile(false);
  }, [didDragFile, didDragOverFile, dispatch, filesList, foldersList]);

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
          {process.env.GOOGLE_DRIVE_API_CLIENT_ID &&
            process.env.GOOGLE_DRIVE_API_KEY && (
              <GoogleDrivePicker
                clientId={process.env.GOOGLE_DRIVE_API_CLIENT_ID}
                developerKey={process.env.GOOGLE_DRIVE_API_KEY}
                scope="https://www.googleapis.com/auth/drive.readonly"
                onChange={handleGooglePickerChange}
                // onAuthFailed={compose(dispatch, showGlobalErrorAlert)}
                // onAuthFailed={handleGoogleAuthError}
                // onAuthenticate={token => console.log('oauth token:', token)}
                onAuthFailed={data => console.log('on auth failed:', data)}
                multiselect
                navHidden={false}
                viewId="DOCS"
              >
                <IconButton>
                  <DriveIcon src={GoogleDriveIcon} alt="Google Drive" />
                </IconButton>
              </GoogleDrivePicker>
            )}
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
            {foldersList.length > 0 && (
              <NamedCollapse name="Folders">
                {activeViewType === FilesViewType.LIST && <FileListHeader />}
                {foldersList.map((folder, index) => (
                  <FolderItemComponent
                    folder={folder}
                    options={getFolderOptions(folder)}
                    onClick={() => {
                      navigateToFolder(folder);
                    }}
                    onDragStart={event => dragStart(event, index)}
                    onDragEnter={event => dragEnter(event, index)}
                    onDragEnd={drop}
                    key={folder.attachmentIdentifier}
                    draggable
                    // style={dragOverStyle}
                    style={folder.style ?? {}}
                  />
                ))}
              </NamedCollapse>
            )}
            <NamedCollapse name="Files">
              {activeViewType === FilesViewType.LIST && <FileListHeader />}
              {filesList.length > 0 ? (
                filesList.map((file, index) => (
                  <FileItemComponent
                    key={file.attachmentIdentifier}
                    onClick={() => handleAttachmentClick(file)}
                    file={file}
                    options={getFileOptions(file)}
                    onDragStart={event => dragStart(event, index, true)}
                    onDragEnter={event => dragEnter(event, index, true)}
                    onDragEnd={drop}
                    draggable
                  />
                ))
              ) : (
                <>
                  {!currentlyUploadedAttachment && (
                    <EmptyListText>List of files is empty</EmptyListText>
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
