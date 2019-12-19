import moment from 'moment';
import always from 'ramda/es/always';
import cond from 'ramda/es/cond';
import equals from 'ramda/es/equals';
import identity from 'ramda/es/identity';
import memoizeWith from 'ramda/es/memoizeWith';
import range from 'ramda/es/range';
import startsWith from 'ramda/es/startsWith';
import T from 'ramda/es/T';
import React, { useCallback, useState } from 'react';
import { useAsync } from 'react-use';

import { getTaskAttachment } from '../../api/task-api';
import DownloadIcon from '../../img/download.svg';
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
} from './NewTaskDrawer.AttachmentPreview.Styled';

const PREVIEW_DISPLAY_TYPES = {
  AUDIO: 'AUDIO',
  IMAGE: 'IMAGE',
  PDF: 'PDF',
  VIDEO: 'VIDEO',
  UNSUPPORTED: 'UNSUPPORTED',
};

const getMemoTaskAttachment = memoizeWith(identity, attachmentId =>
  attachmentId ? getTaskAttachment(attachmentId) : Promise.reject(),
);

export default React.memo(
  ({ attachment, hideAttachmentPreview, isAttachmentPreviewOpen }) => {
    const [numberOfPdfPages, setNumberOfPdfPages] = useState(0);

    const onPdfLoadSuccess = useCallback(({ numPages }) => {
      setNumberOfPdfPages(numPages);
    }, []);

    const {
      attachmentId,
      contentType: attachmentContentType,
      dateCreated,
      fileName,
    } = attachment || {};

    const data = useAsync(async () => {
      try {
        const rawBase64Data = await new Promise((resolve, reject) =>
          getMemoTaskAttachment(attachmentId)
            .then(({ data: blobResponseData }) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result);
              };
              reader.readAsDataURL(blobResponseData);
            })
            .catch(reject),
        );

        return rawBase64Data.replace(/^data:[^:]*;base64,/, '');
      } catch {
        return null;
      }
    }, [attachmentId]);

    const displayType = cond([
      [startsWith('audio/'), always(PREVIEW_DISPLAY_TYPES.AUDIO)],
      [startsWith('image/'), always(PREVIEW_DISPLAY_TYPES.IMAGE)],
      [startsWith('video/'), always(PREVIEW_DISPLAY_TYPES.VIDEO)],
      [equals('application/pdf'), always(PREVIEW_DISPLAY_TYPES.PDF)],
      [T, always(PREVIEW_DISPLAY_TYPES.UNSUPPORTED)],
    ])(attachmentContentType || '');

    const fileSource =
      data.value && !data.loading
        ? `data:${attachmentContentType};base64, ${data.value}`
        : null;

    const formattedDateCreated = dateCreated
      ? moment(dateCreated).format('MMM D, YYYY [at] h:mma')
      : '';

    return (
      <AttachmentPreviewDialog
        open={isAttachmentPreviewOpen && !data.loading}
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
