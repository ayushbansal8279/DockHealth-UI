import React, { useEffect, useRef, useState } from 'react';
import {
  arrayOf,
  bool,
  func,
  node,
  oneOf,
  oneOfType,
  shape,
  string,
} from 'prop-types';
import { StyledPopover, StyledButton } from './styled';
import MultiAssignMembersList from './MultiAssignMembersList';

const MultiAssignPopover = ({
  blockPopover,
  placement,
  children,
  taskListIdentifiers,
  selectedMembers,
  onSelect,
  onOpen,
  onClose,
}) => {
  const assignMemberButtonReference = useRef(null);
  const [isOpen, openPopover] = useState(false);

  useEffect(() => {
    if (isOpen) openPopover(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMembers]);

  return (
    <>
      <StyledButton
        type="button"
        ref={assignMemberButtonReference}
        onClick={event => {
          event.stopPropagation();
          openPopover(true);
          if (typeof onOpen === 'function') onOpen();
        }}
      >
        {children}
      </StyledButton>
      <StyledPopover
        anchorEl={assignMemberButtonReference?.current}
        anchorOrigin={{
          vertical: placement,
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: placement === 'top' ? 'bottom' : 'top',
          horizontal: 'right',
        }}
        open={isOpen && !blockPopover}
        onClose={event => {
          event.stopPropagation();
          openPopover(false);
          if (typeof onClose === 'function') onClose();
        }}
        width={assignMemberButtonReference.current?.offsetWidth}
      >
        <>
          {isOpen && (
            <MultiAssignMembersList
              taskListIdentifiers={taskListIdentifiers}
              selectedMembers={selectedMembers}
              onSelect={onSelect}
            />
          )}
        </>
      </StyledPopover>
    </>
  );
};

MultiAssignPopover.propTypes = {
  blockPopover: bool,
  placement: oneOf(['top', 'bottom']),
  children: node.isRequired,
  taskListIdentifiers: oneOfType([string, arrayOf(string)]).isRequired,
  selectedMembers: arrayOf(
    shape({
      userIdentifier: string,
      firstName: string,
      lastName: string,
      initials: string,
      profileThumbnailPictureHash: string,
    }),
  ).isRequired,
  onSelect: func.isRequired,
  onClose: func,
  onOpen: func,
};

MultiAssignPopover.defaultProps = {
  blockPopover: false,
  placement: 'bottom',
  onClose: null,
  onOpen: null,
};

export default MultiAssignPopover;
