import React from 'react';

import Loader from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import { RobotoTypography } from 'styles/theme';

import { Grid, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import Tooltip from 'components/common/Tooltip/Tooltip';
import initializeAttachmentsSectionHooks from './NewTaskDrawer.AttachmentsSection.Hooks';
import {
  AttachmentButton,
  AttachmentsContainer,
  RemoveAttachmentButtonContainer,
  AttachmentFileInput,
  AddAttachmentButton,
  UploadBarContainer,
  UploadBar,
  UploadBarOuterContainer,
} from './NewTaskDrawer.AttachmentsSection.Styled';
import AttachmentPreview from './NewTaskDrawer.AttachmentPreview';
import { getIconFromContentType } from './NewTaskDrawer.AttachmentsSection.Utilities';

const renderAttachmentButton = ({
  openAttachmentPreview,
  removeTaskAttachment,
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
              removeTaskAttachment({ attachmentIdentifier });
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

const AttachmentsSection = ({ selectedTask }) => {
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
    dropzone: { getRootProps, getInputProps },
  } = initializeAttachmentsSectionHooks();

  return (
    <AttachmentsContainer>
      <AttachmentPreview
        attachment={previewedAttachment}
        attachmentsSources={attachmentsSources}
        hideAttachmentPreview={hideAttachmentPreview}
        isAttachmentPreviewOpen={isAttachmentPreviewOpen}
        attachmentsLoading={attachmentsLoading}
        selectedTask={selectedTask}
      />
      <AttachmentFileInput
        ref={attachmentFileInputReference}
        {...getInputProps()}
      />
      <Grid container>
        <Grid item xs={12}>
          <RobotoTypography condensed variant="h5" color="inherit">
            ATTACHMENTS
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
        >
          {attachmentsLoading ? (
            <>
              <Loader />
              <Spacing horizontal={3} />
            </>
          ) : (
            currentTaskAttachments.map(
              renderAttachmentButton({
                openAttachmentPreview,
                removeTaskAttachment,
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
    </AttachmentsContainer>
  );
};

export default AttachmentsSection;
