import React, { useRef, useState } from 'react';
import {
  arrayOf,
  func,
  node,
  oneOf,
  oneOfType,
  shape,
  string,
} from 'prop-types';
import { StyledPopover } from './styled';
import MultiAssignMembersList from './MultiAssignMembersList';

const MultiAssignPopover = ({
  placement,
  children,
  taskListIdentifiers,
  selectedMembers,
  onSelect,
}) => {
  const assignMemberButtonReference = useRef(null);
  const [isOpen, openPopover] = useState(false);

  return (
    <>
      <button
        type="button"
        ref={assignMemberButtonReference}
        onClick={event => {
          event.stopPropagation();
          openPopover(true);
        }}
      >
        {children}
      </button>
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
        open={isOpen}
        onClose={event => {
          event.stopPropagation();
          openPopover(false);
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
};

MultiAssignPopover.defaultProps = {
  placement: 'bottom',
};

export default MultiAssignPopover;
