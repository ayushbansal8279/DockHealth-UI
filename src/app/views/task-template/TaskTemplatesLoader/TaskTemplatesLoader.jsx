import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';

const TaskTemplatesLoader = () => {
  return (
    <>
      {new Array(8).fill().map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={index} mb={2}>
          <Skeleton height={35} />
        </Box>
      ))}
    </>
  );
};

export default TaskTemplatesLoader;
