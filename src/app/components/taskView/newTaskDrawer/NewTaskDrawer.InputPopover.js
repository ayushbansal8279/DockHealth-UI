import { Popper } from '@material-ui/core';
import { bool, node, shape, object } from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StyledPopper = styled.div`
  margin-top: 0.5rem;
  width: ${({ width }) => width};
  background: white;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
`;

const InputPopover = ({
  anchorElement,
  isPopoverOpen,
  children,
  popupStyle,
}) => {
  const widthValue =
    popupStyle?.width ||
    `${anchorElement.current?.getBoundingClientRect().width}px` ||
    {};

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
