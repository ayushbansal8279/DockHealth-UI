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
  padding: 2rem;
  width: 50%;

  @media screen and (max-width: ${mdBreakpoint}px) {
    height: auto;
    max-width: unset;
    padding: 1.5rem;
    width: 100%;
  }
`;

export const LeftSideContentContainer = styled.div`
  color: ${palette.white};
  height: 100%;
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
  justify-content: center;
`;

export const RightSideContentContainer = styled.div`
  align-items: flex-start;
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 1.5rem;
  width: 100%;

  @media screen and (min-width: ${mdBreakpoint}px) {
    align-items: center;
    padding: 2rem;
    max-width: 495px;
  }
`;
