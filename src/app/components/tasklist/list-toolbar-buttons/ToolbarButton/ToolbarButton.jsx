import { Box } from '@mui/material';
import React from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import palette from 'styles/palette';
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
    onClick,
    children,
    tooltip,
    isOpen,
    active,
    hasPopover,
    disableButton,
  } = props;

  return (
    <Tooltip placement="top" title={tooltip}>
      <ToolbarButtonBoxContainer ref={reference}>
        <CustomizeButtonWrapper
          variant="text"
          onClick={onClick}
          size="large"
          active={+active}
          hasPopover={hasPopover}
          disableButton={disableButton}
        >
          {icon}
          <CustomizeButtonLabel
            variant="body1"
            component="span"
            active={+active}
            icon={icon}
          >
            {children}
          </CustomizeButtonLabel>
        </CustomizeButtonWrapper>
        {hasPopover && (
          <Box display="flex" width="35px" overflow="hidden">
            <CustomizeRotatableChevronButtonWrapper
              variant="text"
              onClick={onClick}
              size="large"
              active={+active}
              disableButton={disableButton}
            >
              <CustomizeRotatableChevronButtonLabel
                variant="body1"
                component="span"
              >
                <RotatableChevron rotated={isOpen} color={palette.white} />
              </CustomizeRotatableChevronButtonLabel>
            </CustomizeRotatableChevronButtonWrapper>
          </Box>
        )}
      </ToolbarButtonBoxContainer>
    </Tooltip>
  );
});

export default ToolbarButton;
