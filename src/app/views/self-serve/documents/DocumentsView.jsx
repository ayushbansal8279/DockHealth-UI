import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { setHeader } from '../../../actions/header-actions';
import useBoolean from '../../../hooks/useBoolean';
import BaaPreview from './DocumentsView.BaaPreview';
import {
  DocumentContainer,
  DocumentLink,
  DocumentsViewContainer,
  H2,
  H3,
  Title,
} from './DocumentsView.Styled';

const DocumentsView = () => {
  const dispatch = useDispatch();

  const { userProfile } = useSelector(store => {
    return {
      userProfile: store.userState.userProfile,
    };
  });
  const { organization } = useSelector(store => ({
    ...store.organizationState,
  }));

  const [isPreviewOpen, openPreview, hidePreview] = useBoolean(false);

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
          <Grid item sm={12} md={9}>
            <H2>Business Associate Agreement (BAA)</H2>
          </Grid>
          <Grid
            item
            sm={12}
            md={3}
            container
            direction="column"
            justify="center"
          >
            <DocumentLink onClick={openPreview}>Read BAA</DocumentLink>
            <H3>Signed on {baaSignedDate}</H3>
          </Grid>
        </DocumentContainer>
      )}
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
          {eulaAckDate && <H3>Agreed to on {eulaAckDate}</H3>}
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
          {eulaAckDate && <H3>Agreed to on {eulaAckDate}</H3>}
        </Grid>
      </DocumentContainer>
      <BaaPreview isPreviewOpen={isPreviewOpen} hidePreview={hidePreview} />
    </DocumentsViewContainer>
  );
};

export default DocumentsView;
