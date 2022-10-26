import React from 'react';

import Loader from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import { RobotoTypography } from 'styles/theme';

import { Grid } from '@material-ui/core';
import AttachmentPreview from 'components/attachments/AttachmentPreview/AttachmentPreview';
import AttachmentButton from 'components/attachments/AttachmentButton/AttachmentButton';
import AttachmentProgressBar from 'components/attachments/AttachmentProgressBar/AttachmentProgressBar';
import AddAttachmentButton from 'components/attachments/AddAttachmentButton/AddAttachmentButton';
import initializeAttachmentsSectionHooks from './hooks';
import {
  AttachmentsContainer,
  AttachmentFileInput,
  DownloadAllLink,
} from './styled';

const AttachmentsSection = ({ disabled = false }) => {
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
  } = initializeAttachmentsSectionHooks();

  return (
    <AttachmentsContainer isDragActive={isDragActive}>
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
          <RobotoTypography condensed variant="h5" color="inherit">
            ATTACHMENTS
          </RobotoTypography>
        </Grid>
        <RobotoTypography condensed variant="h4" color="inherit">
          <Spacing vertical={2} />
          {isDragActive ? (
            <span>Drop the files here ...</span>
          ) : (
            <span>
              Drag and drop files or documents here, or click + to select files
            </span>
          )}
        </RobotoTypography>
        <Grid item xs={12}>
          <Spacing vertical={3} />
        </Grid>
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
            currentTaskAttachments.map(attachment => (
              <AttachmentButton
                key={attachment.attachmentIdentifier}
                attachment={attachment}
                onClick={openAttachmentPreview}
                onRemoveClick={removeTaskAttachment}
              />
            ))
          )}
          {currentlyUploadedAttachment && (
            <>
              <AttachmentProgressBar progress={uploadProgress} />
              <Spacing horizontal={4} />
            </>
          )}
          <AddAttachmentButton />
        </Grid>
        {currentTaskAttachments && currentTaskAttachments.length > 0 && (
          <Grid item xs={12}>
            <div>
              <DownloadAllLink onClick={downloadAllFiles}>
                Download All
              </DownloadAllLink>
            </div>
          </Grid>
        )}
      </Grid>
    </AttachmentsContainer>
  );
};

export default AttachmentsSection;
