import palette from '@/app/styles/palette';
import spacing from '@/app/styles/spacing';
import styled from 'styled-components';

export const BuilderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
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
`;

export const PlayGroungWrapper = styled.div`
  width: 70%;
  height: 100%;
  padding: ${spacing.huge};
  display: flex;
  
  
  justify-content: center;
`;

export const ProfileBuilderContainer = styled.div`
  height: 100%;
  position: relative;
  overflow: auto;
`;
