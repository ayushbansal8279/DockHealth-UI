import styled from 'styled-components';
import palette from 'styles/palette';

export const DashboardViewWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

export const DashboardSidebarWrapper = styled.div`
  height: 100%;
  width: 380px;
  border-right: 1px solid ${palette.coolGrey2};
  background-color: ${palette.coolGrey4};
`;

export const DashboardContentWrapper = styled.div`
  flex: 1;
  height: 100%;
  overflow: hidden;
  background-color: ${palette.white};
`;
