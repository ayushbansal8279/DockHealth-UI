import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useList } from 'react-use';

import {
  addTaskAttachment,
  removeTaskAttachment,
} from '../../actions/task-actions';
import useBoolean from '../../hooks/useBoolean';
import AttachmentPreview from './NewTaskDrawer.AttachmentPreview';
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
} from './NewTaskDrawer.AttachmentsList.Styled';

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
  dispatch,
  filterAddedAttachments,
  openAttachmentPreview,
  taskIdentifier,
}) => attachment => {
  const { attachmentIdentifier, fileIdentifier, fileName } = attachment;

  return (
    <AttachmentListEntry key={fileIdentifier}>
      <AttachmentListEntryLabel
        onClick={() => {
          openAttachmentPreview(attachment);
        }}
      >
        {fileName}
      </AttachmentListEntryLabel>
      <AttachmentListEntryRemove
        onClick={() => {
          removeTaskAttachment(taskIdentifier, attachmentIdentifier)(dispatch).then(() => {
            filterAddedAttachments(
              ({ attachmentIdentifier: existingAttachmentId }) =>
                attachmentIdentifier !== existingAttachmentId,
            );
          });
        }}
      >
        &times;
      </AttachmentListEntryRemove>
    </AttachmentListEntry>
  );
};

const getCurrentTask = () => {
  return useSelector(store => store.taskState.task);
}

export default ({ task, handleSubmit }) => {
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
    //save the task
    handleSubmit();

    const fileInputElement = attachmentFileInputReference.current;

    if (fileInputElement) {
      fileInputElement.dispatchEvent(new MouseEvent('click'));
    }
  }, []);

  const openAttachmentPreview = useCallback(
    attachment => {
      setPreviewedAttachment(attachment);
      showAttachmentPreview();
    },
    [showAttachmentPreview],
  );

  //const currTask = useSelector(store => store.taskState.task);
  // const taskIdentifier = currTask?.taskIdentifier;
  // const taskAttachments = currTask?.attachments || [];
  
  const taskIdentifier = task?.taskIdentifier;
  const taskAttachments = task?.attachments || [];
  

  useEffect(() => {
    if (taskIdentifier) {
      setAddedAttachments(taskAttachments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAddedAttachments, taskIdentifier]);

  const onAttachmentFileInputChange = useCallback(() => {
    const fileInputElement = attachmentFileInputReference.current;

    if (fileInputElement) {
      const [newAttachment] = fileInputElement.files;
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
  }, [pushAddedAttachment, dispatch, taskIdentifier]);

  return (
    <>
      <AttachmentPreview
        attachment={previewedAttachment}
        hideAttachmentPreview={hideAttachmentPreview}
        isAttachmentPreviewOpen={isAttachmentPreviewOpen}
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
          dispatch,
          filterAddedAttachments,
          openAttachmentPreview,
          taskIdentifier,
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
