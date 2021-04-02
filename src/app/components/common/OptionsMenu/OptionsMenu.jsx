import React, { useRef, useState } from 'react';
import {
  arrayOf,
  bool,
  func,
  node,
  number,
  oneOf,
  shape,
  string,
} from 'prop-types';
import { ClickAwayListener, Popper } from '@material-ui/core';
import zIndex from 'styles/z-index';
import { StyledButton, MenuContainer, MenuOptionButtom } from './styled';

const OptionsMenu = ({
  isDisabled,
  disablePortal,
  placement,
  children,
  width,
  options,
}) => {
  const assignMemberButtonReference = useRef(null);
  const [isOpen, openPopover] = useState(false);

  return (
    <>
      <StyledButton
        type="button"
        ref={assignMemberButtonReference}
        disabled={isDisabled}
        onClick={event => {
          event.stopPropagation();
          openPopover(true);
        }}
      >
        {children}
      </StyledButton>
      <Popper
        anchorEl={assignMemberButtonReference?.current}
        placement={placement}
        disablePortal={disablePortal}
        open={isOpen}
        onClose={event => {
          event.stopPropagation();
          openPopover(false);
        }}
        style={{
          zIndex: zIndex.optionsMenu,
        }}
      >
        {isOpen && (
          <ClickAwayListener onClickAway={() => openPopover(false)}>
            <MenuContainer width={width}>
              {options?.map(({ name, onClick }) => (
                <MenuOptionButtom
                  key={name}
                  onClick={event => {
                    openPopover(false);
                    onClick(event);
                  }}
                  type="button"
                >
                  {name}
                </MenuOptionButtom>
              ))}
            </MenuContainer>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

OptionsMenu.propTypes = {
  children: node.isRequired,
  options: arrayOf(
    shape({
      name: string.isRequired,
      onClick: func,
    }),
  ).isRequired,
  isDisabled: bool,
  disablePortal: bool,
  placement: oneOf(['bottom-end', 'top-end']),
  width: number,
};

OptionsMenu.defaultProps = {
  isDisabled: false,
  disablePortal: false,
  placement: 'bottom-end',
  width: 180,
};

export default OptionsMenu;
