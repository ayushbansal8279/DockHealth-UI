import { ButtonBase, ButtonBaseProps } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import { useAdornedButtonClasses } from './styled';

interface AdornedButtonProps extends ButtonBaseProps {
  adornment?: React.ReactNode;
  children: React.ReactNode;
}

const AdornedButton = ({
  adornment,
  children,
  ...otherProps
}: AdornedButtonProps) => {
  const adornedButtonClasses = useAdornedButtonClasses();

  return (
    <ButtonBase
      className={clsx(adornedButtonClasses.root, otherProps?.className)}
      {...otherProps}
    >
      {adornment && (
        <div className={clsx(adornedButtonClasses.adornment)}>{adornment}</div>
      )}
      <MontserratTypography
        variant="h4"
        weight="500"
        className={clsx(adornedButtonClasses.label)}
      >
        {children}
      </MontserratTypography>
    </ButtonBase>
  );
};

export default AdornedButton;
