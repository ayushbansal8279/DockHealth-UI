/* eslint-disable react-hooks/rules-of-hooks */
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useCallback, useRef } from 'react';

import {
  removeTaskAttachment,
  addTaskAttachment,
} from 'actions/task-actions';
import useBoolean from 'hooks/useBoolean';

import { getMemoTaskAttachment } from './NewTaskDrawer.AttachmentsSection.Utilities';

const initializeAttachmentsSectionHooks = ({ parentFormSubmit }) => {
  const attachmentFileInputReference = useRef(null);

  const { selectedTask } = useSelector(store => ({
    selectedTask: store.taskState.selectedTask,
  }));

  const { attachments = [], taskIdentifier: selectedTaskIdentifier } =
    selectedTask || {};

  const [currentTaskAttachments, setCurrentTaskAttachments] = useState([]);
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

  // const reloadAttachments = useCallback(
  //   ({ attachmentsToReload }) => {
  //     setAttachmentsLoading();

  //     Promise.all(
  //       attachmentsToReload.map(
  //         async ({ attachmentIdentifier, fileName, contentType }) => {
  //           const { data } = await getMemoTaskAttachment(attachmentIdentifier);

  //           const fileSource = await new Promise((resolve, reject) => {
  //             const reader = new FileReader();

  //             reader.onloadend = () => {
  //               // replace base64 type with content type from server
  //               resolve(
  //                 reader.result.replace(
  //                   /data:[^;]+;base64/,
  //                   `data:${contentType};base64`,
  //                 ),
  //               );
  //             };

  //             reader.addEventListener('error', reject);

  //             reader.readAsDataURL(data);
  //           });

  //           return {
  //             attachmentIdentifier,
  //             fileName,
  //             fileSource,
  //             contentType,
  //           };
  //         },
  //       ),
  //     ).then(downloadedAttachments => {
  //       unsetAttachmentsLoading();
  //       setAttachmentSources(downloadedAttachments);
  //       setCurrentTaskAttachments(attachmentsToReload);
  //     });
  //   },
  //   [setAttachmentsLoading, unsetAttachmentsLoading],
  // );

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
    setCurrentTaskAttachments(attachments);
    requestAnimationFrame(() => {
      // reloadAttachments({ attachmentsToReload: attachments });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTaskIdentifier]);

  const boundRemoveTaskAttachment = useCallback(
    ({ attachmentIdentifier }) => {
      removeTaskAttachment(
        selectedTaskIdentifier,
        attachmentIdentifier,
      )(dispatch).then(() => {
        setCurrentTaskAttachments(
          currentTaskAttachments.filter(
            ({ attachmentIdentifier: currentAttachmentIdentifier }) =>
              attachmentIdentifier !== currentAttachmentIdentifier,
          ),
        );
        // reloadAttachments({
        //   attachmentsToReload: currentTaskAttachments.filter(
        //     ({ attachmentIdentifier: currentAttachmentIdentifier }) =>
        //       attachmentIdentifier !== currentAttachmentIdentifier,
        //   ),
        // });
      });
    },
    [dispatch, selectedTaskIdentifier, currentTaskAttachments],
  );

  const onAddAttachmentButtonClicked = useCallback(
    event => {
      // console.log('on add attachment');
      if (!selectedTask || !selectedTask.taskIdentifier) {
        // console.log('saving task');
        parentFormSubmit();
      }

      event.preventDefault();
      event.stopPropagation();

      const fileInputElement = attachmentFileInputReference.current;

      if (fileInputElement) {
        fileInputElement.dispatchEvent(new MouseEvent('click'));
      }
    },
    [selectedTask, parentFormSubmit],
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

  const onAttachmentFileInputChange = useCallback(() => {
    const fileInputElement = attachmentFileInputReference.current;

    if (fileInputElement) {
      const [newAttachment] = fileInputElement.files;

      setCurrentlyUploadedAttachment(newAttachment);
      setUploadProgress(0);
      addTaskAttachment(selectedTaskIdentifier, newAttachment, {
        onUploadProgress: ({ loaded, total }) => {
          setUploadProgress(Math.round((loaded * 100) / total));
        },
      })(dispatch)
        .then(addedAttachment => {
          setCurrentlyUploadedAttachment(null);
          setCurrentTaskAttachments([
            ...currentTaskAttachments,
            addedAttachment,
          ]);
          // reloadAttachments({
          //   attachmentsToReload: [...currentTaskAttachments, addedAttachment],
          // });
        })
        .catch(() => {
          setCurrentlyUploadedAttachment(null);
        });
    }
  }, [dispatch, selectedTaskIdentifier, currentTaskAttachments]);

  return {
    attachmentsSources,
    currentTaskAttachments,
    attachmentsLoading,
    selectedTaskIdentifier,
    removeTaskAttachment: boundRemoveTaskAttachment,
    onAddAttachmentButtonClicked,
    onAttachmentFileInputChange,
    attachmentFileInputReference,
    uploadProgress,
    currentlyUploadedAttachment,
    openAttachmentPreview,
    isAttachmentPreviewOpen,
    hideAttachmentPreview,
    previewedAttachment,
  };
};

export default initializeAttachmentsSectionHooks;
