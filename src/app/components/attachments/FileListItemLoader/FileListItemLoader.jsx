import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const FileListItemLoader = () => {
  return (
    <Box mb={0.5}>
      <Skeleton width="100%" height={35} />
    </Box>
  );
};

export default FileListItemLoader;
