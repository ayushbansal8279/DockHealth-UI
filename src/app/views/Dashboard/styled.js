import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const DashboardViewWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: ${palette.white};
`;

export const DashboardSidebarWrapper = styled.div`
  height: 100%;
  width: ${({ isHidden }) => (isHidden ? 0 : 280)}px;
  border-right: 1px solid ${palette.coolGrey2};
  background-color: ${palette.coolGrey4};
  transition: width 0.3s ease-out;

  @media (min-width: 1153px) {
    width: ${({ isHidden }) => (isHidden ? 0 : 380)}px;
  }
`;

export const DashboardContentWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  ${({ fullWidth }) => !fullWidth && 'max-width: 1440px;'}
  height: calc(100% - ${spacing.large});
  padding-right: ${({ hasRightPadding }) => (hasRightPadding ? 380 : 0)}px;
  margin-top: ${spacing.large};
  transition: padding-right 0.3s ease-out;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const DashboardTourBackground = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
`;

export const DashboardTourWrapper = styled.div`
  position: fixed;
  top: 150px;
  left: 50%;
  transform: translateX(-40%);
  z-index: 201;
`;

export const DashboardHeaderContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0 55px;
`;

export const MenuButton = styled.button`
  margin-right: 88px; // per design
  outline: none;
  cursor: pointer;
`;

export const DashboardFirstVisitViewWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: ${spacing.regularPlus};
  border-top: 1px solid ${palette.coolGrey2};
`;
