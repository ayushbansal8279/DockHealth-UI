import React from 'react';
import styled from 'styled-components';
import ListSwitchChevron from '../../img/list-switch-chevron.svg';

interface RotatableChevronProps {
  rotated?: boolean;
}

const ListSwitchContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  transition: all 0.25s ease-out;
  transform: scaleY(
    ${(props: RotatableChevronProps) => (props.rotated ? -1 : 1)}
  );
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

const RotatableChevron = ({ rotated }: RotatableChevronProps) => (
  <ListSwitchContainer rotated={rotated}>
    <img src={ListSwitchChevron} alt="List switch" />
  </ListSwitchContainer>
);

export const RotatableChevronWithSpacing = ({
  rotated,
}: RotatableChevronProps) => (
  <RotatableChevronContainer>
    <RotatableChevron rotated={rotated} />
  </RotatableChevronContainer>
);

export default RotatableChevron;
