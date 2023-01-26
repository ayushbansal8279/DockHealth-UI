import { ButtonBaseProps } from '@mui/material';
import React from 'react';
import { ButtonBase, Label, Adornment } from './styled';

interface AdornedButtonProps extends ButtonBaseProps {
  adornment?: React.ReactNode;
  children: React.ReactNode;
}

const AdornedButton = ({
  adornment,
  children,
  ...otherProps
}: AdornedButtonProps) => {
  return (
    <ButtonBase {...otherProps}>
      {adornment && <Adornment>{adornment}</Adornment>}
      <Label variant="h4" weight="500">
        {children}
      </Label>
    </ButtonBase>
  );
};

export default AdornedButton;
