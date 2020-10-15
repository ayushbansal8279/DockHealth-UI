/* eslint-disable react/no-array-index-key */
import { Grid } from '@material-ui/core';
import React from 'react';
import { LoaderContainer, LoaderTile } from './styled';

const DashboardStatisticsLoader = () => (
  <LoaderContainer>
    <Grid container direction="row" justify="flex-end" spacing={2}>
      {new Array(3).fill().map((_, i) => (
        <Grid key={i} item xs={3}>
          <LoaderTile />
        </Grid>
      ))}
    </Grid>
  </LoaderContainer>
);

export default DashboardStatisticsLoader;
