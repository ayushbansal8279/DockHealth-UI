/* eslint-disable react/no-array-index-key */
import { Box } from '@mui/material';
import React from 'react';
import { AvatarLoader, LoaderText } from './styled';

const PatientNotesLoader = () => (
  <>
    {Array.from({ length: 3 })
      .fill()
      .map((_, index) => (
        <Box key={index} display="flex">
          <AvatarLoader />
          <Box m={2} />
          <div>
            <LoaderText width={547} />
            <Box p={0.7} />
            <LoaderText width={237} />
            <Box p={2} />
          </div>
        </Box>
      ))}
  </>
);

export default PatientNotesLoader;
