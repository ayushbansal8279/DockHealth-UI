import { Switch } from '@material-ui/core';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import palette from 'styles/palette';

const StyledSwitch = styled(Switch)`
  && {
    .MuiSwitch-thumb {
      background-color: ${props =>
        props.checked || props.defaultChecked
          ? palette.midnightBlue
          : palette.white};
    }

    .MuiSwitch-track {
      background-color: ${props =>
        props.checked || props.defaultChecked
          ? palette.midnightBlue
          : palette.coolGrey2};
    }
  }
`;

export default ({ name }) => {
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

export const StyledSwitchUnbound = StyledSwitch;
