import { Grid } from '@mui/material';
import identity from 'ramda/src/identity';
import memoizeWith from 'ramda/src/memoizeWith';
import range from 'ramda/src/range';
import React, { useCallback, useState } from 'react';
import { useAsync } from 'react-use';
import { downloadSignedDocument } from 'api/organization-api';
import Loader from 'components/common/Loader/Loader';
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
} from 'components/attachments/AttachmentPreview/styled';
import DownloadIcon from 'img/download.svg';

const memoizedDownloadSignedDocument = memoizeWith(identity, () =>
  downloadSignedDocument(),
);

const downloadError = new Error(
  'Could not download the document, please try again later',
);

const BaaPreview = React.memo(({ isPreviewOpen, hidePreview }) => {
  const [numberOfPdfPages, setNumberOfPdfPages] = useState(0);

  const onPdfLoadSuccess = useCallback(({ numPages }) => {
    setNumberOfPdfPages(numPages);
  }, []);

  const data = useAsync(async () => {
    const rawBase64Data = await new Promise((resolve, reject) =>
      memoizedDownloadSignedDocument()
        .then((documentBlob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          if (documentBlob.size === 0) {
            reject(downloadError);
          } else {
            reader.readAsDataURL(documentBlob);
          }
        })
        .catch(() => reject(downloadError)),
    );

    return rawBase64Data.replace(/^data:[^:]*;base64,/, '');
  }, []);

  const fileSource =
    data.value && !data.loading
      ? `data:application/pdf;base64, ${data.value}`
      : null;

  return (
    <AttachmentPreviewDialog
      open={isPreviewOpen}
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
            disabled={data.error || data.loading}
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
        {data.loading && (
          <Grid container justifyContent="center" alignItems="center">
            <Loader />
          </Grid>
        )}
        {!data.loading && !data.error && (
          <StyledPdfDocument file={fileSource} onLoadSuccess={onPdfLoadSuccess}>
            {range(0, numberOfPdfPages).map((pageIndex) => (
              <StyledPdfPage key={pageIndex} pageNumber={pageIndex + 1} />
            ))}
          </StyledPdfDocument>
        )}
        {data.error && (
          <Grid container justifyContent="center" alignItems="center">
            {data.error?.message}
          </Grid>
        )}
      </AttachmentPreviewContent>
    </AttachmentPreviewDialog>
  );
});

export default BaaPreview;
