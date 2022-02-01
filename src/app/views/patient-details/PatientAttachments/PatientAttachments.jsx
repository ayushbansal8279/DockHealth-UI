/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import { useSelector } from 'react-redux';
import Loader from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import { RobotoTypography } from 'styles/theme';

import { Grid } from '@material-ui/core';
import { isFetchingPatientAttachmentsSelector } from 'selectors/patient-details-selectors';
import AttachmentPreview from 'components/attachments/AttachmentPreview/AttachmentPreview';
import AttachmentButton from 'components/attachments/AttachmentButton/AttachmentButton';
import AttachmentProgressBar from 'components/attachments/AttachmentProgressBar/AttachmentProgressBar';
import AddAttachmentButton from 'components/attachments/AddAttachmentButton/AddAttachmentButton';
import PatientAttachmentsLoader from '../PatientAttachmentsLoader/PatientAttachmentsLoader';
import { PatientAttachmentsWrapper, AttachmentFileInput } from './styled';
import initializeAttachmentsSectionHooks from './hooks';

const PatientAttachments = () => {
  const {
    attachmentsSources,
    currentPatientAttachments,
    attachmentsLoading,
    removePatientAttachment,
    attachmentFileInputReference,
    uploadProgress,
    currentlyUploadedAttachment,
    openAttachmentPreview,
    isAttachmentPreviewOpen,
    hideAttachmentPreview,
    previewedAttachment,
    dropzone: { getRootProps, getInputProps, isDragActive },
  } = initializeAttachmentsSectionHooks();

  const isFetching = useSelector(isFetchingPatientAttachmentsSelector);

  return (
    <PatientAttachmentsWrapper isDragActive={isDragActive}>
      {!isFetching ? (
        <>
          <AttachmentPreview
            attachment={previewedAttachment}
            attachmentsSources={attachmentsSources}
            hideAttachmentPreview={hideAttachmentPreview}
            isAttachmentPreviewOpen={isAttachmentPreviewOpen}
            attachmentsLoading={attachmentsLoading}
          />
          <AttachmentFileInput
            ref={attachmentFileInputReference}
            {...getInputProps()}
          />
          <Grid container>
            <Grid item xs={12}>
              <RobotoTypography condensed variant="h4" color="inherit">
                {isDragActive ? (
                  <span>Drop the files here ...</span>
                ) : (
                  <span>
                    Drag and drop files or documents here, or click + to select
                    files
                  </span>
                )}
              </RobotoTypography>
            </Grid>
            <Grid item xs={12}>
              <Spacing vertical={3} />
            </Grid>
            <Grid
              item
              xs={12}
              container
              alignContent="center"
              {...getRootProps({ style: { outline: 'none' } })}
              style={{ minHeight: '250px', alignContent: 'flex-start' }}
            >
              {attachmentsLoading ? (
                <>
                  <Loader />
                  <Spacing horizontal={3} />
                </>
              ) : (
                currentPatientAttachments.map(attachment => (
                  <AttachmentButton
                    attachment={attachment}
                    onClick={openAttachmentPreview}
                    onRemoveClick={removePatientAttachment}
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
          </Grid>
        </>
      ) : (
        <PatientAttachmentsLoader />
      )}
    </PatientAttachmentsWrapper>
  );
};

export default PatientAttachments;
