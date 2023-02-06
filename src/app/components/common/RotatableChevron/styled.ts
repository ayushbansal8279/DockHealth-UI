import styled from 'styled-components';

interface RotatableChevronProps {
  color?: string;
  rotated: boolean;
  onClick: () => void;
}

export const ListSwitchContainer = styled.div<
  Pick<RotatableChevronProps, 'rotated'>
>`
  align-items: center;
  display: flex;
  justify-content: center;
  transition: all 0.25s ease-out;
  transform: scaleY(${props => (props.rotated ? -1 : 1)});
  height: 100%;
  width: 100%;
  cursor: pointer;

  & svg {
    object-fit: contain;
    width: 100%;
  }
`;

export const RotatableChevronContainer = styled.div`
  align-self: center;
  align-items: center;
  display: flex;
  justify-content: center;
  min-width: 2rem;
  width: 2rem;
  cursor: pointer;
`;

export const HeaderChevronContainer = styled(RotatableChevronContainer)`
  height: 0.75rem;
  min-height: 0.75rem;
  min-width: 3rem;
  width: 3rem;

  & ${ListSwitchContainer} {
    width: 100%;
  }
`;
