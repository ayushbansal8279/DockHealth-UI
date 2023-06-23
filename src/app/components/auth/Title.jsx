import React from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';

export const Title = ({ children, variant }) => {
  return (
    <MontserratTypography
      variant={variant ?? 'h2'}
      weight="bold"
      align="center"
    >
      {children}
    </MontserratTypography>
  );
};

export const Subtitle = (props) => {
  const { children, variant, align } = props;

  return (
    <MontserratTypography
      variant={variant ?? 'h4'}
      weight="normal"
      align={align ?? 'center'}
      {...props}
    >
      {children}
    </MontserratTypography>
  );
};
