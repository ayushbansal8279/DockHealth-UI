import { Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const StyledSwitch = withStyles({
  icon: {
    color: '#f1f1f1',
  },
  iconChecked: {
    color: '#2a4a70',
  },
  bar: {
    backgroundColor: '#221f1f',
    opacity: 0.26,
  },
  checked: {
    '&& + $bar': {
      backgroundColor: '#2a4a70',
      opacity: 0.5,
    },
  },
})(Switch);

export default ({ name }) => {
  const { register, watch } = useFormContext();
  const checked = watch(name);

  return (
    <StyledSwitch defaultChecked={checked} name={name} inputRef={register} />
  );
};

export const StyledSwitchUnbound = StyledSwitch;
