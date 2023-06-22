import React from 'react';


export default function Box({ children, className, ...props }) {
  return (
    <div
      data-component="[ui-toolkit/Primitive/Box]"
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}
