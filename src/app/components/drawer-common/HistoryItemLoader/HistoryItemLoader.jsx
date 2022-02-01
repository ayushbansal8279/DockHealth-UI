import React from 'react';
import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Container } from './styled';

const HistoryItemLoader = () => (
  <Container>
    <Box flex={1}>
      <Skeleton height={18} width={200} />
      <Box mb="4px" />
      <Skeleton height={18} width={150} />
    </Box>
    <Skeleton width={65} />
  </Container>
);

export default HistoryItemLoader;
