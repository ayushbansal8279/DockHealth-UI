import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import { setHeader } from 'actions/header-actions';
import GenericHeader from 'components/common/GenericHeader';
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
  const dispatch = useDispatch();

  useMount(() => {
    setHeader(dispatch)({
      layout: [
        {
          key: 'generic-header',
          component: <GenericHeader>Support</GenericHeader>,
        },
      ],
    });
  });

  return (
    <SupportViewContainer container>
      <SupportSectionViewVideos />
      <Grid item xs={12}>
        <Spacing vertical={6} />
      </Grid>
      <SupportSectionViewFaq />
    </SupportViewContainer>
  );
};

export default SupportSectionView;
