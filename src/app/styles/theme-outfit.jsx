import { Typography } from '@mui/material';
import React from 'react';


export const OutfitTypography = ({
  weight = 'normal',
  textDecoration,
  ...props
}) => (
  <Typography {...props} style={{ ...textDecoration, fontWeight: weight }} />
);

// export default themeOutfit;
