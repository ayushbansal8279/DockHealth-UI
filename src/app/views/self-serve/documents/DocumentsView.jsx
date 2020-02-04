import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

  const { userProfile } = useSelector(store => {
    return {
      userProfile: store.userState.userProfile,
    };
  });
  const { organization } = useSelector(store => ({
    ...store.organizationState,
  }));

  const isUserAdmin = ['ADMIN', 'OWNER'].includes(userProfile.orgUserRole);

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

  const baaSignedDate =
    organization && organization.baaSignatureDateTime
      ? moment(organization.baaSignatureDateTime).format('ll')
      : '';

  const eulaAckDate =
    userProfile && userProfile.eulaAcknowledgedDateTime
      ? moment(userProfile.eulaAcknowledgedDateTime).format('ll')
      : '';

  return (
    <DocumentsViewContainer>
      {isUserAdmin && (
        <DocumentContainer item xs={12} container>
          <Grid item sm={12} md={6}>
            <H2>Business Associate Agreement (BAA)</H2>
          </Grid>
          <Grid
            item
            sm={12}
            md={6}
            container
            direction="column"
            justify="center"
          >
            <DocumentLink onClick={onBaaDownloadClick}>
              Download PDF
            </DocumentLink>
            <H3>Signed on {baaSignedDate}</H3>
          </Grid>
        </DocumentContainer>
      )}
      <DocumentContainer item xs={12} container>
        <Grid item sm={12} md={6}>
          <H2>End User License Agreement (EULA)</H2>
        </Grid>
        <Grid item sm={12} md={6} container direction="column" justify="center">
          <DocumentLink
            href="https://www.dock.health/end-user-license-agreement"
            target="_blank"
          >
            Read EULA
          </DocumentLink>
          {eulaAckDate && <H3>Agreed to on {eulaAckDate}</H3>}
        </Grid>
      </DocumentContainer>
      <DocumentContainer item xs={12} container>
        <Grid item sm={12} md={6}>
          <H2>Privacy Policy</H2>
        </Grid>
        <Grid item sm={12} md={6} container direction="column" justify="center">
          <DocumentLink
            href="https://www.dock.health/privacypolicy"
            target="_blank"
          >
            Read Privacy Policy
          </DocumentLink>
          {eulaAckDate && <H3>Agreed to on {eulaAckDate}</H3>}
        </Grid>
      </DocumentContainer>
    </DocumentsViewContainer>
  );
};

export default DocumentsView;
