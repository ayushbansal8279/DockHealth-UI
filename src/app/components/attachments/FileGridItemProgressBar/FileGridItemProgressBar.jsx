import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import { Container, ProgressText, useProgressStyles } from './styled';

const FileGridItemProgressBar = (props) => {
  const { value } = props;

  const classes = useProgressStyles();

  return (
    <Container>
      <Box position="relative">
        <CircularProgress
          classes={classes}
          variant="determinate"
          value={value}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          right={0}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <ProgressText>{Math.round(value)}%</ProgressText>
        </Box>
      </Box>
    </Container>
  );
};

export default FileGridItemProgressBar;
