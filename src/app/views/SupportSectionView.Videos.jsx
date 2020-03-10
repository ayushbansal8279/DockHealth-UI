import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';
import Spacing from '../components/common/Spacing';

const SupportVideosContainer = styled.div`
  display: grid;
  grid-gap: 3rem 1rem;
  grid-template-columns: repeat(3, 1fr);
`;

const SupportViewLink = styled.a`
  color: #007cab;
`;

const SupportVideo = styled.div`
  background-color: #c4c4c4;
  height: 15rem;
  min-height: 15rem;
  width: 100%;
`;

const testVideos = [
  {
    title: 'Test 1',
  },
  {
    title: 'Test 2',
  },
  {
    title: 'Test 3',
  },
  {
    title: 'Test 4',
  },
  {
    title: 'Test 5',
  },
];

const SupportSectionViewVideos = () => (
  <>
    <Grid container alignItems="center" justify="space-between" item xs={12}>
      <Typography variant="h2">
        <b>HOW TO VIDEOS</b>
      </Typography>
      <div>
        <Grid container direction="row">
          <Typography variant="body1">
            <SupportViewLink href="mailto:support@dock.health?Subject=Dock%20Support">
              support@dock.health
            </SupportViewLink>
          </Typography>
          <Spacing horizontal={4} />
          <Typography variant="body1">
            <SupportViewLink href="tel:857-302-0441">
              857-302-0441
            </SupportViewLink>
          </Typography>
        </Grid>
      </div>
    </Grid>
    <Grid item xs={12}>
      <Spacing vertical={4} />
    </Grid>
    <Grid item xs={12}>
      <SupportVideosContainer>
        {testVideos.map(({ title }) => (
          <div>
            <SupportVideo />
            <Typography variant="body1">
              <b>{title}</b>
            </Typography>
          </div>
        ))}
      </SupportVideosContainer>
    </Grid>
  </>
);

export default SupportSectionViewVideos;
