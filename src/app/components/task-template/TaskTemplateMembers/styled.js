/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from 'styled-components';
import { featurePalette } from 'styles/palette';

export const MatchingWrapper = styled.div`
  height: 100%;
  width: 100%;
  ${({ matched }) =>
    matched && `background: ${featurePalette.globalSearchHighlight};`}
`;

export const AssigneeMatchingWrapper = styled(MatchingWrapper)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75%;
  height: 75%;
`;

export const AssigneeWrapper = styled.div`
  opacity: 0;
`;

export const AssigneeContainer = styled.div`
width: 100%;
&:hover {
  & ${AssigneeWrapper} {
    opacity: 1;
  }
`;
