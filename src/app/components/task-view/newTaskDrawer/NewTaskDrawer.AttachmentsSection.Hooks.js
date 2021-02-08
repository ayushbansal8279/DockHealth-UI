/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState, useCallback, useRef, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { isEmpty } from 'ramda';

import { removeTaskAttachment, addTaskAttachment } from 'actions/task-actions';
import useBoolean from 'hooks/useBoolean';

import { getMemoTaskAttachment } from './NewTaskDrawer.AttachmentsSection.Utilities';

const initializeAttachmentsSectionHooks = () => {
  const attachmentFileInputReference = useRef(null);

  const selectedTask = useSelector(store => store.taskState.selectedTask);

  const { attachments = [], taskIdentifier: selectedTaskIdentifier } =
    selectedTask || {};

  const [currentTaskAttachments, currentTaskAttachmentsDispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_ATTACHMENTS':
          return [...action.attachments];
        case 'ADD_ATTACHMENTS':
          return [...state, ...action.attachments];
        case 'REMOVE_ATTACHMENTS':
          return [
            ...state.filter(
              ({ attachmentIdentifier: currentAttachmentIdentifier }) =>
                action.attachmentIdentifier !== currentAttachmentIdentifier,
            ),
          ];
        default:
          return state;
      }
    },
    [],
  );

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

  const dispatch = useDispatch();

  const onAttachmentFileInputChange = useCallback(
    files => {
      if (files && !isEmpty(files)) {
        const [newAttachment, ...restAttachments] = files;

        setCurrentlyUploadedAttachment(newAttachment);
        setUploadProgress(0);
        addTaskAttachment(selectedTaskIdentifier, newAttachment, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        })(dispatch)
          .then(addedAttachment => {
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onAttachmentFileInputChange,
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
      ).then(downloadedAttachments => {
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
    ({ attachmentIdentifier }) => {
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
    attachment => {
      setPreviewedAttachment(attachment);
      loadAttachmentsContent({
        attachmentsToReload: [attachment],
      });
      showAttachmentPreview();
    },
    [loadAttachmentsContent, showAttachmentPreview],
  );

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
    dropzone: {
      getRootProps,
      getInputProps,
    },
  };
};

export default initializeAttachmentsSectionHooks;
