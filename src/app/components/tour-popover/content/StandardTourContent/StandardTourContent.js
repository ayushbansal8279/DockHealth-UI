import React from 'react';
import {
  TourContent,
  Title,
  Description,
  NavigationContainer,
  TourButton,
} from 'components/tour-popover/content/styled';

const StandardTourContent = ({
  title,
  description,
  buttonText,
  onButtonClick,
  width,
}) => {
  return (
    <TourContent width={width}>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {buttonText && (
        <NavigationContainer>
          <TourButton onClick={onButtonClick}>{buttonText}</TourButton>
        </NavigationContainer>
      )}
    </TourContent>
  );
};

export default StandardTourContent;
