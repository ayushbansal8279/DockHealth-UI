import React from 'react';
import { Box } from '@mui/material';
import { ProgressText, LinearProgress } from './styled';

const FileListItemProgressBar = (props) => {
  const { value } = props;

  return (
    <Box display="flex" mt={2} alignItems="center">
      <Box flexGrow={1}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <ProgressText>{Math.round(value)}%</ProgressText>
    </Box>
  );
};

export default FileListItemProgressBar;
