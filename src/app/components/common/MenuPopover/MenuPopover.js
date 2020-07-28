import React from 'react';
import { StyledPopover, ButtonsWrapper, Button } from './styled';

const MenuPopover = ({
  anchorEl,
  open,
  onClose,
  options,
  onAfterOptionClick = null,
}) => {
  const handleOptionClick = (event, onClick) => {
    if (typeof onAfterOptionClick === 'function') onAfterOptionClick();

    onClick();
  };

  return (
    <StyledPopover
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={open}
      onClose={onClose}
      transitionDuration={0}
    >
      <ButtonsWrapper>
        {options?.map(({ key, label, onClick }) => (
          <Button
            key={key}
            onClick={event => handleOptionClick(event, onClick)}
            type="button"
          >
            {label}
          </Button>
        ))}
      </ButtonsWrapper>
    </StyledPopover>
  );
};

export default MenuPopover;
