import React from 'react';
import ListSwitchChevron from 'img/list-switch-chevron';
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

const RotatableChevron = ({
  color = palette.dirtyBanana,
  rotated,
  onClick,
}: RotatableChevronProps) => (
  <ListSwitchContainer rotated={rotated} onClick={onClick}>
    <ListSwitchChevron color={color} />
  </ListSwitchContainer>
);

export const RotatableChevronWithSpacing = (props: RotatableChevronProps) => {
  const { onClick } = props;
  return (
    <RotatableChevronContainer onClick={onClick}>
      <RotatableChevron {...props} />
    </RotatableChevronContainer>
  );
};

export const RotatableHeaderChevron = React.forwardRef(
  (props: RotatableChevronProps, reference: React.Ref<HTMLDivElement>) => (
    <HeaderChevronContainer ref={reference}>
      <RotatableChevron {...props} />
    </HeaderChevronContainer>
  ),
);

export default RotatableChevron;
