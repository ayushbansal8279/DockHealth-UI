import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { showGlobalErrorAlert } from 'alert/actions';
import memoizeWith from 'ramda/src/memoizeWith';
import identity from 'ramda/src/identity';
import isEmpty from 'ramda/src/isEmpty';
import * as PatientDetailsActions from 'actions/patient-details-actions';
import {
  patientSelector,
  patientFoldersSelector,
  patientAttachmentsSelector,
  patientTaskAttachementSelector,
} from 'selectors/patient-details-selectors';
import { downloadPatientAttachment } from 'api/patient-attachment-api';
import { useBoolean } from 'hooks/useBoolean';
import { openModal } from 'modal/actions';
import { createPatientAttachmentsPath } from 'routing/helpers/paths';
import { PatientAttachmentType } from 'helpers/patient-details-helpers';
import { getTaskAttachment } from '@/app/api/task-api';
import { blobFileDownload } from '@/app/helpers/blob-file-download';
import { currentProfileIdentifierSelector, currentProfileTypeIdentifierSelector, profileAttachmentsSelector, profileFoldersSelector, profileSelector, profileTaskAttachmentSelector } from '@/app/selectors/profile-selector';
import { createProfileAttachment, createProfileAttachmentFolder, deleteProfileAttachment, getCurrentProfileAttachments, moveProfileAttachment, updateProfileAttachment } from '@/app/actions/profile-actions';
import { ProfileAttachmentType } from '@/app/helpers/profile-helpers';
import { createProfileAttachmentsPath } from '@/app/routing/helpers/paths';
import { downloadProfileAttachment } from '@/app/api/profile-api';


export const getMemoPatientAttachment = memoizeWith(
  identity,
  (attachmentIdentifier) =>
    attachmentIdentifier
      ? downloadPatientAttachment(attachmentIdentifier)
      : Promise.reject(),
);

export const getMemoProfileAttachment = memoizeWith(
  identity,
  (attachmentIdentifier) =>
    attachmentIdentifier
      ? downloadProfileAttachment(attachmentIdentifier)
      : Promise.reject(),
);

export const getMemoTaskAttachment = memoizeWith(
  identity,
  (attachmentIdentifier) =>
    attachmentIdentifier
      ? getTaskAttachment(attachmentIdentifier)
      : Promise.reject(),
);

