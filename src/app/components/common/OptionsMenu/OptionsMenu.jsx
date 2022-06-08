import React, { useRef, useState } from 'react';
import { prop } from 'ramda';
import {
  arrayOf,
  bool,
  elementType,
  func,
  node,
  oneOf,
  shape,
  string,
} from 'prop-types';
import {
  ClickAwayListener,
  Paper,
  Popper,
  MenuList,
  MenuItem,
  ListItemText,
  Box,
} from '@material-ui/core';
import zIndex from 'styles/z-index';
import Tooltip from 'components/common/Tooltip/Tooltip';
import palette from 'styles/palette';
import { StyledButton, useMenuStyles } from './styled';

const OptionsMenu = ({
  isDisabled,
  disablePortal,
  placement,
  children,
  footer: Footer,
  options,
  customButtonComponent: CustomButtonComponent,
}) => {
  const assignMemberButtonReference = useRef(null);
  const [isOpen, openPopover] = useState(false);
  const Button = CustomButtonComponent || StyledButton;
  const menuClasses = useMenuStyles();

  return (
    <>
      <Button
        type="button"
        ref={assignMemberButtonReference}
        disabled={isDisabled}
        onClick={event => {
          event.stopPropagation();
          openPopover(true);
        }}
      >
        {children}
      </Button>
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
            <Paper>
              <MenuList classes={menuClasses}>
                {options
                  ?.filter(prop('name'))
                  ?.map(
                    ({
                      name,
                      description,
                      color,
                      onClick,
                      disabled = false,
                      tooltipText,
                      component,
                    }) => (
                      <Tooltip
                        key={name}
                        title={tooltipText}
                        hideTooltip={!tooltipText}
                      >
                        <div>
                          <MenuItem
                            color={color}
                            onClick={event => {
                              openPopover(false);
                              onClick(event);
                            }}
                            disabled={disabled}
                          >
                            {component || (
                              <ListItemText
                                primary={name}
                                secondary={description}
                              />
                            )}
                          </MenuItem>
                        </div>
                      </Tooltip>
                    ),
                  )}
                {Footer && (
                  <Box borderBottom={`1px solid ${palette.coolGrey3}`} mb={1} />
                )}
                {Footer}
              </MenuList>
            </Paper>
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
      description: string,
      onClick: func,
      color: string,
      tooltipText: string,
      disabled: bool,
      component: elementType,
    }),
  ).isRequired,
  isDisabled: bool,
  disablePortal: bool,
  placement: oneOf(['bottom-end', 'top-end', 'left-start', 'bottom-start']),
  customButtonComponent: elementType,
};

OptionsMenu.defaultProps = {
  isDisabled: false,
  disablePortal: false,
  placement: 'bottom-end',
  customButtonComponent: null,
};

export default OptionsMenu;
