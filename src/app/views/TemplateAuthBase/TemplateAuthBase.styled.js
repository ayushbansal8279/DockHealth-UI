import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';
import AuthTemplateTopBackgroundTop from 'img/Bubble_Pattern_Top.svg';
import AuthTemplateTopBackgroundBottom from 'img/Bubble_Pattern_Bottom.svg';

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
      ${opacify(palette.midnightBlue, 0.5)},
      ${opacify(palette.midnightBlue, 0.5)}
    ),
    url(${AuthTemplateTopBackgroundTop}),
    url(${AuthTemplateTopBackgroundBottom});
  background-repeat: repeat-x;
  background-position: bottom, top;
  display: flex;
  max-width: 642px;
  justify-content: center;
  padding-left: 7rem;
  padding-right: 7rem;
  padding-bottom: 0;
  width: 50%;

  @media screen and (max-width: ${mdBreakpoint}px) {
    max-width: unset;
    padding: 1.5rem;
    width: 100%;
  }

  @media screen and (min-height: 750px) {
    padding-bottom: 7rem;
  }
`;

export const LeftSideContentContainer = styled.div`
  color: ${palette.white};
  width: 100%;
  height: auto;

  @media screen and (min-width: ${mdBreakpoint}px) {
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
