import React from 'react';
import {
  StyledPopover,
  ButtonsWrapper,
  PrimaryButton,
  SecondaryButton,
} from './styled';

const MenuPopover = ({
  anchorEl,
  open,
  onClose,
  options,
  onAfterOptionClick = null,
  itemType = 'primary',
}) => {
  const handleOptionClick = (event, onClick) => {
    if (typeof onAfterOptionClick === 'function') onAfterOptionClick();

    onClick();
  };

  const ButtonComponent =
    itemType === 'secondary' ? SecondaryButton : PrimaryButton;

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
        {options?.map(({ key, label, onClick }) => {
          if (key !== undefined && key !== '') {
            return (
              <ButtonComponent
                key={key}
                onClick={event => handleOptionClick(event, onClick)}
                type="button"
              >
                {label}
              </ButtonComponent>
            );
          }
          return null;
        })}
      </ButtonsWrapper>
    </StyledPopover>
  );
};

export default MenuPopover;
