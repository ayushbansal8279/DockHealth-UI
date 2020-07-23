import React from 'react';
import {
  TourContent,
  Title,
  Description,
  CloseIconButton,
  CloseIcon,
  NavigationContainer,
  TourButton,
} from 'components/tour-popover/content/styled';
import { ClickAwayListener } from '@material-ui/core';

const StandardTourContent = ({
  title,
  description,
  buttonText,
  onButtonClick,
  onClose,
  width,
}) => {
  return (
    <ClickAwayListener onClickAway={onClose}>
      <TourContent width={width}>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <NavigationContainer>
          <TourButton onClick={onButtonClick}>{buttonText}</TourButton>
        </NavigationContainer>
        <CloseIconButton onClick={onClose} size="small">
          <CloseIcon />
        </CloseIconButton>
      </TourContent>
    </ClickAwayListener>
  );
};

export default StandardTourContent;
