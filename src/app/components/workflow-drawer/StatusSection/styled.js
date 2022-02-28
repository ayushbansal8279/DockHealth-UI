import { prop } from 'ramda';
import styled from 'styled-components';

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
