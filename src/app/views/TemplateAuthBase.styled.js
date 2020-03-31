import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import palette, { opacify } from '../palette';

export const BackgroundContainer = styled.div`
  align-items: center;
  background: linear-gradient(
      180deg,
      ${palette.black} -21.76%,
      ${palette.darkGreyBlue} 100%
    ),
    ${palette.darkGreyBlue};
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
`;

export const BackgroundModalContainer = styled(Grid)`
  background-image: url(/assets/img/login-background.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 6px;
  box-shadow: 0px 2px 4px ${opacify(palette.black, 0.5)};
  height: 848px;
  max-height: 848px;
  max-width: 984px;
  overflow: hidden;
  position: relative;
  z-index: -1;
`;

export const BackgroundRectangleContainer = styled.div`
  background-color: ${palette.white};
  display: flex;
  height: 100%;
  left: 0;
  max-width: 100%;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: -1;
`;

export const SlantedBackgroundRectangleContainer = styled.div`
  background-color: ${palette.white};
  box-shadow: 0px 0.125rem 0.25rem ${opacify(palette.black, 0.2)};
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transform: translateX(-50%) scale(2) rotate(12.37deg);
  width: 50%;
  z-index: -1;
`;

export const DockLogoContainer = styled.div`
  && {
    height: 108px;
    max-height: 108px;
  }

  @media only screen and (min-width: 960px) {
    && {
      height: 180px;
      max-height: 180px;
    }
  }
`;

export const MainContentContainer = styled.div`
  display: flex;
  flex: 1;
`;

export const DockLogo = styled.img`
  height: 100%;
  object-fit: contain;
  object-position: left center;
`;

export const ContentContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-basis: 100%;
  flex-flow: column nowrap;
  flex-grow: 0;
  height: 100%;
  max-width: 100%;
  padding: 1rem;

  @media only screen and (min-width: 960px) {
    flex-basis: 50%;
    max-width: 50%;
    padding: 2rem;
    padding-top: 3rem;
  }
`;

export const TemplateAuthBaseContainer = styled.div`
  min-height: 848px;
  overflow-y: auto;
`;
