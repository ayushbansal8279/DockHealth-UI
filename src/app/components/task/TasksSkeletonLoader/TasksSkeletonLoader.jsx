/* eslint-disable react/no-array-index-key */
import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import Spacing from 'components/common/Spacing';
import React from 'react';
import { LoaderElement, LoaderRow } from './styled';

const TasksSkeletonLoader = ({ rows = 1 }) => {
  return (
    <>
      {new Array(rows).fill().map((_, rowIndex) => (
        <LoaderRow key={rowIndex}>
          <Box flex={1}>
            <LoaderElement />
          </Box>
          <Spacing horizontal={4} />
          <LoaderElement width={134} />
          <Spacing horizontal={4} />
          <LoaderElement width={87} />
          <Spacing horizontal={4} />
          <LoaderElement width={191} />
          <Spacing horizontal={4} />
          <Skeleton variant="circle" width={28} height={28} />
        </LoaderRow>
      ))}
    </>
  );
};

export default TasksSkeletonLoader;
