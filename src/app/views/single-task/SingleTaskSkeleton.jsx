/* eslint-disable react/no-array-index-key */
import { Box } from '@mui/material';
import { Skeleton } from '@mui/lab';
import React from 'react';

const SingleTaskSkeleton = ({ numberOfRows = 12 }) => (
  <>
    <Box mb={4} />
    {new Array(numberOfRows).fill().map((_, index) => (
      <div key={index}>
        <Skeleton variant="h1" width={700} height={40} />
        <Box mb={3} />
      </div>
    ))}
  </>
);

export default SingleTaskSkeleton;
