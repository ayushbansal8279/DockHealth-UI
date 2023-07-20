import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const FileGridItemLoader = () => {
  return (
    <Box
      display="inline-block"
      mb="28px"
      mr="28px"
      overflow="hidden"
      borderRadius="14px"
    >
      <Skeleton width={203} height={160} />
    </Box>
  );
};

export default FileGridItemLoader;
