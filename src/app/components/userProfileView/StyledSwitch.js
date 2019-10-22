import React from 'react';
import { useFormContext } from 'react-hook-form';
import Switch from '@material-ui/core/Switch';

export default ({ name }) => {
  const { register, watch } = useFormContext();
  const checked = watch(name);

  return <Switch defaultChecked={checked} name={name} inputRef={register} />;
};
