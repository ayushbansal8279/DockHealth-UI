import React from 'react';
import { StyledPopover, ButtonsWrapper, Button } from './styled';

const MenuPopover = ({ anchorEl, open, onClose, options }) => {
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
          <Button key={key} onClick={onClick} type="button">
            {label}
          </Button>
        ))}
      </ButtonsWrapper>
    </StyledPopover>
  );
};

export default MenuPopover;
