import React, { useEffect, useRef } from 'react';

import Loader from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import { OutfitTypography } from 'styles/theme';

import { Button, Grid } from '@mui/material';
import AttachmentPreview from 'components/attachments/AttachmentPreview/AttachmentPreview';
import AttachmentButton from 'components/attachments/AttachmentButton/AttachmentButton';
import AttachmentProgressBar from 'components/attachments/AttachmentProgressBar/AttachmentProgressBar';
import AddAttachmentButton from 'components/attachments/AddAttachmentButton/AddAttachmentButton';
import initializeAttachmentsSectionHooks from './hooks';
import {
  AttachmentsContainer,
  AttachmentFileInput,
  Title,
  AttachmentStatusMessage,
} from './styled';
import { ScanStatus, ScanStatusText, UNSUPPORTED_WARNING_MESSAGE } from './helpers';
import { DrawerFieldEnum } from '@/app/helpers/task-drawer-helpers';
import { useDispatch } from 'react-redux';
import { openModal } from '@/app/modal/actions';
import { getPatientAttachments } from '@/app/api/patient-attachment-api';
import Tooltip from '../../common/Tooltip/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const AttachmentsSection = ({
  selectedTask,
  taskDrawerFocusField,
  disabled = false,
}) => {
  const {
    attachmentsSources,
    currentTaskAttachments,
    attachmentsLoading,
    removeTaskAttachment,
    attachmentFileInputReference,
    uploadProgress,
    currentlyUploadedAttachment,
    openAttachmentPreview,
    isAttachmentPreviewOpen,
    hideAttachmentPreview,
    previewedAttachment,
    dropzone: { getRootProps, getInputProps, isDragActive },
    downloadAllFiles,
    currentTaskAttachmentsDispatch,
  } = initializeAttachmentsSectionHooks(selectedTask);
  const dispatch = useDispatch();
  const attachmentRef = useRef(null);

  const downloadDisabled = currentTaskAttachments?.some(
    ({ scanStatus }) =>
      scanStatus &&
      !(scanStatus === ScanStatus.CLEAN ||
        scanStatus === ScanStatus.UNSUPPORTED),
  );
  const patientIdentifier = selectedTask?.patient?.patientIdentifier;

  useEffect(() => {
    if (
      attachmentRef.current &&
      taskDrawerFocusField === DrawerFieldEnum.ATTACHMENT
    ) {
      attachmentRef.current.scrollIntoView(true);
    }
  }, [taskDrawerFocusField]);

  const referenceAttachment = async () => {
    try {
      const patientAttachments = await getPatientAttachments(patientIdentifier);
  
      dispatch(
        openModal('PatientAttachmentReference', {
          attachmentList: patientAttachments,
          taskIdentifier: selectedTask?.identifier,
          currentTaskAttachmentsDispatch: currentTaskAttachmentsDispatch,
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const attachmentOptions = patientIdentifier
    ? [
        {
          label: 'Upload Local File',
          ...getRootProps({ style: { outline: 'none' } }),
        },
        {
          label: 'Reference File from Patient',
          onClick: referenceAttachment,
          disabled: !selectedTask?.patient,
        },
      ]
    : [];

  return (
    <AttachmentsContainer ref={attachmentRef} isDragActive={isDragActive}>
      <AttachmentPreview
        attachment={previewedAttachment}
        attachmentsSources={attachmentsSources}
        hideAttachmentPreview={hideAttachmentPreview}
        isAttachmentPreviewOpen={isAttachmentPreviewOpen}
        attachmentsLoading={attachmentsLoading}
      />
      <AttachmentFileInput
        disabled={disabled}
        ref={attachmentFileInputReference}
        {...getInputProps()}
      />
      <Grid container>
        <Grid item xs={12}>
          <Spacing vertical={3} />
          <Title>Files</Title>
        </Grid>
        {!disabled && (
          <OutfitTypography condensed variant="h4" color="inherit">
            <Spacing vertical={2} />
            {isDragActive ? (
              <span>Drop the files here ...</span>
            ) : (
              <span>
                Drag and drop files or documents here, or click + to select
                files
              </span>
            )}
          </OutfitTypography>
        )}
        <Grid item xs={12}>
          <Spacing vertical={2} />
        </Grid>
        {!disabled && (
          <Grid
            item
            xs={12}
            container
            alignContent="center"
            {...getRootProps({ style: { outline: 'none' } })}
          >
            {attachmentsLoading ? (
              <>
                <Loader />
                <Spacing horizontal={3} />
              </>
            ) : (
              currentTaskAttachments?.map((attachment) => (
                <div style={{ textAlign: 'center' }}>
                  <AttachmentButton
                    key={attachment?.attachmentIdentifier}
                    attachment={attachment}
                    onClick={() => {
                      if (
                        attachment?.scanStatus === null ||
                        attachment?.scanStatus === ScanStatus.CLEAN ||
                        attachment?.scanStatus === ScanStatus.UNSUPPORTED
                      )
                        openAttachmentPreview(attachment);
                    }}
                    onRemoveClick={removeTaskAttachment}
                    renameAttachmentDispatch={currentTaskAttachmentsDispatch}
                  />
                  <p>
                    {!attachment?.scanStatus ||
                    attachment?.scanStatus === ScanStatus.IN_PROGRESS ? (
                      ScanStatusText.IN_PROGRESS
                    ) : attachment?.scanStatus === ScanStatus.UNSUPPORTED ? (
                      <AttachmentStatusMessage>
                        {ScanStatusText.UNSUPPORTED}
                        <Tooltip title={UNSUPPORTED_WARNING_MESSAGE}>
                          <InfoOutlinedIcon
                            sx={{ color: 'error.main', cursor: 'pointer' }}
                          />
                        </Tooltip>
                      </AttachmentStatusMessage>
                    ) : (
                      ScanStatusText[attachment.scanStatus]
                    )}
                  </p>
                </div>
              ))
            )}
            {currentlyUploadedAttachment && (
              <>
                <AttachmentProgressBar progress={uploadProgress} />
                <Spacing horizontal={4} />
              </>
            )}
            <AddAttachmentButton attachmentOptions={attachmentOptions} />
          </Grid>
        )}
        {disabled &&
          currentTaskAttachments?.map((attachment) => (
            <div style={{ textAlign: 'center' }}>
              <AttachmentButton
                key={attachment?.attachmentIdentifier}
                attachment={attachment}
                onClick={() => {
                  if (
                    attachment?.scanStatus === null ||
                    attachment?.scanStatus === ScanStatus.CLEAN||
                    attachment?.scanStatus === ScanStatus.UNSUPPORTED
                  )
                    openAttachmentPreview(attachment);
                }}
                onRemoveClick={removeTaskAttachment}
              />
              {attachment?.scanStatus && (
                <p>{ScanStatusText[attachment?.scanStatus]}</p>
              )}
            </div>
          ))}
        {currentTaskAttachments?.length > 0 && (
          <Grid item xs={12}>
            <div>
              <Button
                variant="text"
                disabled={downloadDisabled}
                onClick={downloadAllFiles}
                sx={{ textTransform: 'none' }}
              >
                Download All
              </Button>
            </div>
          </Grid>
        )}
      </Grid>
    </AttachmentsContainer>
  );
};

export default AttachmentsSection;