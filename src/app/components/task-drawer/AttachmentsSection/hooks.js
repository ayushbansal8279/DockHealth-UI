/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState, useCallback, useRef, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import isEmpty from 'ramda/src/isEmpty';
import { removeTaskAttachment, addTaskAttachment } from 'actions/task-actions';
import { useBoolean } from 'hooks/useBoolean';
import { userProfileSelector } from 'selectors/user-selectors';
import { showGlobalErrorAlert } from 'alert/actions';
import {
  getMemoTaskAttachment,
  acceptedFileTypes,
  isValidFileType,
  errorMessage,
} from './helpers';

const initializeAttachmentsSectionHooks = (selectedTask) => {
  const attachmentFileInputReference = useRef(null);
  const { attachments = [], taskIdentifier: selectedTaskIdentifier } =
    selectedTask || {};
  const currentUser = useSelector(userProfileSelector);

  const [currentTaskAttachments, currentTaskAttachmentsDispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_ATTACHMENTS': {
          return [...action.attachments];
        }
        case 'ADD_ATTACHMENTS': {
          return [...state, ...action.attachments];
        }
        case 'REMOVE_ATTACHMENTS': {
          return state.filter(
            ({ attachmentIdentifier: currentAttachmentIdentifier }) =>
              action.attachmentIdentifier !== currentAttachmentIdentifier,
          );
        }
        case 'RENAME_ATTACHMENT': {
          return state.map((attachment) => {
            if (
              attachment.attachmentIdentifier === action.attachmentIdentifier
            ) {
              return { ...attachment, fileName: action.newFileName };
            }
            return attachment;
          });
        }
        default: {
          return state;
        }
      }
    },
    [],
  );

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

  const dispatch = useDispatch();

  const onAttachmentFileInputChange = useCallback(
    (files) => {
      if (files && !isEmpty(files)) {
        const validFiles = files.filter((file) => {
          if (!isValidFileType(file)) {
            dispatch(showGlobalErrorAlert(`${file.name}: ${errorMessage}`));
            return false;
          }
          return true;
        });

        if (validFiles.length === 0) {
          return;
        }

        const [newAttachment, ...restAttachments] = validFiles;

        setCurrentlyUploadedAttachment(newAttachment);
        setUploadProgress(0);
        addTaskAttachment(selectedTaskIdentifier, newAttachment, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        })(dispatch)
          .then((addedAttachment) => {
            setCurrentlyUploadedAttachment(null);
            currentTaskAttachmentsDispatch({
              type: 'ADD_ATTACHMENTS',
              attachments: [addedAttachment],
            });
            onAttachmentFileInputChange(restAttachments);
          })
          .catch(() => {
            setCurrentlyUploadedAttachment(null);
            onAttachmentFileInputChange(restAttachments);
          });
      }
    },
    [selectedTaskIdentifier, dispatch, currentTaskAttachmentsDispatch],
  );

  const handleDropRejected = useCallback(
    (fileRejections) => {
      fileRejections.forEach(({ file }) => {
        dispatch(showGlobalErrorAlert(`${file.name}: ${errorMessage}`));
      });
    },
    [dispatch],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onAttachmentFileInputChange,
    onDropRejected: handleDropRejected,
    accept: acceptedFileTypes,
  });

  const loadAttachmentsContent = useCallback(
    ({ attachmentsToReload }) => {
      setAttachmentsLoading();

      Promise.all(
        attachmentsToReload.map(
          async ({ attachmentIdentifier, fileName, contentType }) => {
            const { data } = await getMemoTaskAttachment(attachmentIdentifier);

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

  useEffect(() => {
    currentTaskAttachmentsDispatch({
      type: 'SET_ATTACHMENTS',
      attachments,
    });

    requestAnimationFrame(() => {
      // reloadAttachments({ attachmentsToReload: attachments });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTaskIdentifier, currentTaskAttachmentsDispatch]);

  const boundRemoveTaskAttachment = useCallback(
    (attachmentIdentifier) => {
      removeTaskAttachment(
        selectedTaskIdentifier,
        attachmentIdentifier,
      )(dispatch).then(() => {
        currentTaskAttachmentsDispatch({
          type: 'REMOVE_ATTACHMENTS',
          attachmentIdentifier,
        });
      });
    },
    [selectedTaskIdentifier, dispatch, currentTaskAttachmentsDispatch],
  );

  const openAttachmentPreview = useCallback(
    (attachment) => {
      setPreviewedAttachment(attachment);
      loadAttachmentsContent({
        attachmentsToReload: [attachment],
      });
      showAttachmentPreview();
    },
    [loadAttachmentsContent, showAttachmentPreview],
  );

  const downloadAllFiles = useCallback(async () => {
    let timeout = 0;
    attachments.map(async ({ attachmentIdentifier, fileName }) => {
      timeout += 500;
      setTimeout(async () => {
        const { data } = await getMemoTaskAttachment(attachmentIdentifier);
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
    attachmentsSources,
    currentTaskAttachments,
    attachmentsLoading,
    selectedTaskIdentifier,
    removeTaskAttachment: boundRemoveTaskAttachment,
    attachmentFileInputReference,
    uploadProgress,
    currentlyUploadedAttachment,
    openAttachmentPreview,
    isAttachmentPreviewOpen,
    hideAttachmentPreview,
    previewedAttachment,
    currentUser,
    dropzone: {
      getRootProps,
      getInputProps,
      isDragActive,
    },
    downloadAllFiles,
    currentTaskAttachmentsDispatch,
  };
};

export default initializeAttachmentsSectionHooks;
