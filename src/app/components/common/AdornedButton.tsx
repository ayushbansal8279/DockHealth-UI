import { ButtonBase, ButtonBaseProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import palette from 'app/palette';
import { MontserratTypography } from 'app/theme-montserrat';

const useAdornedButtonClasses = makeStyles({
  root: {
    backgroundColor: palette.white,
    border: `0.0625rem solid ${palette.coolGrey3}`,
    borderRadius: 0,
    height: '2.75rem',
    whiteSpace: 'nowrap',
  },
  label: {
    alignItems: 'center',
    color: palette.brightBlue,
    fontSize: '1.1875rem',
    display: 'flex',
    padding: '0 0.75rem',
  },
  adornment: {
    alignItems: 'center',
    borderRight: `0.0625rem solid ${palette.coolGrey3}`,
    color: palette.coolGrey1,
    display: 'flex',
    height: '2.75rem',
    justifyContent: 'center',
    padding: 0,
    width: '2.75rem',
  },
});

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
