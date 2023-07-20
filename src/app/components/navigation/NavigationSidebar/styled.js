import styled from 'styled-components';
import MuiBarChartIcon from '@mui/icons-material/BarChart';
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
  height: 47px !important;
  ${({ subMenuOpen }) => subMenuOpen && `background-color: ${palette.white}; `}
  ${({ isActive }) => !isActive && `cursor: pointer;`}
`;

export const NavigationIconContainer = styled.div`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 47px;
    color: ${({ isActive, navSelectedColor }) =>
      isActive ? navSelectedColor || palette.oPlusRed : palette.coolGrey2};

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

export const NavigationIconNewLabel = styled.div`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 14px;
    font-size: 12px;
    font-weight: 700;
    color: ${palette.brightBlue};
    margin-bottom: -10px;
  }
`;

export const DockcoinIcon = styled.img`
  width: 48px;
`;

export const BarChartIcon = styled(MuiBarChartIcon)`
  &&& {
    &.MuiBarCharIcon-root {
      width: 32px;
      height: 32px;
    }
  }
`;

export const NewLabel = styled.div`
  position: absolute;
  top: -4px;
  right: -6px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${palette.oPlusRed};
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
  transition: opacity 0.3s ease-out;
`;
