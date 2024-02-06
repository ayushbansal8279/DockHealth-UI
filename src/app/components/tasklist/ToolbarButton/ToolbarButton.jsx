import { Box } from '@mui/material';
import React, { useState } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
// import { CustomizeButton, SelectIcon, ImageContainer } from './styled';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import palette from 'styles/palette';
// import ArrowDefaultIcon from 'img/arrow-default.svg';
import {
  CustomizeButtonWrapper,
  ToolbarButtonBoxContainer,
  CustomizeButtonLabel,
  CustomizeRotatableChevronButtonWrapper,
  CustomizeRotatableChevronButtonLabel,
} from './styled';

const ToolbarButton = React.forwardRef((props, reference) => {
  const {
    icon,
    color,
    onClick,
    children,
    tooltip,
    searchValue,
    isOpen,
    active,
    focused,
    disableButton = false,
  } = props;
  return (
    // <Tooltip placement="top" title={tooltip}>
    //   <CustomizeButton
    //     ref={reference}
    //     onClick={onClick}
    //     color={color}
    //     type="button"
    //     disableButton={disableButton}
    //     wide={searchValue || focused}
    //   >
    //     <SelectIcon>
    //       {icon && (
    //         <>
    //           {icon}
    //           <Box mx={0.5} />
    //         </>
    //       )}
    //       {children}
    //     </SelectIcon>
    //     <ImageContainer>
    //       <img src={ArrowDefaultIcon} alt="arrow-image" />
    //     </ImageContainer>
    //   </CustomizeButton>
    // </Tooltip>
    <Tooltip placement="top" title={tooltip}>
      <ToolbarButtonBoxContainer ref={reference}>
        <CustomizeButtonWrapper
          variant="text"
          onClick={onClick}
          size="large"
          active={+active}
        >
          {icon}
          <CustomizeButtonLabel
            variant="body1"
            component="span"
            active={+active}
          >
            Customize
          </CustomizeButtonLabel>
        </CustomizeButtonWrapper>
        <Box display="flex" width="35px" overflow="hidden">
          <CustomizeRotatableChevronButtonWrapper
            variant="text"
            onClick={onClick}
            size="large"
            active={+active}
          >
            <CustomizeRotatableChevronButtonLabel
              variant="body1"
              component="span"
            >
              <RotatableChevron rotated={isOpen} color={palette.white} />
            </CustomizeRotatableChevronButtonLabel>
          </CustomizeRotatableChevronButtonWrapper>
        </Box>
      </ToolbarButtonBoxContainer>
    </Tooltip>
  );
});

export default ToolbarButton;
