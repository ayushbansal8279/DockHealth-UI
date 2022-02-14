/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from 'styled-components';

export const HorizontalScrollOuterWrapper = styled.div`
  position: relative;
  display: flex;
  overflow-x: auto;
  overflow-y: overlay;
  flex: 1;
`;
export const HorizontalScrollInnerWrapper = styled.div`
  width: fit-content;
  flex: 1;
`;

export const StickyWrapper = styled.div`
  position: sticky;
  left: ${({ left }) => (left ? `${left}px` : '0px')};
  width: ${({ width, decreaseWidth = 0 }) => `${width - decreaseWidth}px`};
  ${({ zIndex }) => (zIndex ? `z-index: ${zIndex};` : '')}
  ${({ stickyTop }) => (stickyTop ? 'top: 0px;' : '')}
`;
