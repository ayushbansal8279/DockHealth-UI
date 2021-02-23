import moment from 'moment';
import { always, cond, equals, range, startsWith, T } from 'ramda';
import React, { useCallback, useState } from 'react';
import DownloadIcon from 'img/download.svg';
import {
  AttachmentPreviewAudio,
  AttachmentPreviewContent,
  AttachmentPreviewDialog,
  AttachmentPreviewFlexContainer,
  AttachmentPreviewHeader,
  AttachmentPreviewHeaderAnchor,
  AttachmentPreviewHeaderButton,
  AttachmentPreviewHeaderIconContainer,
  AttachmentPreviewHeaderLabel,
  AttachmentPreviewHeaderSection,
  AttachmentPreviewHeaderSmallLabel,
  AttachmentPreviewImage,
  StyledPdfDocument,
  StyledPdfPage,
  UnsupportedFileContainer,
} from './styled';

const PREVIEW_DISPLAY_TYPES = {
  AUDIO: 'AUDIO',
  IMAGE: 'IMAGE',
  PDF: 'PDF',
  VIDEO: 'VIDEO',
  UNSUPPORTED: 'UNSUPPORTED',
};

export default React.memo(
  ({
    attachment,
    attachmentsSources,
    hideAttachmentPreview,
    isAttachmentPreviewOpen,
    attachmentsLoading,
  }) => {
    const [numberOfPdfPages, setNumberOfPdfPages] = useState(0);

    const onPdfLoadSuccess = useCallback(({ numPages }) => {
      setNumberOfPdfPages(numPages);
    }, []);

    const {
      attachmentIdentifier: currentAttachmentIdentifier,
      dateCreated,
      fileName,
      contentType: attachmentContentType,
    } = attachment || {};

    const displayType = cond([
      [startsWith('audio/'), always(PREVIEW_DISPLAY_TYPES.AUDIO)],
      [startsWith('image/'), always(PREVIEW_DISPLAY_TYPES.IMAGE)],
      [startsWith('video/'), always(PREVIEW_DISPLAY_TYPES.VIDEO)],
      [equals('application/pdf'), always(PREVIEW_DISPLAY_TYPES.PDF)],
      [T, always(PREVIEW_DISPLAY_TYPES.UNSUPPORTED)],
    ])(attachmentContentType || '');

    const attachmentSource = attachmentsSources.find(
      ({ attachmentIdentifier }) =>
        attachmentIdentifier === currentAttachmentIdentifier,
    );
    const fileSource = attachmentSource?.fileSource;

    const formattedDateCreated = dateCreated
      ? moment(dateCreated).format('MMM D, YYYY [at] h:mma')
      : '';

    return (
      <AttachmentPreviewDialog
        open={isAttachmentPreviewOpen && !attachmentsLoading}
        onClose={hideAttachmentPreview}
        fullWidth
      >
        <AttachmentPreviewHeader>
          <AttachmentPreviewHeaderSection
            direction="column"
            alignItems="flex-start"
          >
            <AttachmentPreviewHeaderLabel>
              {fileName}
            </AttachmentPreviewHeaderLabel>
            <AttachmentPreviewHeaderSmallLabel>
              {formattedDateCreated}
            </AttachmentPreviewHeaderSmallLabel>
          </AttachmentPreviewHeaderSection>
          <AttachmentPreviewHeaderSection
            direction="row"
            justify="center"
            alignItems="center"
          >
            <AttachmentPreviewHeaderAnchor
              download={fileName}
              href={fileSource}
            >
              <AttachmentPreviewHeaderIconContainer>
                <img src={DownloadIcon} alt="Download" />
              </AttachmentPreviewHeaderIconContainer>
              <AttachmentPreviewHeaderLabel>
                Download
              </AttachmentPreviewHeaderLabel>
            </AttachmentPreviewHeaderAnchor>
          </AttachmentPreviewHeaderSection>
          <AttachmentPreviewHeaderSection direction="row" justify="flex-end">
            <AttachmentPreviewHeaderButton onClick={hideAttachmentPreview} big>
              &times;
            </AttachmentPreviewHeaderButton>
          </AttachmentPreviewHeaderSection>
        </AttachmentPreviewHeader>
        <AttachmentPreviewContent>
          {displayType === PREVIEW_DISPLAY_TYPES.IMAGE && (
            <AttachmentPreviewFlexContainer>
              <AttachmentPreviewImage alt="Attachment" src={fileSource} />
            </AttachmentPreviewFlexContainer>
          )}
          {displayType === PREVIEW_DISPLAY_TYPES.AUDIO && (
            <AttachmentPreviewFlexContainer>
              <AttachmentPreviewAudio controls src={fileSource} />
            </AttachmentPreviewFlexContainer>
          )}
          {displayType === PREVIEW_DISPLAY_TYPES.PDF && (
            <StyledPdfDocument
              file={fileSource}
              onLoadSuccess={onPdfLoadSuccess}
            >
              {range(0, numberOfPdfPages).map(pageIndex => (
                <StyledPdfPage key={pageIndex} pageNumber={pageIndex + 1} />
              ))}
            </StyledPdfDocument>
          )}
          {displayType === PREVIEW_DISPLAY_TYPES.UNSUPPORTED && (
            <UnsupportedFileContainer>
              Preview is not available for this file.
            </UnsupportedFileContainer>
          )}
        </AttachmentPreviewContent>
      </AttachmentPreviewDialog>
    );
  },
);
