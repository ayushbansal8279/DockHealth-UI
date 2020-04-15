import React from 'react';
import styled from 'styled-components';
import ListSwitchChevron from '../../img/list-switch-chevron';
import palette from '../../palette';

interface RotatableChevronProps {
  color?: string;
  rotated: boolean;
}

const ListSwitchContainer = styled.div<Pick<RotatableChevronProps, 'rotated'>>`
  align-items: center;
  display: flex;
  justify-content: center;
  transition: all 0.25s ease-out;
  transform: scaleY(${props => (props.rotated ? -1 : 1)});
  height: 7px;
  width: 10px;

  & svg {
    height: 100%;
    object-fit: contain;
    width: 100%;
  }
`;

const RotatableChevronContainer = styled.div`
  align-self: center;
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  min-width: 2rem;
  width: 2rem;
`;

const HeaderChevronContainer = styled(RotatableChevronContainer)`
  height: 0.75rem;
  min-height: 0.75rem;
  min-width: 3rem;
  width: 3rem;

  & ${ListSwitchContainer} {
    height: 100%;
    width: 100%;
  }
`;

const RotatableChevron = ({
  color = palette.dirtyBanana,
  rotated,
}: RotatableChevronProps) => (
  <ListSwitchContainer rotated={rotated}>
    <ListSwitchChevron color={color} />
  </ListSwitchContainer>
);

export const RotatableChevronWithSpacing = (props: RotatableChevronProps) => (
  <RotatableChevronContainer>
    <RotatableChevron {...props} />
  </RotatableChevronContainer>
);

export const RotatableHeaderChevron = React.forwardRef(
  (props: RotatableChevronProps, reference: React.Ref<HTMLDivElement>) => (
    <HeaderChevronContainer ref={reference}>
      <RotatableChevron {...props} />
    </HeaderChevronContainer>
  ),
);

export default RotatableChevron;
