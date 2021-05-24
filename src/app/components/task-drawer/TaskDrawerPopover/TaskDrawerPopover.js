import React, { useRef } from 'react';
import useBoolean from 'hooks/useBoolean';
import { bool, node, oneOf } from 'prop-types';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import { StyledPopover, StyledButton } from './styled';

const TaskDrawerPopover = ({ disabled, placement, children, content }) => {
  const buttonReference = useRef(null);
  const [isPopoverOpen, openPopover, closePopover, togglePopover] = useBoolean(
    false,
  );

  return (
    <>
      <StyledButton
        type="button"
        ref={buttonReference}
        disabled={disabled}
        onClick={event => {
          event.stopPropagation();
          openPopover(true);
        }}
      >
        {children}
      </StyledButton>
      <StyledPopover
        anchorEl={buttonReference?.current}
        anchorOrigin={{
          vertical: placement,
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: placement === 'top' ? 'bottom' : 'top',
          horizontal: 'right',
        }}
        open={isPopoverOpen}
        onClose={event => {
          event.stopPropagation();
          closePopover();
        }}
        minWidth={buttonReference.current?.offsetWidth}
      >
        {isPopoverOpen && (
          <PopoverCard>
            {typeof content === 'function'
              ? content({
                  isPopoverOpen,
                  openPopover,
                  closePopover,
                  togglePopover,
                })
              : content}
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
  content: node.isRequired,
};

TaskDrawerPopover.defaultProps = {
  disabled: false,
  placement: 'bottom',
};

export default TaskDrawerPopover;
