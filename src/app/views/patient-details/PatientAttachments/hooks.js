/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { showGlobalErrorAlert } from 'alert/actions';
import { memoizeWith, identity, isEmpty } from 'ramda';
import * as PatientDetailsActions from 'actions/patient-details-actions';
import {
  patientSelector,
  patientFoldersSelector,
  patientAttachmentsSelector,
} from 'selectors/patient-details-selectors';
import { downloadPatientAttachment } from 'api/patient-attachment-api';
import { useBoolean } from 'hooks/useBoolean';
import { openModal } from 'modal/actions';
import { createPatientAttachmentsPath } from 'routing/helpers/paths';
import { PatientAttachmentType } from 'helpers/patient-details-helpers';

export const getMemoPatientAttachment = memoizeWith(
  identity,
  attachmentIdentifier =>
    attachmentIdentifier
      ? downloadPatientAttachment(attachmentIdentifier)
      : Promise.reject(),
);

const initializeAttachmentsSectionHooks = () => {
  const { folderIdentifier } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const patient = useSelector(patientSelector);
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

  const attachments = useSelector(patientAttachmentsSelector) || [];
  const folders = useSelector(patientFoldersSelector) || [];

  const [attachmentsSources, setAttachmentSources] = useState([]);
  const [
    attachmentsLoading,
    setAttachmentsLoading,
    unsetAttachmentsLoading,
  ] = useBoolean(false);

  const [
    currentlyUploadedAttachment,
    setCurrentlyUploadedAttachment,
  ] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [
    isAttachmentPreviewOpen,
    showAttachmentPreview,
    hideAttachmentPreview,
  ] = useBoolean(false);
  const [previewedAttachment, setPreviewedAttachment] = useState(null);

  const onAttachmentFileInputChange = useCallback(
    files => {
      if (files && !isEmpty(files)) {
        const [newAttachment, ...restAttachments] = files;

        setCurrentlyUploadedAttachment(newAttachment);
        setUploadProgress(0);

        dispatch(
          PatientDetailsActions.createPatientAttachment(
            patient?.patientIdentifier,
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
    [dispatch, patient, folderIdentifier],
  );

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop: onAttachmentFileInputChange,
  });

  const loadAttachmentsContent = useCallback(
    ({ attachmentsToReload }) => {
      setAttachmentsLoading();

      Promise.all(
        attachmentsToReload.map(
          async ({ attachmentIdentifier, fileName, contentType }) => {
            const { data } = await getMemoPatientAttachment(
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
      ).then(downloadedAttachments => {
        unsetAttachmentsLoading();
        setAttachmentSources(downloadedAttachments);
      });
    },
    [setAttachmentsLoading, unsetAttachmentsLoading],
  );

  const deleteAttachment = useCallback(
    identifier => {
      dispatch(
        PatientDetailsActions.deletePatientAttachment(
          patientIdentifier,
          identifier,
        ),
      );
    },
    [dispatch, patientIdentifier],
  );

  const openAttachmentPreview = useCallback(
    attachment => {
      setPreviewedAttachment(attachment);
      loadAttachmentsContent({
        attachmentsToReload: [attachment],
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
        onChange: name => {
          dispatch(
            PatientDetailsActions.createPatientAttachmentFolder(
              patientIdentifier,
              name,
              folderIdentifier,
            ),
          );
        },
      }),
    );
  };

  const renameAttachment = fileOrFolder => {
    dispatch(
      openModal('PatientFolder', {
        title: `Rename ${
          fileOrFolder.type === PatientAttachmentType.FOLDER ? 'folder' : 'file'
        }`,
        inputLabel: `${
          fileOrFolder.type === PatientAttachmentType.FOLDER ? 'Folder' : 'File'
        } name`,
        currentName: fileOrFolder.fileName,
        onChange: name => {
          dispatch(
            PatientDetailsActions.updatePatientAttachment(fileOrFolder, {
              fileName: name,
            }),
          );
        },
      }),
    );
  };

  const navigateToFolder = useCallback(
    folder => {
      history.push(
        createPatientAttachmentsPath(
          patientIdentifier,
          folder.attachmentIdentifier,
        ),
      );
    },
    [history, patientIdentifier],
  );

  const openFolderInNewTab = folder => {
    window.open(
      `#${createPatientAttachmentsPath(
        patientIdentifier,
        folder.attachmentIdentifier,
      )}`,
    );
  };

  const moveFileOrFolder = useCallback(
    attachment => {
      dispatch(
        openModal('SelectPatientFolder', {
          onMove: destinationFolderId => {
            dispatch(
              PatientDetailsActions.movePatientAttachment(
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

  const handleAttachmentClick = attachment => {
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
      docs.forEach(({ name, url, mimeType }) => {
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
      });
    }
  };

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
  };
};

export default initializeAttachmentsSectionHooks;
