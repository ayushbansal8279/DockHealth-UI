/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import palette from 'styles/palette';
import { useSelector, useDispatch } from 'react-redux';
import localStorageHelper from 'helpers/local-storage-helper';
// import compose from 'ramda/src/compose';
// import { showGlobalErrorAlert } from 'alert/actions';
import { Box, IconButton } from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
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
import GoogleDriveIcon from 'img/google-drive-icon.png';
import GoogleDrivePicker from 'components/common/GoogleDrivePicker/GoogleDrivePicker';
import { log } from 'helpers/log';
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
import { FilesViewType, PATIENT_FILES_VIEW_TYPE, ScanStatus } from './helpers';
import { currentFolderIdentifierSelector, currentProfileIdentifierSelector } from '@/app/selectors/profile-selector';
import { getProfileFolderStructureHierarchy } from '@/app/api/profile-api';
import { createProfileAttachmentsPath } from '@/app/routing/helpers/paths';

const ProfileAttachments = () => {
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
    downloadAttachment,
    profileTaskAttachments,
    renamePatientTaskAttachment,
    deletePatientTaskAttachment,
    downloadPatientTaskAttachment,
  } = initializeAttachmentsSectionHooks();

  // console.log(currentPatientAttachments);
  
  const [foldersList, setFoldersList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [taskFileList, setTaskFilelist] = useState([])

  useEffect(() => {
    setFoldersList(folders);
  }, [folders]);

  useEffect(() => {
    setFilesList(currentPatientAttachments);
  }, [currentPatientAttachments]);

  useEffect(() => {
    setTaskFilelist(profileTaskAttachments);
  }, [profileTaskAttachments]);
  

  const dispatch = useDispatch();

  const [didDragFile, setDidDragFile] = useState(false);
  const [didDragOverFile, setDidDragOverFile] = useState(false);

  const isFetching = useSelector(isFetchingPatientAttachmentsSelector);

  const downloadDisabled = currentPatientAttachments?.some(
    ({ scanStatus }) =>
      scanStatus &&
      !(scanStatus === ScanStatus.CLEAN ||
        scanStatus === ScanStatus.UNSUPPORTED),
  );

  const FileItemComponent =
    activeViewType === FilesViewType.GRID ? FileGridItem : FileListItem;

  const FolderItemComponent =
    activeViewType === FilesViewType.GRID ? FolderGridItem : FolderListItem;

  // const getFileOptions = useCallback(
  //   (file) => [
  //     ...(!file.scanStatus ||
  //     file.scanStatus === ScanStatus.CLEAN ||
  //     file.scanStatus === ScanStatus.UNSUPPORTED
  //       ? [
  //           { name: 'Preview', onClick: () => openAttachmentPreview(file, "patient") },
  //           {
  //             name: 'Download',
  //             onClick: () => {
  //               downloadAttachment(file);
  //             },
  //           },
  //         ]
  //       : []),
  //     {
  //       name: 'Rename',
  //       onClick: () => renameAttachment(file),
  //     },
  //     {
  //       name: 'Move',
  //       onClick: () => moveFileOrFolder(file),
  //     },
  //     {
  //       name: 'Delete',
  //       onClick: () => deleteAttachment(file.attachmentIdentifier),
  //       color: palette.oPlusRed,
  //     },
  //   ],
  //   [
  //     openAttachmentPreview,
  //     renameAttachment,
  //     moveFileOrFolder,
  //     deleteAttachment,
  //     downloadAttachment,
  //   ],
  // );

  const getFileOptions = useCallback(
  (file) => [
    {
      name: 'Preview',
      onClick: () => openAttachmentPreview(file, "patient"),
    },
    {
      name: 'Download',
      onClick: () => {
        downloadAttachment(file);
      },
    },
    {
      name: 'Rename',
      onClick: () => renameAttachment(file),
    },
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
    downloadAttachment,
  ],
);

  const getTaskFileOptions = useCallback(
    (file) => [
      ...(!file.scanStatus ||
      file.scanStatus === ScanStatus.CLEAN ||
      file.scanStatus === ScanStatus.UNSUPPORTED
        ? [
            { name: 'Preview', onClick: () => openAttachmentPreview(file, "task") },
            {
              name: 'Download',
              onClick: () => {
                downloadPatientTaskAttachment(file);
              },
            },
          ]
        : []),
      // {
      //   name: 'Rename',
      //   onClick: () => renamePatientTaskAttachment(file),
      // },
      // {
      //   name: 'Delete',
      //   onClick: () => deletePatientTaskAttachment(file.attachmentIdentifier),
      //   color: palette.oPlusRed,
      // },
    ],
    [
      openAttachmentPreview,
      renamePatientTaskAttachment,
      moveFileOrFolder,
      deletePatientTaskAttachment,
      downloadPatientTaskAttachment,
    ],
  );

  const getFolderOptions = useCallback(
    (folder) => [
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
    const styledList = foldersList.map((folder) => {
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
        foldersList.map((folder) => {
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
          <AttachmentsBreadcrumbs  entityIdentifierSelector={currentProfileIdentifierSelector}
                       currentFolderIdentifierSelector={currentFolderIdentifierSelector} 
                       getFolderStructureHierarchy={getProfileFolderStructureHierarchy} 
                     />
        </Box>
        <Box display="flex" alignItems="center" flex="0 0 auto">
          {import.meta.env.VITE_GOOGLE_DRIVE_API_CLIENT_ID &&
            import.meta.env.GOOGLE_DRIVE_API_KEY && (
              <GoogleDrivePicker
                clientId={import.meta.env.VITE_GOOGLE_DRIVE_API_CLIENT_ID}
                developerKey={import.meta.env.GOOGLE_DRIVE_API_KEY}
                scope="https://www.googleapis.com/auth/drive.readonly"
                onChange={handleGooglePickerChange}
                // onAuthFailed={compose(dispatch, showGlobalErrorAlert)}
                // onAuthFailed={handleGoogleAuthError}
                // onAuthenticate={token => console.log('oauth token:', token)}
                onAuthFailed={(data) => log('on auth failed:', data)}
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
      {isFetching ? (
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
      ) : (
        <DropzoneContainer
          {...getRootProps({
            onClick: (event) => event.stopPropagation(),
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
                  onDragStart={(event) => dragStart(event, index)}
                  onDragEnter={(event) => dragEnter(event, index)}
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
                  onDragStart={(event) => dragStart(event, index, true)}
                  onDragEnter={(event) => dragEnter(event, index, true)}
                  onDragEnd={drop}
                  draggable
                />
              ))
            ) : (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {!currentlyUploadedAttachment && (
                  <EmptyListText>List of files is empty</EmptyListText>
                )}
              </>
            )}
            {currentlyUploadedAttachment && (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {activeViewType === FilesViewType.LIST ? (
                  <FileListItemProgressBar value={uploadProgress} />
                ) : (
                  <FileGridItemProgressBar value={uploadProgress} />
                )}
              </>
            )}
            {!downloadDisabled && currentPatientAttachments.length > 0 && (
              <div>
                <DownloadAllLink onClick={downloadAllFiles}>
                  Download All
                </DownloadAllLink>
              </div>
            )}
          </NamedCollapse>
           <NamedCollapse name="Task Files">
            {activeViewType === FilesViewType.LIST && <FileListHeader />}
            {taskFileList.length > 0 ? (
              taskFileList.map((file, index) => (
                <FileItemComponent
                  key={file.attachmentIdentifier}
                  onClick={() => handleAttachmentClick(file)}
                  file={file}
                  options={getTaskFileOptions(file)}
                  onDragStart={(event) => dragStart(event, index, true)}
                  onDragEnter={(event) => dragEnter(event, index, true)}
                  onDragEnd={drop}
                  draggable
                />
              ))
            ) : (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {!currentlyUploadedAttachment && (
                  <EmptyListText>List of files is empty</EmptyListText>
                )}
              </>
            )}
            {currentlyUploadedAttachment && (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {activeViewType === FilesViewType.LIST ? (
                  <FileListItemProgressBar value={uploadProgress} />
                ) : (
                  <FileGridItemProgressBar value={uploadProgress} />
                )}
              </>
            )}
            {!downloadDisabled && currentPatientAttachments.length > 0 && (
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
      )}
    </PatientAttachmentsWrapper>
  );
};

export default ProfileAttachments;
