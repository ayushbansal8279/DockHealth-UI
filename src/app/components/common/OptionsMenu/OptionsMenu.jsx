import React, { useRef, useState } from 'react';
import prop from 'ramda/src/prop';
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
  MenuItem,
  ListItemText,
  Box,
} from '@mui/material';
import zIndex from 'styles/z-index';
import Tooltip from 'components/common/Tooltip/Tooltip';
import palette from 'styles/palette';
import { StyledButton, MenuList, OptionsMenuContainer } from './styled';

const OptionsMenu = ({
  isDisabled,
  disablePortal,
  placement,
  children,
  footer: Footer,
  options,
  customButtonComponent: CustomButtonComponent,
  onClose,
  open,
  setOptionActive,
}) => {
  const assignMemberButtonReference = useRef(null);
  const [isOpen, openPopover] = useState(false);
  const Button = CustomButtonComponent || StyledButton;

  return (
    <OptionsMenuContainer>
      <Button
        type="button"
        ref={assignMemberButtonReference}
        disabled={isDisabled}
        onClick={(event) => {
          event.stopPropagation();
          if (open) {
            openPopover(false);
            setOptionActive(false);
          } else {
            openPopover(true);
            setOptionActive(true);
          }
        }}
      >
        {children}
      </Button>
      <Popper
        anchorEl={assignMemberButtonReference?.current}
        placement={placement}
        disablePortal={disablePortal}
        open={isOpen}
        onClose={(event) => {
          event.stopPropagation();
          openPopover(false);
          setOptionActive(false);
        }}
        style={{
          zIndex: zIndex.optionsMenu,
        }}
      >
        {isOpen && (
          <ClickAwayListener
            mouseEvent="onMouseDown"
            touchEvent="onTouchStart"
            onClickAway={() => {
              openPopover(false);
              setOptionActive(false);
              if (onClose) onClose();
            }}
          >
            <Paper>
              <MenuList>
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
                            onClick={(event) => {
                              openPopover(false);
                              setOptionActive(false);
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
    </OptionsMenuContainer>
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
