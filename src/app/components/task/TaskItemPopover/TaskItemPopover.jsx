import React, { useRef } from 'react';
import useBoolean from 'hooks/useBoolean';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import { Box, ClickAwayListener, Popper } from '@material-ui/core';
import { Button } from './styled';

const TaskItemPopover = ({
  children,
  content,
  contentWidth = 'auto',
  fullWidth,
  disabled,
  placement = 'bottom-end',
}) => {
  const elementReference = useRef(null);
  const [
    isPopoverOpen,
    openPopover,
    closePopover,
    togglePopover,
  ] = useBoolean();

  return (
    <>
      <Button
        fullWidth={fullWidth}
        type="button"
        disabled={disabled}
        onClick={event => {
          event.stopPropagation();
          togglePopover();
        }}
        ref={elementReference}
      >
        {children}
      </Button>
      {isPopoverOpen && (
        <ClickAwayListener onClickAway={closePopover}>
          <Popper
            style={{ zIndex: 2001 }}
            anchorEl={elementReference?.current}
            placement={placement}
            open={isPopoverOpen}
            onClose={closePopover}
          >
            <Box width={contentWidth}>
              <PopoverCard>
                {typeof content === 'function'
                  ? content({ openPopover, closePopover, togglePopover })
                  : content}
              </PopoverCard>
            </Box>
          </Popper>
        </ClickAwayListener>
      )}
    </>
  );
};

export default TaskItemPopover;
