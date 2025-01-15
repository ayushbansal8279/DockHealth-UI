import React, { useState, useRef, useCallback, useEffect } from 'react';
import isEmpty from 'ramda/src/isEmpty';
import { useDropzone } from 'react-dropzone';
import * as WorkflowApi from 'api/workflow-api';
import {
  workflowIdentifierSelector,
  workflowAttachmentsSelector,
  workflowAutofocusFieldSelector,
} from 'selectors/workflow-drawer-selectors';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import * as WorkflowActions from 'actions/workflow-actions';
import Loader from 'components/common/Loader/Loader';
import AddAttachmentButton from 'components/attachments/AddAttachmentButton/AddAttachmentButton';
import AttachmentPreview from 'components/attachments/AttachmentPreview/AttachmentPreview';
import AttachmentsDropzoneContainer from 'components/drawer-common/AttachmentsDropzoneContainer/AttachmentsDropzoneContainer';
import DrawerSection from 'components/drawer-common/DrawerSection/DrawerSection';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AttachmentButton from 'components/attachments/AttachmentButton/AttachmentButton';
import AttachmentProgressBar from 'components/attachments/AttachmentProgressBar/AttachmentProgressBar';
import { useBoolean } from 'hooks/useBoolean';
import { addWorkflowAttachmentSuccess } from 'actions/workflow-actions';
import AlertMessages from 'alert/AlertMessages';
import { OutfitTypography } from 'styles/theme';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import { ScanStatusText } from '../../task-drawer/AttachmentsSection/helpers';
import { ScanStatus } from '@/app/views/patient-details/PatientAttachments/helpers';
import { AttachmentFileInput } from './styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const AttachmentSection = ({ disabled }) => {
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
  const [attachmentLoading, setAttachmentLoading, unsetAttachmentLoading] =
    useBoolean(false);
  const [
    isUploadingAttachments,
    setUploadingAttachments,
    unsetUploadingAttachments,
  ] = useBoolean(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const attachmentReference = useRef(null);
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);

  useEffect(() => {
    if (
      attachmentReference.current &&
      autoFocusFieldName === WorkflowDrawerFieldNames.ATTACHMENT
    ) {
      attachmentReference.current.scrollIntoView(true);
    }
  }, [autoFocusFieldName]);

  const addAttachment = useCallback(
    (files) => {
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
          .then((addedAttachment) => {
            unsetUploadingAttachments();
            dispatch(
              addWorkflowAttachmentSuccess(workflowIdentifier, addedAttachment),
            );
            dispatch(showGlobalAlert(AlertMessages.ATTACHMENT_ADDED));
            addAttachment(restAttachments);
          })
          .catch(() => {
            unsetUploadingAttachments();
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

  const handleDeleteAttachment = (attachmentIdentifier) => {
    dispatch(
      WorkflowActions.deleteWorkflowAttachment(
        workflowIdentifier,
        attachmentIdentifier,
      ),
    );
  };

  const loadAttachmentContent = async (attachment) => {
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

  const handleAttachmentClick = (attachment) => {
    if (attachment?.scanStatus === ScanStatus.CLEAN) {
      setPreviewedAttachment(attachment);
      loadAttachmentContent(attachment).then(() => {
        showAttachmentPreview();
      });
    }
  };

  return (
    <DrawerSection title="Files">
      {!disabled && (
        <OutfitTypography condensed variant="h4" color={palette.lightGrey}>
          <Spacing vertical={1} />
          {isDragActive ? (
            <span>Drop the files here ...</span>
          ) : (
            <span>
              Drag and drop files or documents here, or click + to select files
            </span>
          )}
        </OutfitTypography>
      )}
      <Spacing vertical={3} />
      <div ref={attachmentReference} />
      <AttachmentPreview
        attachment={previewedAttachment}
        attachmentsSources={attachmentSource ? [attachmentSource] : []}
        hideAttachmentPreview={hideAttachmentPreview}
        isAttachmentPreviewOpen={isAttachmentPreviewOpen}
        attachmentsLoading={attachmentLoading}
      />
      {!disabled && (
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
            attachments?.map((attachment) => (
              <div style={{ textAlign: 'center' }}>
                <AttachmentButton
                  key={attachment.attachmentIdentifier}
                  attachment={attachment}
                  onClick={() => {
                    if (
                      attachment?.scanStatus === null ||
                      attachment?.scanStatus === ScanStatus.CLEAN
                    )
                    handleAttachmentClick(attachment);
                  }}
                  onRemoveClick={handleDeleteAttachment}
                />
                <p>
                  {
                    !attachment?.scanStatus || attachment?.scanStatus === 'IN_PROGRESS'
                      ? ScanStatusText.IN_PROGRESS
                      : ScanStatusText[attachment.scanStatus]
                  }
                </p>
              </div>
            ))
          )}
          {isUploadingAttachments && (
            <AttachmentProgressBar progress={uploadProgress} />
          )}
          <AddAttachmentButton />
        </AttachmentsDropzoneContainer>
      )}
      {disabled &&
        attachments?.map((attachment) => (
          <AttachmentButton
            key={attachment.attachmentIdentifier}
            attachment={attachment}
            onClick={handleAttachmentClick}
            onRemoveClick={handleDeleteAttachment}
          />
        ))}
    </DrawerSection>
  );
};

export default AttachmentSection;
