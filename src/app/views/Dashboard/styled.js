import styled from 'styled-components';
import palette from 'styles/palette';

export const DashboardViewWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  background-color: ${palette.white};
`;

export const DashboardSidebarWrapper = styled.div`
  height: 100%;
  width: ${({ isHidden }) => (isHidden ? 0 : 380)}px;
  border-right: 1px solid ${palette.coolGrey2};
  background-color: ${palette.coolGrey4};
  transition: width 0.3s ease-out;
`;

export const DashboardContentWrapper = styled.div`
  flex: 1;
  height: 100%;
  overflow: hidden;
  padding-right: ${({ hasRightPadding }) => (hasRightPadding ? 380 : 0)}px;
  transition: padding-right 0.3s ease-out;
  max-width: 1440px;
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
