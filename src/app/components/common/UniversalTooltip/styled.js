import styled from 'styled-components';
import { Popper } from '@material-ui/core';

export const TooltipContainer = styled.div`
  padding-top: 0.5rem;
  position: relative;
`;

export const TooltipContainerReverse = styled.div`
  position: relative;
  padding-bottom: 0.6rem;
`;

export const InnerTooltipContainer = styled.div`
  background-color: #3a4657;
  color: #fff;
  padding: 0.5rem;
  z-index: 2;
`;

export const ArrowElement = styled.div`
  background-color: #3a4657;
  height: 1rem;
  position: absolute;
  left: 50%;
  top: 0.5rem;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 1rem;
  z-index: 1;
`;

export const ArrowElementRight = styled.div`
  background-color: #3a4657;
  height: 1rem;
  position: absolute;
  right: ${props => props.endSpacing || 0};
  top: 0.5rem;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 1rem;
  z-index: 1;
`;

export const ArrowElementReverse = styled.div`
  background-color: #3a4657;
  height: 1rem;
  position: absolute;
  left: 50%;
  bottom: -0.4rem;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 1rem;
  z-index: 1;
`;

export const ArrowElementReverseRight = styled.div`
  background-color: #3a4657;
  height: 1rem;
  position: absolute;
  right: 0;
  bottom: -0.4rem;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 1rem;
  z-index: 1;
`;

export const StyledPopper = styled(Popper)`
  && {
    z-index: 10000;
    max-width: ${({ maxWidth }) => maxWidth};
  }
`;

export const ElementWrapper = styled.div`
  display: inline-block;
`;
