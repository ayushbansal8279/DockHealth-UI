import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import { setHeader } from '../actions/header-actions';
import AdornedButton from '../components/common/AdornedButton';
import GenericHeader from '../components/common/GenericHeader';
import HelpfulTipsDialog from '../components/common/HelpfulTipsDialog';
import Spacing from '../components/common/Spacing';
import useBoolean from '../hooks/useBoolean';
import Lightbulb from '../img/lightbulb-blue.svg';
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

  const [areHelpfulTipsOpen, openHelpfulTips, closeHelpfulTips] = useBoolean(
    false,
  );

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
      <AdornedButton
        adornment={<img alt="Lightbulb" src={Lightbulb} />}
        onClick={openHelpfulTips}
        variant="contained"
        size="small"
      >
        HELPFUL TIPS TEST
      </AdornedButton>
      <SupportSectionViewVideos />
      <Grid item xs={12}>
        <Spacing vertical={6} />
      </Grid>
      <SupportSectionViewFaq />
      <HelpfulTipsDialog
        open={areHelpfulTipsOpen}
        closeDialog={closeHelpfulTips}
      >
        {[
          {
            content: <img alt="No content" src="https://http.cat/204" />,
            title: 'No content',
            description:
              'The server successfully processed the request and is not returning any content.',
          },
          {
            content: <img alt="No content" src="https://http.cat/200" />,
            title: 'OK',
            description:
              'Standard response for successful HTTP requests. The actual response will depend on the request method used.',
          },
          {
            content: <img alt="No content" src="https://http.cat/202" />,
            title: 'Accepted',
            description:
              'The request has been accepted for processing, but the processing has not been completed.',
          },
        ]}
      </HelpfulTipsDialog>
    </SupportViewContainer>
  );
};

export default SupportSectionView;
