import { prop } from 'ramda';
import styled from 'styled-components';
import palette from 'styles/palette';

export const StatusLabelContainer = styled.div`
  align-items: center;
  color: ${palette.coolGrey1};
  cursor: pointer;
  display: grid;
  grid-gap: 0.75rem;
  grid-template-columns: 0.25rem 1fr;
  padding: 0.5rem 0.75rem;

  ${({ isHovered }) =>
    isHovered &&
    `
    background-color: ${palette.coolGrey4};
    
    && > * {
      font-weight: bold;
    }
  `}
`;

export const StatusFlag = styled.div`
  background-color: ${prop('color')};
  height: 1.25rem;
  width: 0.25rem;
`;

export const StatusFieldContainer = styled.div`
  position: relative;
`;

export const StatusFlagContainer = styled.div`
  left: -0.25rem;
  position: absolute;
  top: calc(50% + 0.625rem);
  transform: translate(-100%, -50%);
`;
