import Grid from '@material-ui/core/Grid';
import React from 'react';
import styled from 'styled-components';

export const BackgroundContainer = styled.div`
  align-items: center;
  background: linear-gradient(180deg, #0a0909 -21.76%, #125375 100%), #125375;
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
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  height: 846px;
  max-height: 846px;
  max-width: 984px;
  overflow: hidden;
  position: relative;
  z-index: -1;
`;

export const BackgroundRectangleContainer = styled.div`
  display: flex;
  height: 100%;
  left: 0;
  max-width: 100%;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: -1;

  & img {
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    object-position: left center;
    width: 100%;
  }
`;

export const SmallBackgroundRectangleContainer = styled.div`
  background-color: #fff;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: -1;
`;

export const DockLogoContainer = styled.div`
  && {
    height: 100px;
    max-height: 100px;
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
  flex-flow: column nowrap;
  flex-grow: 0;
  padding: 2rem;
  width: 100%;

  flex-basis: 100%;
  max-width: 100%;

  @media screen and (min-width: 959.95px) and (min-height: 845.95px) {
    flex-basis: 50%;
    max-width: 50%;
  }
`;

export const BigTemplateAuthBaseContainer = styled.div`
  @media screen and (max-width: 959.95px), screen and (max-height: 845.95px) {
    display: none;
  }
`;

export const SmallTemplateAuthBaseContainer = styled.div`
  min-height: 846px;
  overflow-y: auto;

  @media screen and (min-width: 960px) and (min-height: 846px) {
    display: none;
  }
`;
