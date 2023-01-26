import React, { useRef } from 'react';
import { useUpdate } from 'react-use';
import { useBoolean } from 'hooks/useBoolean';
import zIndex from 'styles/z-index';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import { Box, ClickAwayListener, Popper } from '@mui/material';
import { Button } from './styled';

const TaskItemPopover = React.forwardRef(
  (
    {
      children,
      content,
      contentWidth = 'auto',
      fullWidth,
      disabled,
      placement = 'bottom-end',
    },
    reference,
  ) => {
    const internalElementReference = useRef(null);
    const elementReference = reference || internalElementReference;
    const forceUpdate = useUpdate();

    const [isPopoverOpen, openPopover, closePopover, togglePopover] =
      useBoolean();

    return (
      <>
        <Button
          fullWidth={fullWidth}
          type="button"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            togglePopover();
          }}
          ref={elementReference}
        >
          {typeof children === 'function'
            ? children({ isPopoverOpen })
            : children}
        </Button>
        {isPopoverOpen && (
          <ClickAwayListener onClickAway={closePopover}>
            <Popper
              style={{ zIndex: zIndex.taskPopover }}
              anchorEl={elementReference?.current}
              placement={placement}
              open={isPopoverOpen}
              onClose={closePopover}
            >
              <Box width={contentWidth}>
                <PopoverCard>
                  {typeof content === 'function'
                    ? content({
                        openPopover,
                        closePopover,
                        togglePopover,
                        resetPosition: forceUpdate,
                      })
                    : content}
                </PopoverCard>
              </Box>
            </Popper>
          </ClickAwayListener>
        )}
      </>
    );
  },
);

export default TaskItemPopover;
