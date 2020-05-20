import React from 'react';

import CubesLoader from 'components/common/CubesLoader';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import { RobotoTypography } from 'styles/theme';

import { Grid, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import UniversalTooltipContainer from 'components/common/UniversalTooltipContainer';
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
    <UniversalTooltipContainer label={fileName}>
      <AttachmentButton
        download={fileName}
        onClick={() => {
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
    </UniversalTooltipContainer>
  );
};

const AtttachmentsSection = ({ selectedTask, parentFormSubmit }) => {
  const {
    attachmentsSources,
    currentTaskAttachments,
    attachmentsLoading,
    removeTaskAttachment,
    onAddAttachmentButtonClicked,
    onAttachmentFileInputChange,
    attachmentFileInputReference,
    uploadProgress,
    currentlyUploadedAttachment,
    openAttachmentPreview,
    isAttachmentPreviewOpen,
    hideAttachmentPreview,
    previewedAttachment,
  } = initializeAttachmentsSectionHooks({ parentFormSubmit });

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
        onChange={onAttachmentFileInputChange}
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
        <Grid item xs={12} container alignContent="center">
          {attachmentsLoading ? (
            <>
              <CubesLoader color={palette.coolGrey2} size={40} />
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
          {currentlyUploadedAttachment ? (
            <UploadBarOuterContainer>
              <UploadBarContainer>
                <UploadBar progress={uploadProgress} />
              </UploadBarContainer>
            </UploadBarOuterContainer>
          ) : (
            <AddAttachmentButton
              onClick={onAddAttachmentButtonClicked}
              type="button"
            >
              <RobotoTypography condensed variant="h4" color="inherit">
                +
              </RobotoTypography>
            </AddAttachmentButton>
          )}
        </Grid>
      </Grid>
    </AttachmentsContainer>
  );
};

export default AtttachmentsSection;
