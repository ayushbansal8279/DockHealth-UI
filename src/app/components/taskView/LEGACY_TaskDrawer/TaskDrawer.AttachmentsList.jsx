import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useList } from 'react-use';

import { addTaskAttachment, removeTaskAttachment } from 'actions/task-actions';
import useBoolean from 'hooks/useBoolean';
import AttachmentPreview from './TaskDrawer.AttachmentPreview';
import {
  AddAttachmentButton,
  AttachmentFileInput,
  AttachmentListEntry,
  AttachmentListEntryLabel,
  AttachmentListEntryRemove,
  UploadingFileContainer,
  UploadingFileCurrentProgress,
  UploadingFileLabel,
  UploadingFileProgressBar,
} from './TaskDrawer.AttachmentsList.Styled';

const acceptedFileFormats = [
  'application/pdf',
  'application/zip',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'audio/*',
  'image/*',
  'video/*',
  'text/html',
  'text/plain',
  'text/xml',
  'text/csv',
].join(', ');

const renderAttachmentListEntry = ({
  addingTaskOrSubtask,
  dispatch,
  filterAddedAttachments,
  openAttachmentPreview,
  taskIdentifier,
  newTaskAttachments,
  setNewTaskAttachments,
}) => attachment => {
  const { attachmentIdentifier, fileIdentifier, fileName, name } = attachment;

  return (
    <AttachmentListEntry key={fileIdentifier}>
      <AttachmentListEntryLabel
        onClick={() => {
          openAttachmentPreview(attachment);
        }}
      >
        {fileName ?? name}
      </AttachmentListEntryLabel>
      <AttachmentListEntryRemove
        onClick={() => {
          if (addingTaskOrSubtask) {
            setNewTaskAttachments(
              newTaskAttachments.filter(
                existingAttachment => attachment !== existingAttachment,
              ),
            );
            filterAddedAttachments(
              existingAttachment => attachment !== existingAttachment,
            );
          } else {
            removeTaskAttachment(
              taskIdentifier,
              attachmentIdentifier,
            )(dispatch).then(() => {
              filterAddedAttachments(
                ({ attachmentIdentifier: existingAttachmentId }) =>
                  attachmentIdentifier !== existingAttachmentId,
              );
            });
          }
        }}
      >
        &times;
      </AttachmentListEntryRemove>
    </AttachmentListEntry>
  );
};

export default ({
  task,
  handleSubmit,
  addingTaskOrSubtask,
  newTaskAttachments,
  setNewTaskAttachments,
}) => {
  const attachmentFileInputReference = useRef(null);
  const dispatch = useDispatch();
  const [
    addedAttachments,
    {
      push: pushAddedAttachment,
      set: setAddedAttachments,
      filter: filterAddedAttachments,
    },
  ] = useList([]);
  const [
    isAttachmentPreviewOpen,
    showAttachmentPreview,
    hideAttachmentPreview,
  ] = useBoolean(false);
  const [previewedAttachment, setPreviewedAttachment] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [
    currentlyUploadedAttachment,
    setCurrentlyUploadedAttachment,
  ] = useState(null);

  const onAttachmentButtonClicked = useCallback(() => {
    handleSubmit();

    const fileInputElement = attachmentFileInputReference.current;

    if (fileInputElement) {
      fileInputElement.dispatchEvent(new MouseEvent('click'));
    }
  }, [handleSubmit]);

  const openAttachmentPreview = useCallback(
    attachment => {
      setPreviewedAttachment(attachment);
      showAttachmentPreview();
    },
    [showAttachmentPreview],
  );

  const taskIdentifier = task?.taskIdentifier;
  const taskAttachments = task?.attachments || [];

  useEffect(() => {
    setAddedAttachments(taskAttachments);
    setNewTaskAttachments([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAddedAttachments, taskIdentifier]);

  const onAttachmentFileInputChange = useCallback(() => {
    const fileInputElement = attachmentFileInputReference.current;

    if (fileInputElement) {
      const [newAttachment] = fileInputElement.files;

      if (addingTaskOrSubtask) {
        pushAddedAttachment(newAttachment);
        setNewTaskAttachments([...newTaskAttachments, newAttachment]);
      } else {
        setCurrentlyUploadedAttachment(newAttachment);
        setUploadProgress(0);
        addTaskAttachment(taskIdentifier, newAttachment, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        })(dispatch)
          .then(addedAttachment => {
            pushAddedAttachment(addedAttachment);
            setCurrentlyUploadedAttachment(null);
          })
          .catch(() => {
            setCurrentlyUploadedAttachment(null);
          });
      }
    }
  }, [
    addingTaskOrSubtask,
    pushAddedAttachment,
    setNewTaskAttachments,
    newTaskAttachments,
    taskIdentifier,
    dispatch,
  ]);

  return (
    <>
      <AttachmentPreview
        attachment={previewedAttachment}
        hideAttachmentPreview={hideAttachmentPreview}
        isAttachmentPreviewOpen={isAttachmentPreviewOpen}
        addingTaskOrSubtask={addingTaskOrSubtask}
      />
      <AttachmentFileInput
        ref={attachmentFileInputReference}
        onChange={onAttachmentFileInputChange}
        accept={acceptedFileFormats}
      />
      <AddAttachmentButton onClick={onAttachmentButtonClicked}>
        Add an attachment
      </AddAttachmentButton>
      {addedAttachments.map(
        renderAttachmentListEntry({
          addingTaskOrSubtask,
          dispatch,
          filterAddedAttachments,
          openAttachmentPreview,
          taskIdentifier,
          newTaskAttachments,
          setNewTaskAttachments,
        }),
      )}
      {currentlyUploadedAttachment && (
        <UploadingFileContainer>
          <UploadingFileLabel>
            {currentlyUploadedAttachment.name}
          </UploadingFileLabel>
          <UploadingFileProgressBar>
            <UploadingFileCurrentProgress uploadProgress={uploadProgress} />
          </UploadingFileProgressBar>
        </UploadingFileContainer>
      )}
    </>
  );
};
