import { Typography } from '@mui/material';
import React from 'react';

const EmptyContent = () => {
  const message =
    "No credentials exist. Please click 'CREATE CREDENTIAL' to create your first credential.";
  return <Typography color="secondary">{message}</Typography>;
};

export default EmptyContent;
