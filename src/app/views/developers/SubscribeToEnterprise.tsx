import { Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const SubscribeToEnterprise = () => {
  return (
    <Typography variant="body1">
      Please subscribe to the Enterprise plan in the{' '}
      <Link to="/settings/sbscriptions">Subscriptions Page</Link> to enable the
      developers mode.
    </Typography>
  );
};

export default SubscribeToEnterprise;
