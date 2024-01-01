import React from 'react';
import { OutfitTypography } from 'styles/theme-outfit';

export const Title = ({ children, variant }) => {
  return (
    <OutfitTypography
      variant={variant ?? 'h2'}
      weight="bold"
      align="center"
    >
      {children}
    </OutfitTypography>
  );
};

export const Subtitle = (props) => {
  const { children, variant, align } = props;

  return (
    <OutfitTypography
      variant={variant ?? 'h4'}
      weight="normal"
      align={align ?? 'center'}
      {...props}
    >
      {children}
    </OutfitTypography>
  );
};
