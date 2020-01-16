import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';

import { setHeader } from '../../../actions/header-actions';
import {
  DocumentDescription,
  DocumentLink,
  DocumentsViewContainer,
  DocumentContainer,
  H2,
  H3,
  Title,
} from './DocumentsView.Styled';

const OPEN_AS_PDF_LABEL = 'Open as a PDF';

const DocumentsView = () => {
  const dispatch = useDispatch();

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

  const dummySignedDate = moment().format('ll');

  return (
    <DocumentsViewContainer direction="column" wrap="nowrap">
      <DocumentContainer item xs={12} container>
        <Grid item sm={12} md={9}>
          <DocumentDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            eget enim eu augue ullamcorper dignissim. Etiam turpis lorem,
            pellentesque nec nunc ac, aliquet dapibus tortor.
          </DocumentDescription>
          <H2>BAA</H2>
        </Grid>
        <Grid item sm={12} md={3} container direction="column" justify="center">
          <DocumentLink>{OPEN_AS_PDF_LABEL}</DocumentLink>
          <H3>Signed on {dummySignedDate}</H3>
        </Grid>
      </DocumentContainer>
      <DocumentContainer item xs={12} container>
        <Grid item sm={12} md={9}>
          <DocumentDescription>
            Vivamus vehicula rhoncus ultrices. Suspendisse laoreet orci nec sem
            suscipit iaculis. Morbi ligula ipsum, tincidunt quis felis id,
            tempor congue ipsum.
          </DocumentDescription>
          <H2>End User License Agreement</H2>
        </Grid>
        <Grid item sm={12} md={3} container direction="column" justify="center">
          <DocumentLink>{OPEN_AS_PDF_LABEL}</DocumentLink>
          <H3>Signed on {dummySignedDate}</H3>
        </Grid>
      </DocumentContainer>
      <DocumentContainer item xs={12} container>
        <Grid item sm={12} md={9}>
          <DocumentDescription>
            Pellentesque id venenatis metus. Morbi eget orci magna. Suspendisse
            potenti. Aliquam eros dolor, pellentesque vel rutrum quis, cursus
            finibus ligula.
          </DocumentDescription>
          <H2>Privacy Policy</H2>
        </Grid>
        <Grid item sm={12} md={3} container direction="column" justify="center">
          <DocumentLink>{OPEN_AS_PDF_LABEL}</DocumentLink>
          <H3>Signed on {dummySignedDate}</H3>
        </Grid>
      </DocumentContainer>
    </DocumentsViewContainer>
  );
};

export default DocumentsView;
