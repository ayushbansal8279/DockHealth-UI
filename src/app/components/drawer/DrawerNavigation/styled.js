import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

const SUB_MENU_WIDTH = 300;

export const DrawerContentContainer = styled.nav`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: ${({ isOpen }) => (isOpen ? SUB_MENU_WIDTH : 0) + 67}px;
  box-shadow: 0px 4px 11px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  transition: width 0.2s ease-out;
`;

export const MainMenuContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 67px;
`;

export const SubMenuContainer = styled.div`
  height: 100%;
  flex: ${SUB_MENU_WIDTH}px 0 0;
  padding: 6px;
  background: ${palette.white};
  display: flex;
  flex-direction: column;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  overflow: hidden;
`;

export const NavigationButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 67px;
  ${({ subMenuOpen }) => subMenuOpen && `background-color: ${palette.white}; `}
  ${({ isActive }) => !isActive && `cursor: pointer;`}
`;

export const NavigationIconContainer = styled.div`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 47px;
    color: ${({ isActive }) =>
      isActive ? palette.oPlusRed : palette.coolGrey2};

    ${({ subMenuOpen, isActive }) =>
      !subMenuOpen &&
      !isActive &&
      `
        &:hover {
          color: ${palette.white};
        }
    `}
  }
`;
