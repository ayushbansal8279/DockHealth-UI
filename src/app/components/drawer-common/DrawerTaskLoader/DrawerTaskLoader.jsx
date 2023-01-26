/* eslint-disable react/no-array-index-key */
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Spacing from 'components/common/Spacing';
import React from 'react';
import { LoaderElement, LoaderRow } from './styled';

const DrawerTaskLoader = ({ rows }) => {
  return (
    <div>
      <Spacing vertical={2} />
      {Array.from({ length: rows })
        .fill()
        .map((row, rowIndex) => (
          <LoaderRow key={rowIndex}>
            <Box flex={1}>
              <LoaderElement />
            </Box>
            <Spacing horizontal={5} />
            <Skeleton variant="circle" width={28} height={28} />
            <Spacing horizontal={5} />
            <LoaderElement width={19} />
          </LoaderRow>
        ))}
    </div>
  );
};

export default DrawerTaskLoader;
