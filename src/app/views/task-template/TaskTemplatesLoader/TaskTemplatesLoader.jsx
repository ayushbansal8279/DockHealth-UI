import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const TaskTemplatesLoader = () => {
  return (
    <>
      {Array.from({ length: 8 })
        .fill()
        .map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Box key={index} mb={2}>
            <Skeleton height={35} />
          </Box>
        ))}
    </>
  );
};

export default TaskTemplatesLoader;
