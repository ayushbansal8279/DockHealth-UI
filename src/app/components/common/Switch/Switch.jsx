import React from 'react';
import { useFormContext } from 'react-hook-form';
import { StyledSwitch } from './styled';

export const FormSwitch = ({ name }) => {
  const { register, watch } = useFormContext();
  const checked = watch(name);

  return (
    <StyledSwitch
      color="default"
      defaultChecked={checked}
      name={name}
      inputRef={register}
    />
  );
};

export default StyledSwitch;
