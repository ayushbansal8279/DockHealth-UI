import { Box } from '@material-ui/core';
import React from 'react';
import { Container, Title } from './styled';

const ChartTail = props => {
  const { name, children } = props;

  return (
    <Container>
      <Box display="flex" flexDirection="column" height="100%">
        <Title>{name}</Title>
        <Box flex={1}>{children}</Box>
      </Box>
    </Container>
  );
};

export default ChartTail;
