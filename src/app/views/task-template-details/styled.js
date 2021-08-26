/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const ContextMenu = styled.div`
  position: absolute;
  left: 20px;
  top: 20px;
  height: 270px;
  width: 160px;
  padding: 16px;
  background-color: ${palette.white};
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15);
  z-index: 10;
`;

export const ElementsSidebar = styled.div`
  width: 190px;
  height: 100%;
  padding: 32px 0;
  box-shadow: 0px 2.13948px 6.41845px rgba(0, 0, 0, 0.25);
  background: ${palette.white};
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.smallPlus};
  color: ${palette.mediumGrey};
  text-align: left;
`;

export const SidebarTitle = styled.p`
  padding: 0 16px;
  margin-bottom: 0;
  font-size: inherit;
  font-weight: ${fontWeights.regular};
  text-transform: uppercase;
`;

export const ElementButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px;
  transition: background-color 0.3s linear;

  &:hover {
    background-color: ${palette.brightBlueWithAlpha};
  }
`;

export const ElementIconBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 32px 0 0;
  height: 32px;
  border-radius: 5px;
  background-color: ${palette.brightBlue};
  color: ${palette.white};
`;

export const ElementDescription = styled.p`
  display: block;
  flex: 1;
  margin-left: 12px;
  margin-bottom: 0;
  font-size: inherit;
  font-weight: inherit;
  font-weight: ${fontWeights.regular};
  color: inherit;
  text-transform: uppercase;
  text-align: left;
`;

export const TaskElementIcon = styled.div`
  width: 16px;
  height: 11px;
  border: 1px solid ${palette.white};
  border-radius: 3px;
  color: inherit;
`;

export const BuilderHeader = styled.div`
  position: absolute;
  top: 14px;
  left: 56px;
  display: flex;
  align-items: center;
  z-index: 5;
`;

export const BuilderHeaderText = styled.p`
  margin-bottom: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 32px;
  color: ${palette.mediumGrey};
`;
