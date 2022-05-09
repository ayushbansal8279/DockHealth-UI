import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';

const FileListItemLoader = () => {
  return (
    <Box mb={0.5}>
      <Skeleton width="100%" height={35} />
    </Box>
  );
};

export default FileListItemLoader;
