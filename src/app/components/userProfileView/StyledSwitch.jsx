import { Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import palette from '../../palette';

const StyledSwitch = withStyles({
  icon: {
    color: palette.coolGrey4,
  },
  iconChecked: {
    color: palette.veryDarkBlue,
  },
  bar: {
    backgroundColor: palette.veryDarkBlue,
    opacity: 0.26,
  },
  checked: {
    '&& + $bar': {
      backgroundColor: palette.veryDarkBlue,
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
