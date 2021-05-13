import React from 'react';
import { Popper } from '@material-ui/core';
import { bool, node, shape, object } from 'prop-types';
import { StyledPopper } from './styled';

const InputPopover = ({
  anchorElement,
  isPopoverOpen,
  children,
  popupStyle,
}) => {
  const widthValue =
    popupStyle?.width || `${anchorElement.current?.offsetWidth}px`;

  return (
    <Popper
      width={widthValue}
      anchorEl={anchorElement?.current}
      placement="bottom-start"
      open={isPopoverOpen}
      style={{ zIndex: 100000 }}
    >
      <StyledPopper width={widthValue}>{children}</StyledPopper>
    </Popper>
  );
};

InputPopover.propTypes = {
  anchorElement: shape({
    current: object,
  }).isRequired,
  isPopoverOpen: bool.isRequired,
  children: node,
};

InputPopover.defaultProps = {
  children: null,
};

export default InputPopover;
