import { Box } from '@material-ui/core';
import React from 'react';
import { CustomizeButton } from './styled';

const ToolbarButton = React.forwardRef((props, reference) => {
  const { icon, color, onClick, children } = props;
  return (
    <CustomizeButton
      ref={reference}
      onClick={onClick}
      color={color}
      type="button"
    >
      {icon && (
        <>
          {icon}
          <Box mx={0.5} />
        </>
      )}
      {children}
    </CustomizeButton>
  );
});

export default ToolbarButton;
