import { ButtonBase, ButtonBaseProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';

const useAdornedButtonClasses = makeStyles({
  root: {
    backgroundColor: '#fff',
    border: '0.0625rem solid #e5e9f2',
    borderRadius: 0,
    height: '2.75rem',
    whiteSpace: 'nowrap',
  },
  label: {
    alignItems: 'center',
    color: '#ef8a23',
    fontSize: '1.25rem',
    display: 'flex',
    padding: '0 0.75rem',
  },
  adornment: {
    alignItems: 'center',
    borderRight: '0.0625rem solid #e5e9f2',
    color: '#00a2e5',
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
      <div className={clsx(adornedButtonClasses.label)}>{children}</div>
    </ButtonBase>
  );
};

export default AdornedButton;
