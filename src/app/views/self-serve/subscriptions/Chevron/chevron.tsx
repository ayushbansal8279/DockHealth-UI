import React from 'react';
import ProfessionalServicesChevron from 'img/professional-services-chevron';

import palette from 'styles/palette';
import {
  HeaderChevronContainer,
  ListSwitchContainer,
  RotatableChevronContainer,
} from './styled';

interface RotatableChevronProps {
  color?: string;
  rotated: boolean;
  onClick?: () => void;
}

const Chevron = ({
  color = palette.dirtyBanana,
  rotated,
  onClick,
}: RotatableChevronProps) => (
  <ListSwitchContainer rotated={rotated} onClick={onClick}>
    <ProfessionalServicesChevron color={color} />
  </ListSwitchContainer>
);

export const RotatableChevronWithSpacing = (props: RotatableChevronProps) => {
  const { onClick } = props;
  return (
    <RotatableChevronContainer onClick={onClick}>
      <Chevron {...props} />
    </RotatableChevronContainer>
  );
};

export const RotatableHeaderChevron = React.forwardRef(
  (props: RotatableChevronProps, reference: React.Ref<HTMLDivElement>) => (
    <HeaderChevronContainer ref={reference}>
      <Chevron {...props} />
    </HeaderChevronContainer>
  ),
);

export default Chevron;
