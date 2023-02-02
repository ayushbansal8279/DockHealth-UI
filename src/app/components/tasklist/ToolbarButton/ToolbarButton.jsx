import { Box } from '@mui/material';
import React from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { CustomizeButton } from './styled';

const ToolbarButton = React.forwardRef((props, reference) => {
  const {
    icon,
    color,
    onClick,
    children,
    tooltip,
    disableButton = false,
  } = props;
  return (
    <Tooltip placement="top" title={tooltip}>
      <CustomizeButton
        ref={reference}
        onClick={onClick}
        color={color}
        type="button"
        disableButton={disableButton}
      >
        {icon && (
          <>
            {icon}
            <Box mx={0.5} />
          </>
        )}
        {children}
      </CustomizeButton>
    </Tooltip>
  );
});

export default ToolbarButton;
