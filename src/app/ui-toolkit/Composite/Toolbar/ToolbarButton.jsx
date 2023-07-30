import React, { forwardRef } from 'react';
import * as Sc from './styled';

const ToolbarButton = forwardRef(({ ...props }, reference) => {
  return <Sc.ToolbarButton ref={reference} {...props} />;
});

export default ToolbarButton;
