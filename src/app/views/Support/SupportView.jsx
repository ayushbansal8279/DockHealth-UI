import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import Spacing from 'components/common/Spacing';
import SupportSectionViewFaq from './SupportView.Faq';
import SupportSectionViewVideos from './SupportView.Videos';

const SupportViewContainer = withStyles({
  container: {
    maxWidth: 1150,
    margin: '0 auto',
    padding: '2rem 1rem',
  },
})(Grid);

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
