import { identity, memoizeWith, range } from 'ramda';
import React, { useCallback, useState } from 'react';
import { useAsync } from 'react-use';
import { downloadSignedDocument } from '../../../api/organization-api';
import {
  AttachmentPreviewContent,
  AttachmentPreviewDialog,
  AttachmentPreviewHeader,
  AttachmentPreviewHeaderAnchor,
  AttachmentPreviewHeaderButton,
  AttachmentPreviewHeaderIconContainer,
  AttachmentPreviewHeaderLabel,
  AttachmentPreviewHeaderSection,
  StyledPdfDocument,
  StyledPdfPage,
} from '../../../components/taskView/NewTaskDrawer.AttachmentPreview.Styled';
import DownloadIcon from '../../../img/download.svg';

const memoizedDownloadSignedDocument = memoizeWith(identity, () =>
  downloadSignedDocument(),
);

const BaaPreview = React.memo(({ isPreviewOpen, hidePreview }) => {
  const [numberOfPdfPages, setNumberOfPdfPages] = useState(0);

  const onPdfLoadSuccess = useCallback(({ numPages }) => {
    setNumberOfPdfPages(numPages);
  }, []);

  const data = useAsync(async () => {
    try {
      const rawBase64Data = await new Promise((resolve, reject) =>
        memoizedDownloadSignedDocument()
          .then(documentBlob => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result);
            };
            reader.readAsDataURL(documentBlob);
          })
          .catch(reject),
      );

      return rawBase64Data.replace(/^data:[^:]*;base64,/, '');
    } catch {
      return null;
    }
  }, []);

  const fileSource =
    data.value && !data.loading
      ? `data:application/pdf;base64, ${data.value}`
      : null;

  return (
    <AttachmentPreviewDialog
      open={isPreviewOpen && !data.loading}
      onClose={hidePreview}
      fullWidth
    >
      <AttachmentPreviewHeader>
        <AttachmentPreviewHeaderSection
          direction="column"
          alignItems="flex-start"
        >
          <AttachmentPreviewHeaderLabel>
            Business Associate Agreement
          </AttachmentPreviewHeaderLabel>
        </AttachmentPreviewHeaderSection>
        <AttachmentPreviewHeaderSection
          direction="row"
          justify="center"
          alignItems="center"
        >
          <AttachmentPreviewHeaderAnchor
            download="Business-Associate-Agreement.pdf"
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
          <AttachmentPreviewHeaderButton onClick={hidePreview} big>
            &times;
          </AttachmentPreviewHeaderButton>
        </AttachmentPreviewHeaderSection>
      </AttachmentPreviewHeader>
      <AttachmentPreviewContent>
        <StyledPdfDocument file={fileSource} onLoadSuccess={onPdfLoadSuccess}>
          {range(0, numberOfPdfPages).map(pageIndex => (
            <StyledPdfPage key={pageIndex} pageNumber={pageIndex + 1} />
          ))}
        </StyledPdfDocument>
      </AttachmentPreviewContent>
    </AttachmentPreviewDialog>
  );
});

export default BaaPreview;
