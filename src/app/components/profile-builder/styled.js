import palette from '@/app/styles/palette';
import spacing from '@/app/styles/spacing';
import styled from 'styled-components';

export const BuilderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 100vh;
  background: ${palette.white};
`;

export const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid ${palette.iron};
`;

export const CategoryWrapper = styled.div`
  position: relative;
  width: 30%;
  height: 100%;

  @media (max-width: 1500px) {
    width: 40%;
  }
`;

export const PlayGroungWrapper = styled.div`
  width: 70%;
  height: 100%;
  padding: ${spacing.huge} 0;
  display: flex;
  justify-content: center;

  @media (max-width: 1500px) {
    width: 60%;
  }

  @media (max-width: 1920px) {
    padding: ${spacing.huge} ${spacing.regular};
  }

  @media (max-width: 1024px) {
    padding: ${spacing.regular} ${spacing.small};
  }
`;

export const ProfileBuilderContainer = styled.div`
  height: 100%;
  position: relative;
  overflow: auto;
`;
