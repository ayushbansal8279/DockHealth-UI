import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import { fontSizes } from 'styles/font';

export const UploadBarOuterContainer = styled.div`
  align-items: center;
  display: flex;
  height: 2.5rem;
  width: 106px; // per design
`;

export const UploadBarContainer = styled.div`
  background-color: ${palette.coolGrey3};
  border-radius: 5px;
  height: 5px;
  position: relative;
  width: 100%;
`;

export const UploadBar = styled.div`
  background-color: ${palette.brightBlue};
  border-radius: 5px;
  height: 5px;
  left: 0;
  position: absolute;
  top: 0;
  transition: all 0.25s ease-out;
  width: ${(props) => props.progress ?? 0}%;
  z-index: 1;

  &::after {
    content: '${(props) => props.progress ?? 0}%';
    color: ${palette.darkGrey};
    font-family: inherit;
    font-size: ${fontSizes.small};
    position: absolute;
    right: 0;
    transform: translateX(50%);
    top: 100%;
  }
`;
