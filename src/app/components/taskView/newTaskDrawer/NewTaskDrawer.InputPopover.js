import { Popover, Popper, ClickAwayListener } from '@material-ui/core';
import { bool, func, node, shape, object } from 'prop-types';
import React from 'react';
import { useCss } from 'react-use';
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
  closePopover,
  children,
  popupStyle,
}) => {
  const widthValue =
    popupStyle?.width ||
    `${anchorElement.current?.getBoundingClientRect().width}px` ||
    {};

  const popoverClassName = useCss({
    '&&': {
      border: 0,
      marginTop: '0.5rem',
      width: widthValue,
    },
  });

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
  closePopover: func.isRequired,
  children: node,
};

InputPopover.defaultProps = {
  children: null,
};

export default InputPopover;
