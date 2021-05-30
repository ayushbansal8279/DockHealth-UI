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
  isDisabled,
  placement,
  children,
  taskListIdentifiers,
  selectedMembers,
  fullWidth,
  onSelect,
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
        fullWidth={fullWidth}
        ref={assignMemberButtonReference}
        disabled={isDisabled}
        onClick={event => {
          event.stopPropagation();
          openPopover(true);
        }}
      >
        {children}
      </StyledButton>
      {isOpen && (
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
          <MultiAssignMembersList
            taskListIdentifiers={taskListIdentifiers}
            selectedMembers={selectedMembers}
            onSelect={onSelect}
            onError={() => openPopover(false)}
          />
        </StyledPopover>
      )}
    </>
  );
};

MultiAssignPopover.propTypes = {
  isDisabled: bool,
  placement: oneOf(['top', 'bottom']),
  children: node.isRequired,
  taskListIdentifiers: oneOfType([string, arrayOf(string)]),
  selectedMembers: arrayOf(
    shape({
      userIdentifier: string,
      firstName: string,
      lastName: string,
      initials: string,
      profileThumbnailPictureHash: string,
    }),
  ),
  fullWidth: bool,
  onSelect: func.isRequired,
};

MultiAssignPopover.defaultProps = {
  isDisabled: false,
  placement: 'bottom',
  fullWidth: false,
  taskListIdentifiers: '',
  selectedMembers: [],
};

export default MultiAssignPopover;
