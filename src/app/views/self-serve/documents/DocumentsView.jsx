import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMount, useUnmount } from 'react-use';
import { setHeader } from '../../../actions/header-actions';
import { downloadSignedDocument } from '../../../api/organization-api';
import {
  DocumentContainer,
  DocumentLink,
  DocumentsViewContainer,
  H2,
  H3,
  Title,
} from './DocumentsView.Styled';

const downloadLink = ({ url }) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'baa.pdf');
  document.body.append(link);
  link.click();
  document.body.removeChild(link);
};

const DocumentsView = () => {
  const dispatch = useDispatch();

  const [baaObjectUrl, setBaaObjectUrl] = useState(null);

  useMount(() => {
    setHeader(dispatch)({
      backgroundColor: '#007cab',
      layout: [
        {
          key: 'title',
          component: (
            <div>
              <Title>Documents & Agreements</Title>
            </div>
          ),
          alignItems: 'center',
        },
      ],
    });
  });

  useUnmount(() => {
    if (baaObjectUrl) {
      URL.revokeObjectURL(baaObjectUrl);
    }
  });

  const onBaaDownloadClick = useCallback(() => {
    if (baaObjectUrl) {
      downloadLink({ url: baaObjectUrl });
      return;
    }

    downloadSignedDocument().then(documentBlob => {
      const newBaaObjectUrl = URL.createObjectURL(documentBlob);
      setBaaObjectUrl(newBaaObjectUrl);
      downloadLink({ url: newBaaObjectUrl });
    });
  }, [baaObjectUrl]);

  const dummySignedDate = moment().format('ll');

  return (
    <DocumentsViewContainer direction="column" wrap="nowrap">
      <DocumentContainer item xs={12} container>
        <Grid item sm={12} md={9}>
          <H2>Business Associate Agreement (BAA)</H2>
        </Grid>
        <Grid item sm={12} md={3} container direction="column" justify="center">
          <DocumentLink onClick={onBaaDownloadClick}>Download PDF</DocumentLink>
          <H3>Signed on {dummySignedDate}</H3>
        </Grid>
      </DocumentContainer>
      <DocumentContainer item xs={12} container>
        <Grid item sm={12} md={9}>
          <H2>End User License Agreement (EULA)</H2>
        </Grid>
        <Grid item sm={12} md={3} container direction="column" justify="center">
          <DocumentLink
            href="https://www.dock.health/end-user-license-agreement"
            target="_blank"
          >
            Read EULA
          </DocumentLink>
          <H3>Agreed to on {dummySignedDate}</H3>
        </Grid>
      </DocumentContainer>
      <DocumentContainer item xs={12} container>
        <Grid item sm={12} md={9}>
          <H2>Privacy Policy</H2>
        </Grid>
        <Grid item sm={12} md={3} container direction="column" justify="center">
          <DocumentLink
            href="https://www.dock.health/privacypolicy"
            target="_blank"
          >
            Read Privacy Policy
          </DocumentLink>
          <H3>Agreed to on {dummySignedDate}</H3>
        </Grid>
      </DocumentContainer>
    </DocumentsViewContainer>
  );
};

export default DocumentsView;
