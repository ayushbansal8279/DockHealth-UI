import styled from 'styled-components';
import palette from 'styles/palette';

export const VideoContainer = styled.div`
  width: ${({ width }) => (typeof width === 'string' ? width : `${width}px`)};
  height: ${({ height }) =>
    typeof height === 'string' ? height : `${height}px`};
`;

export const VideoIFrame = styled.iframe`
  min-height: 15rem;
  width: 100%;
  background-color: ${palette.white};
  border: 1px solid ${palette.coolGrey3};
`;
