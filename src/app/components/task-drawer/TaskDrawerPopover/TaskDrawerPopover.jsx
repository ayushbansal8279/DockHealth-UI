import { Box } from '@mui/material';
import React, { useRef } from 'react';
import { useUpdate } from 'react-use';
import { useBoolean } from 'hooks/useBoolean';
import { bool, node, oneOf } from 'prop-types';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import { StyledPopover, StyledButton } from './styled';

const TaskDrawerPopover = ({ disabled, placement, children, content, width }) => {
  const buttonReference = useRef(null);
  const [isPopoverOpen, openPopover, closePopover, togglePopover] =
    useBoolean(false);
  const forceUpdate = useUpdate();

  return (
    <>
      <StyledButton
        type="button"
        ref={buttonReference}
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          openPopover(true);
        }}
      >
        {children}
      </StyledButton>
      <StyledPopover
        anchorEl={buttonReference?.current}
        anchorOrigin={{
          vertical: placement || 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: placement === 'top' ? 'bottom' : 'top',
          horizontal: 'right',
        }}
        open={isPopoverOpen}
        onClose={(event) => {
          event.stopPropagation();
          closePopover();
        }}
        width={width}
      >
        {isPopoverOpen && (
          <PopoverCard>
            <Box width="auto" minWidth={buttonReference.current?.offsetWidth}>
              {typeof content === 'function'
                ? content({
                    isPopoverOpen,
                    openPopover,
                    closePopover,
                    togglePopover,
                    resetPosition: forceUpdate,
                  })
                : content}
            </Box>
          </PopoverCard>
        )}
      </StyledPopover>
    </>
  );
};

TaskDrawerPopover.propTypes = {
  disabled: bool,
  placement: oneOf(['top', 'bottom']),
  children: node.isRequired,
};

TaskDrawerPopover.defaultProps = {
  disabled: false,
  placement: 'bottom',
};

export default TaskDrawerPopover;
