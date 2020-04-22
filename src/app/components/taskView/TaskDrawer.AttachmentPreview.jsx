import moment from 'moment';
import {
  always,
  cond,
  equals,
  identity,
  memoizeWith,
  range,
  startsWith,
  T,
} from 'ramda';
import React, { useCallback, useState } from 'react';
import { useAsync } from 'react-use';
import { getTaskAttachment } from 'api/task-api';
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
} from './TaskDrawer.AttachmentPreview.Styled';

const PREVIEW_DISPLAY_TYPES = {
  AUDIO: 'AUDIO',
  IMAGE: 'IMAGE',
  PDF: 'PDF',
  VIDEO: 'VIDEO',
  UNSUPPORTED: 'UNSUPPORTED',
};

const getMemoTaskAttachment = memoizeWith(identity, attachmentIdentifier =>
  attachmentIdentifier
    ? getTaskAttachment(attachmentIdentifier)
    : Promise.reject(),
);

const handleBase64Read = ({
  attachment,
  attachmentIdentifier,
  setFileMimeType,
  addingTaskOrSubtask,
  attachmentContentType,
}) => async () => {
  setFileMimeType('');

  const fileDataPromise = addingTaskOrSubtask
    ? Promise.resolve({ data: attachment })
    : getMemoTaskAttachment(attachmentIdentifier);

  try {
    const rawBase64Data = await fileDataPromise.then(
      ({ data: responseData }) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            setFileMimeType(
              attachmentContentType ??
                reader.result.replace(/^data:([^;]+);.+$/, '$1'),
            );

            resolve(reader.result);
          };

          reader.addEventListener('error', reject);

          reader.readAsDataURL(responseData);
        }),
    );

    return rawBase64Data.replace(/^data:[^;]*;base64,/, '');
  } catch {
    return null;
  }
};

export default React.memo(
  ({
    attachment,
    hideAttachmentPreview,
    isAttachmentPreviewOpen,
    addingTaskOrSubtask,
  }) => {
    const [numberOfPdfPages, setNumberOfPdfPages] = useState(0);
    const [fileMimeType, setFileMimeType] = useState('');

    const onPdfLoadSuccess = useCallback(({ numPages }) => {
      setNumberOfPdfPages(numPages);
    }, []);

    const {
      attachmentIdentifier,
      dateCreated,
      fileName,
      name,
      contentType: attachmentContentType,
    } = attachment || {};

    const data = useAsync(
      handleBase64Read({
        addingTaskOrSubtask,
        attachmentContentType,
        setFileMimeType,
        attachment,
        attachmentIdentifier,
      }),
      [attachmentIdentifier ?? name],
    );

    const displayType = cond([
      [startsWith('audio/'), always(PREVIEW_DISPLAY_TYPES.AUDIO)],
      [startsWith('image/'), always(PREVIEW_DISPLAY_TYPES.IMAGE)],
      [startsWith('video/'), always(PREVIEW_DISPLAY_TYPES.VIDEO)],
      [equals('application/pdf'), always(PREVIEW_DISPLAY_TYPES.PDF)],
      [T, always(PREVIEW_DISPLAY_TYPES.UNSUPPORTED)],
    ])(fileMimeType || '');

    const fileSource =
      data.value && !data.loading
        ? `data:${fileMimeType};base64, ${data.value}`
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
              {fileName ?? name}
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
              download={fileName ?? name}
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
