import styled from 'styled-components';
import palette from 'styles/palette';

const mdBreakpoint = 960;

export const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;

  @media screen and (max-width: ${mdBreakpoint}px) {
    flex-direction: column;
  }
`;

export const LeftSideMainContainer = styled.div`
  align-items: center;
  background-color: #fbfaf9;
  background-repeat: repeat-x;
  background-position: bottom, top;
  display: flex;
  max-width: 50%;
  justify-content: center;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 0;
  width: 50%;

  @media screen and (max-width: 600px) {
    && {
      display: none;
      padding: 0;
    }
  }

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
    max-width: 640px;
  }
`;

export const RightSideMainContainer = styled.div`
  background-color: ${palette.white};

  @media screen and (min-width: ${mdBreakpoint}px) {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
`;

export const RightSideContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: auto;

  @media screen and (min-width: ${mdBreakpoint}px) {
    max-height: 100%;
    overflow-y: auto;
  }
`;

export const RightSideMaxWidthContainer = styled.div`
  width: 100%;
  padding: 1.5rem;

  @media screen and (min-width: ${mdBreakpoint}px) {
    padding: 2rem;
    max-width: 495px;
  }
`;
