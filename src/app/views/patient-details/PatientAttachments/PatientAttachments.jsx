/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import { useSelector } from 'react-redux';
import Loader from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import { RobotoTypography } from 'styles/theme';

import { Grid, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { isFetchingPatientAttachmentsSelector } from 'selectors/patient-details-selectors';
import PatientAttachmentsLoader from '../PatientAttachmentsLoader/PatientAttachmentsLoader';
import { PatientAttachmentsWrapper } from './styled';
import AttachmentPreview from '../../../components/task-drawer/AttachmentPreview/AttachmentPreview';
import initializeAttachmentsSectionHooks from './hooks';
import {
  AttachmentButton,
  RemoveAttachmentButtonContainer,
  AttachmentFileInput,
  AddAttachmentButton,
  UploadBarContainer,
  UploadBar,
  UploadBarOuterContainer,
} from '../../../components/task-drawer/AttachmentsSection/styled';
import { getIconFromContentType } from '../../../components/task-drawer/AttachmentsSection/helpers';

const renderAttachmentButton = ({
  openAttachmentPreview,
  removePatientAttachment,
}) => attachment => {
  const { attachmentIdentifier, fileName, contentType } = attachment;
  const IconComponent = getIconFromContentType({ contentType });

  return (
    <Tooltip key={attachmentIdentifier} title={fileName}>
      <AttachmentButton
        download={fileName}
        onClick={event => {
          event.stopPropagation();
          event.preventDefault();
          openAttachmentPreview(attachment);
        }}
      >
        <IconComponent color="inherit" fontSize="small" />
        <Spacing horizontal={2} />
        <RobotoTypography condensed variant="h4" weight="bold" noWrap>
          {fileName}
        </RobotoTypography>
        <RemoveAttachmentButtonContainer>
          <IconButton
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();
              removePatientAttachment({ attachmentIdentifier });
            }}
            size="small"
            color="inherit"
          >
            <Close fontSize="small" />
          </IconButton>
        </RemoveAttachmentButtonContainer>
      </AttachmentButton>
    </Tooltip>
  );
};

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
                currentPatientAttachments.map(
                  renderAttachmentButton({
                    openAttachmentPreview,
                    removePatientAttachment,
                  }),
                )
              )}
              {currentlyUploadedAttachment && (
                <>
                  <UploadBarOuterContainer>
                    <UploadBarContainer>
                      <UploadBar progress={uploadProgress} />
                    </UploadBarContainer>
                  </UploadBarOuterContainer>
                  <Spacing horizontal={4} />
                </>
              )}
              <AddAttachmentButton>
                <RobotoTypography condensed variant="h4" color="inherit">
                  +
                </RobotoTypography>
              </AddAttachmentButton>
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
