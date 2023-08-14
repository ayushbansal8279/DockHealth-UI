import React from 'react';
import * as Sc from './styled';

export const Input = React.forwardRef(({ ...props }, ref) => (
  <Sc.Input
    ref={ref}
    {...props}
  />
));

export default Input;