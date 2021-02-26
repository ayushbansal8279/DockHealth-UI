import styled from 'styled-components';
import palette from 'styles/palette';

export const Wrapper = styled.div`
  position: relative;
  height: 523px;
  width: 971px;
  max-width: 100%;
  max-height: 100%;
  background: ${palette.coolGrey2};
`;

export const VideoLoader = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${palette.coolGrey2};
`;

export const Video = styled.iframe`
  width: 100%;
  height: 100%;
  background-color: ${palette.coolGrey2};
`;
