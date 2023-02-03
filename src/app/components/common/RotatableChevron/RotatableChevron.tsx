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
  width: number;
  height: number;
}

const RotatableChevron = ({
  color = palette.dirtyBanana,
  rotated,
  onClick,
  height = 7,
  width = 10,
}: RotatableChevronProps) => (
  <ListSwitchContainer rotated={rotated} onClick={onClick}>
    <ListSwitchChevron color={color} height={height} width={width}/>
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
