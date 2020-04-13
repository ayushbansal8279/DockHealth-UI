import styled from 'styled-components';
import palette, { opacify } from '../palette';
import AuthTemplateTopBackground from '../img/auth-template-top-background.svg';

const mdBreakpoint = 960;

export const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  @media screen and (max-width: ${mdBreakpoint}px) {
    flex-direction: column;
  }
`;

export const LeftSideMainContainer = styled.div`
  align-items: center;
  background-color: ${palette.midnightBlue};
  background-image: linear-gradient(
      to bottom,
      ${opacify(palette.midnightBlue, 0.8)},
      ${opacify(palette.midnightBlue, 0.8)}
    ),
    url(${AuthTemplateTopBackground});
  background-repeat: repeat-x;
  display: flex;
  max-width: 642px;
  height: 100%;
  justify-content: center;
  min-height: 100%;
  padding: 2rem;
  width: 50%;

  @media screen and (max-width: ${mdBreakpoint}px) {
    height: min-content;
    max-width: unset;
    min-height: min-content;
    padding: 1.5rem;
    width: 100%;
  }
`;

export const LeftSideContentContainer = styled.div`
  color: ${palette.white};
  height: min-content;
  min-height: min-content;
  width: 100%;

  @media screen and (min-width: ${mdBreakpoint}px) {
    max-height: 721px;
    max-width: 525px;
  }
`;

export const RightSideMainContainer = styled.div`
  align-items: center;
  background-color: ${palette.white};
  display: flex;
  flex: 1;
  height: min-content;
  justify-content: center;
  min-height: min-content;

  @media screen and (min-width: ${mdBreakpoint}px) {
    height: 100%;
    min-height: 100%;
  }
`;

export const RightSideContentContainer = styled.div`
  align-items: flex-start;
  display: flex;
  height: min-content;
  justify-content: center;
  min-height: min-content;
  padding: 1.5rem;
  width: 100%;

  @media screen and (min-width: ${mdBreakpoint}px) {
    align-items: center;
    height: 100%;
    min-height: 100%;
    padding: 2rem;
    max-width: 495px;
  }
`;
