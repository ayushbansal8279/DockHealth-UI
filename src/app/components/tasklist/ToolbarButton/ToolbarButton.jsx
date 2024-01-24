import { Box } from '@mui/material';
import React, { useState } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { CustomizeButton, SelectIcon, ImageContainer } from './styled';
import ArrowDefaultIcon from 'img/arrow-default.svg';

const ToolbarButton = React.forwardRef((props, reference) => {
  const {
    icon,
    color,
    onClick,
    children,
    tooltip,
    searchValue,
    focused,
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
        wide={searchValue || focused}
      >
        <SelectIcon>
          {icon && (
            <>
              {icon}
              <Box mx={0.5} />
            </>
          )}
          {children}
        </SelectIcon>
        <ImageContainer>
          <img src={ArrowDefaultIcon} alt="arrow-image" />
        </ImageContainer>
      </CustomizeButton>
    </Tooltip>
  );
});

export default ToolbarButton;
