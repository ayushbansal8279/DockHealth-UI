/* eslint-disable react/no-array-index-key */
import { Box } from '@material-ui/core';
import React from 'react';
import { AvatarLoader, LoaderText } from './styled';

const PatientAttachmentsLoader = () => (
  <>
    {new Array(3).fill().map((_, index) => (
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

export default PatientAttachmentsLoader;
