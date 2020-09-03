import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from './Input';

const InputWithContext = props => {
  const { register, errors } = useFormContext();
  const { name } = props;

  return <Input {...props} ref={register} error={errors?.[name]?.message} />;
};

export default InputWithContext;
