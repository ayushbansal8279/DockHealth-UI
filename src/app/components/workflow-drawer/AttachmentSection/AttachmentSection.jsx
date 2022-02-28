import React, { useState, useRef, useCallback } from 'react';
import { isEmpty } from 'ramda';
import { useDropzone } from 'react-dropzone';
import * as WorkflowApi from 'api/workflow-api';
import {
  workflowIdentifierSelector,
  workflowAttachmentsSelector,
} from 'selectors/workflow-drawer-selectors';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import * as WorkflowActions from 'actions/workflow-actions';
import Loader from 'components/common/Loader/Loader';
import AddAttachmentButton from 'components/attachments/AddAttachmentButton/AddAttachmentButton';
import AttachmentPreview from 'components/attachments/AttachmentPreview/AttachmentPreview';
import AttachmentsDropzoneContainer from 'components/drawer-common/AttachmentsDropzoneContainer/AttachmentsDropzoneContainer';
import DrawerSection from 'components/drawer-common/DrawerSection/DrawerSection';
import { Box } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import AttachmentButton from 'components/attachments/AttachmentButton/AttachmentButton';
import AttachmentProgressBar from 'components/attachments/AttachmentProgressBar/AttachmentProgressBar';
import { useBoolean } from 'hooks/useBoolean';
import { addWorkflowAttachmentSuccess } from 'actions/workflow-actions';
import AlertMessages from 'alert/AlertMessages';
import { AttachmentFileInput } from './styled';

const AttachmentSection = () => {
  const attachmentFileInputReference = useRef(null);
  const dispatch = useDispatch();
  const [previewedAttachment, setPreviewedAttachment] = useState(null);
  const [attachmentSource, setAttachmentSource] = useState([]);
  const [
    isAttachmentPreviewOpen,
    showAttachmentPreview,
    hideAttachmentPreview,
  ] = useBoolean(false);
  const workflowIdentifier = useSelector(workflowIdentifierSelector);
  const attachments = useSelector(workflowAttachmentsSelector);
  const [
    attachmentLoading,
    setAttachmentLoading,
    unsetAttachmentLoading,
  ] = useBoolean(false);
  const [
    isUploadingAttachments,
    setUploadingAttachments,
    unsetUploadingAttachments,
  ] = useBoolean(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addAttachment = useCallback(
    files => {
      if (files && !isEmpty(files)) {
        const [newAttachment, ...restAttachments] = files;

        setUploadingAttachments();
        setUploadProgress(0);

        WorkflowApi.addWorkflowAttachment(
          workflowIdentifier,
          newAttachment,
          ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        )
          .then(addedAttachment => {
            unsetUploadingAttachments();
            dispatch(
              addWorkflowAttachmentSuccess(workflowIdentifier, addedAttachment),
            );
            dispatch(showGlobalAlert(AlertMessages.ATTACHMENT_ADDED));
            addAttachment(restAttachments);
          })
          .catch(error => {
            unsetUploadingAttachments();
            if (error.response && error.response.status === 413) {
              dispatch(
                showGlobalErrorAlert(
                  'File exceeded the allowed size of 100 MB',
                ),
              );
            } else {
              dispatch(
                showGlobalErrorAlert(
                  'Error in saving attachment. Please try again.',
                ),
              );
            }
          });
      }
    },
    [
      dispatch,
      setUploadingAttachments,
      unsetUploadingAttachments,
      workflowIdentifier,
    ],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: addAttachment,
  });

  const handleDeleteAttachment = attachmentIdentifier => {
    dispatch(
      WorkflowActions.deleteWorkflowAttachment(
        workflowIdentifier,
        attachmentIdentifier,
      ),
    );
  };

  const loadAttachmentContent = async attachment => {
    const { attachmentIdentifier, fileName, contentType } = attachment;
    const data = await WorkflowApi.getWorkflowAttachment(attachmentIdentifier);
    setAttachmentLoading();

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

    setAttachmentSource({
      attachmentIdentifier,
      fileName,
      fileSource,
      contentType,
    });
    unsetAttachmentLoading();
  };

  const handleAttachmentClick = attachment => {
    setPreviewedAttachment(attachment);
    loadAttachmentContent(attachment).then(() => {
      showAttachmentPreview();
    });
  };

  return (
    <DrawerSection title="Attachments">
      <AttachmentPreview
        attachment={previewedAttachment}
        attachmentsSources={attachmentSource ? [attachmentSource] : []}
        hideAttachmentPreview={hideAttachmentPreview}
        isAttachmentPreviewOpen={isAttachmentPreviewOpen}
        attachmentsLoading={attachmentLoading}
      />
      <AttachmentsDropzoneContainer
        isDragActive={isDragActive}
        {...getRootProps({ style: { outline: 'none' } })}
      >
        <AttachmentFileInput
          ref={attachmentFileInputReference}
          {...getInputProps()}
        />
        {attachmentLoading ? (
          <>
            <Loader />
            <Box mx={2} />
          </>
        ) : (
          attachments?.map(attachment => (
            <AttachmentButton
              key={attachment.attachmentIdentifier}
              attachment={attachment}
              onClick={handleAttachmentClick}
              onRemoveClick={handleDeleteAttachment}
            />
          ))
        )}
        {isUploadingAttachments && (
          <AttachmentProgressBar progress={uploadProgress} />
        )}
        <AddAttachmentButton />
      </AttachmentsDropzoneContainer>
    </DrawerSection>
  );
};

export default AttachmentSection;
