import { Grid } from '@mui/material';
import React from 'react';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import Spacing from 'components/common/Spacing';
import styled from 'styled-components';
import SupportSectionViewFaq from './SupportView.Faq';
import SupportSectionViewVideos from './SupportView.Videos';

const SupportViewContainer = styled(Grid)`
  &&& {
    .MuiGrid-container {
      max-width: 1150px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
  }
`;

const SupportSectionView = () => {
  return (
    <ViewLayout header={<BasicLayoutHeader title="Support" />}>
      <SupportViewContainer container>
        <SupportSectionViewVideos />
        <Grid item xs={12}>
          <Spacing vertical={6} />
        </Grid>
        <SupportSectionViewFaq />
      </SupportViewContainer>
    </ViewLayout>
  );
};

export default SupportSectionView;
