import React from 'react';
import { Box, LinearProgress } from '@mui/material';
import { ProgressText, useLinearProgressStyles } from './styled';

const FileListItemProgressBar = (props) => {
  const { value } = props;

  const classes = useLinearProgressStyles();

  return (
    <Box display="flex" mt={2} alignItems="center">
      <Box flexGrow={1}>
        <LinearProgress classes={classes} variant="determinate" value={value} />
      </Box>
      <ProgressText>{Math.round(value)}%</ProgressText>
    </Box>
  );
};

export default FileListItemProgressBar;
