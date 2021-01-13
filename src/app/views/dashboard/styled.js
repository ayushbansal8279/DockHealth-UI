import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import Confetti from 'react-confetti';

export const DashboardViewWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: ${palette.white};
`;

export const DashboardScrollableList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 24px);
  margin-top: ${spacing.regular};
  overflow-x: hidden;
  overflow-y: auto;
`;

export const DashboardContentWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding-right: ${({ hasRightPadding }) => (hasRightPadding ? 380 : 0)}px;
  transition: padding-right 0.3s ease-out;
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
  align-items: center;
  flex-direction: row;
  padding: 0 55px;
`;

export const DashboardFirstVisitViewWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: ${spacing.regularPlus};
  border-top: 1px solid ${palette.coolGrey2};
`;

export const DashboardListWrapper = styled.div`
  ${({ fullWidth }) => !fullWidth && 'max-width: 1440px;'}
`;

export const StyledConfetti = styled(Confetti)`
  z-index: 101;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