const useInitializeAttachmentsSectionHooks = () => {
  const { folderIdentifier } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const patient = useSelector(patientSelector);
  const profile = useSelector(profileSelector);
  const patientIdentifier = patient?.patientIdentifier;

  useEffect(() => {
    if (patientIdentifier) {
      dispatch(
        PatientDetailsActions.initializePatientAttachmentsFolder(
          folderIdentifier ?? null,
        ),
      );
    }
  }, [dispatch, patientIdentifier, folderIdentifier]);

  useEffect(() => {
    // if (patientIdentifier) {
      dispatch(
        getCurrentProfileAttachments(
          // folderIdentifier ?? null,
        ),
      );
    // }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const attachments = useSelector(profileAttachmentsSelector) || [];
  const profileIdentifier = useSelector(currentProfileIdentifierSelector)
  const profileTaskAttachments = useSelector(profileTaskAttachmentSelector) || [];
  
  const folders = useSelector(profileFoldersSelector) || [];
  
  const [attachmentsSources, setAttachmentSources] = useState([]);
  const [attachmentsLoading, setAttachmentsLoading, unsetAttachmentsLoading] =
    useBoolean(false);

  const [currentlyUploadedAttachment, setCurrentlyUploadedAttachment] =
    useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [
    isAttachmentPreviewOpen,
    showAttachmentPreview,
    hideAttachmentPreview,
  ] = useBoolean(false);
  const [previewedAttachment, setPreviewedAttachment] = useState(null);

  const onAttachmentFileInputChange = useCallback(
    (files) => {
      if (files && !isEmpty(files)) {
        const [newAttachment, ...restAttachments] = files;

        setCurrentlyUploadedAttachment(newAttachment);
        setUploadProgress(0);

        dispatch(
          createProfileAttachment(
            profileIdentifier,
            folderIdentifier,
            newAttachment,
            {
              onUploadProgress: ({ loaded, total }) => {
                setUploadProgress(Math.round((loaded * 100) / total));
              },
            },
            setCurrentlyUploadedAttachment,
            onAttachmentFileInputChange,
            restAttachments,
          ),
        );
      }
    },
    [dispatch, profile, folderIdentifier],
  );

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop: onAttachmentFileInputChange,
  });

  const loadAttachmentsContent = useCallback(
    ({ attachmentsToReload, getAttachement }) => {
      setAttachmentsLoading();

      Promise.all(
        attachmentsToReload.map(
          async ({ attachmentIdentifier, fileName, contentType }) => {
            const { data } = await getAttachement(
              attachmentIdentifier,
            );

            const fileSource = await new Promise((resolve, reject) => {
              const reader = new FileReader();

              reader.onloadend = () => {
                // replace base64 type with content type from server
                resolve(
                  reader.result.replace(
                    /data:[^;]+;base64/,
                    `data:${contentType};base64`,
                  ),
                );
              };

              reader.addEventListener('error', reject);

              reader.readAsDataURL(data);
            });

            return {
              attachmentIdentifier,
              fileName,
              fileSource,
              contentType,
            };
          },
        ),
      ).then((downloadedAttachments) => {
        unsetAttachmentsLoading();
        setAttachmentSources(downloadedAttachments);
      });
    },
    [setAttachmentsLoading, unsetAttachmentsLoading],
  );

  const deleteAttachment = useCallback(
    (identifier) => {
      dispatch(openModal('DeleteConfirmation', {
        title: 'Delete Attachment',
        description: 'Are you sure you want to delete this attachment? This action cannot be undone.',
        confirm: () => {
          dispatch(
            deleteProfileAttachment(
              profileIdentifier,
              identifier,
            ),
          );
        }
      }))
    },
    [dispatch, profileIdentifier],
  );

  const downloadAttachment = async (attachment) => {
    const { attachmentIdentifier, fileName, contentType } = attachment;
    try {
      const { data } = await getMemoProfileAttachment(attachmentIdentifier);
      blobFileDownload(new Blob([data], { type: contentType }), fileName || 'download');
    } catch (error) {
      console.error('Error downloading attachment:', error);
    }
  };

  const downloadPatientTaskAttachment = async (attachment) => {
    const { attachmentIdentifier, fileName, contentType } = attachment;
    try {
      const response = await getTaskAttachment(attachmentIdentifier);
      blobFileDownload(new Blob([response.data], { type: contentType }), fileName || 'download');

    } catch (error) {
      console.error('Error downloading attachment:', error);
    }
  };


  const openAttachmentPreview = useCallback(
    (attachment, type) => {
      setPreviewedAttachment(attachment);
      loadAttachmentsContent({
        attachmentsToReload: [attachment],
        getAttachement: getMemoProfileAttachment
      });
      showAttachmentPreview();
    },
    [loadAttachmentsContent, showAttachmentPreview],
  );

  const handleCreateFolderClick = () => {
    dispatch(
      openModal('PatientFolder', {
        title: 'Create folder',
        inputLabel: 'Folder name',
        onChange: (name) => {
          dispatch(
            createProfileAttachmentFolder(
              profileIdentifier,
              name,
              folderIdentifier,
            ),
          );
        },
      }),
    );
  };

  const renameAttachment = (fileOrFolder) => {
    dispatch(
      openModal('PatientFolder', {
        title: `Rename ${fileOrFolder.type === ProfileAttachmentType.FOLDER ? 'folder' : 'file'
          }`,
        inputLabel: `${fileOrFolder.type === ProfileAttachmentType.FOLDER ? 'Folder' : 'File'
          } name`,
        currentName: fileOrFolder.fileName,
        onChange: (name) => {
          dispatch(
            updateProfileAttachment(fileOrFolder, {
              fileName: name,
            }),
          );
        },
      }),
    );
  };

  const renamePatientTaskAttachment = (fileOrFolder) => {
    dispatch(
      openModal('PatientFolder', {
        title: `Rename ${fileOrFolder.type === PatientAttachmentType.FOLDER ? 'folder' : 'file'
          }`,
        inputLabel: `${fileOrFolder.type === PatientAttachmentType.FOLDER ? 'Folder' : 'File'
          } name`,
        currentName: fileOrFolder.fileName,
        onChange: (name) => {
          dispatch(
            PatientDetailsActions.updatePatientTaskAttachment(fileOrFolder.attachmentIdentifier,
              name,
            ),
          );
        },
      }),
    );
  };

  const deletePatientTaskAttachment = useCallback(
    (identifier) => {
      dispatch(openModal('DeleteConfirmation', {
        title: 'Delete Attachment',
        description: 'Are you sure you want to delete this attachment? This action cannot be undone.',
        confirm: () => {
          dispatch(
            PatientDetailsActions.deletePatientTaskAttachement(
              identifier,
            ),
          );
        }
      }))
    },
    [dispatch],
  );

  const navigateToFolder = useCallback(
    (folder) => {
      history.push(
        createProfileAttachmentsPath(
          profileIdentifier,
          folder.attachmentIdentifier,
        ),
      );
    },
    [history, profileIdentifier],
  );

  const openFolderInNewTab = (folder) => {
    window.open(
      `#${createProfileAttachmentsPath(
        profileIdentifier,
        folder.attachmentIdentifier,
      )}`,
    );
  };

  const moveFileOrFolder = useCallback(
    (attachment) => {
      dispatch(
        openModal('SelectPatientFolder', {
          context:"profile",
          onMove: (destinationFolderId) => {
            dispatch(
              moveProfileAttachment(
                attachment,
                destinationFolderId,
              ),
            );
          },
        }),
      );
    },
    [dispatch],
  );

  const handleAttachmentClick = (attachment) => {
    if (attachment.type === PatientAttachmentType.FILE_GDRIVE) {
      // TODO: check property name for file url when backend will be done
      if (attachment.fileUrl) {
        window.open(attachment.fileUrl, '_blank', 'noopener,noreferrer');
      } else {
        dispatch(showGlobalErrorAlert());
      }
    } else {
      openAttachmentPreview(attachment);
    }
  };

  const handleGooglePickerChange = ({ docs }) => {
    if (docs?.length > 0) {
      for (const { name, url, mimeType } of docs) {
        dispatch(
          PatientDetailsActions.createPatientAttachmentReference(
            patientIdentifier,
            name,
            url,
            mimeType,
            PatientAttachmentType.FILE_GDRIVE,
            folderIdentifier ?? null,
          ),
        );
      }
    }
  };

  const downloadAllFiles = useCallback(async () => {
    let timeout = 0;
    attachments.map(async ({ attachmentIdentifier, fileName }) => {
      timeout += 500;
      setTimeout(async () => {
        const { data } = await getMemoPatientAttachment(attachmentIdentifier);
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.append(link);
        link.click();
      }, timeout);
    });
  }, [attachments]);

  return {
    dispatch,
    handleAttachmentClick,
    handleCreateFolderClick,
    attachmentsSources,
    currentPatientAttachments: attachments,
    folders,
    attachmentsLoading,
    deleteAttachment,
    attachmentFileInputReference: inputRef,
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
    dropzone: {
      getRootProps,
      getInputProps,
      isDragActive,
    },
    downloadAllFiles,
    downloadAttachment,
    getMemoPatientAttachment,
    profileTaskAttachments,
    renamePatientTaskAttachment,
    deletePatientTaskAttachment,
    downloadPatientTaskAttachment,
  };
};

export default useInitializeAttachmentsSectionHooks;
