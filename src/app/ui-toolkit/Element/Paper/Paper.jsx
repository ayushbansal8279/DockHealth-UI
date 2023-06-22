import React from 'react';
import * as Sc from './styled';

export default function Paper({ children, ...props }) {
  return (
    <Sc.Paper
      data-component="[ui-toolkit/Paper]"
      {...props}
    >
      {children}
    </Sc.Paper>
  );
}