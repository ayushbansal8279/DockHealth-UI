import palette from '@/app/styles/palette';
import spacing from '@/app/styles/spacing';
import styled from 'styled-components';

export const BuilderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
  background: ${palette.white};
`;

export const CategoryWrapper = styled.div`
  width: 30%;
  height: 100%;
  border-left: 1px solid ${palette.iron};
  border-top: 1px solid ${palette.iron};
`;

export const PlayGroungWrapper = styled.div`
  width: 70%;
  height: 100%;
  border-top: 1px solid ${palette.iron};
  padding: ${spacing.huge};
  display: flex;
  justify-content: center;
`;
