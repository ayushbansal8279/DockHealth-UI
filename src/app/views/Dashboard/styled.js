import styled from 'styled-components';
import palette from 'styles/palette';

export const DashboardViewWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
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
  background-color: ${palette.white};
  padding-right: ${({ hasRightPadding }) => (hasRightPadding ? 380 : 0)}px;
  transition: padding-right 0.3s ease-out;
`;
